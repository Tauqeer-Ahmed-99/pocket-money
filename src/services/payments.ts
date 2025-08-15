import crypto, { Verify } from "crypto";
import {
  InitiatePaymentParams,
  PaymentHashInfo,
  StandingInstructionsDetails,
  ValidateVPARequestParams,
  ValidateVPAResponse,
  VerifyPaymentResponse,
} from "@/models/payments";
import { NewRecipientSchema } from "@/models/zod";
import z from "zod";
import PayU from "./payu";
import RecipientsDAL from "@/database/access-layer/recipients-dal";
import { InferInsertModel } from "drizzle-orm";
import { Transactions } from "@/database/schema";
import UsersService from "./users";
import { start } from "repl";
import TransactionsService from "./transactions";

if (!process.env.PAYU_MERCHANT_KEY) {
  throw new Error(
    "PAYU_MERCHANT_KEY is not defined in the environment variables."
  );
}
if (!process.env.PAYU_SALT_32BIT) {
  throw new Error(
    "PAYU_SALT_32BIT is not defined in the environment variables."
  );
}
if (!process.env.PAYU_SALT_256BIT) {
  throw new Error(
    "PAYU_SALT_256BIT is not defined in the environment variables."
  );
}
if (!process.env.NEXT_APP_URL) {
  throw new Error("NEXT_APP_URL is not defined in the environment variables.");
}

const KEY = process.env.PAYU_MERCHANT_KEY!;
const SALT = process.env.PAYU_SALT_256BIT!;
const APP_URL = process.env.NEXT_APP_URL!;

class PaymentService {
  static generateTxnId = () => {
    return `txn_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  };

  static sha512 = (data: string) => {
    return crypto.createHash("sha512").update(data).digest("hex");
  };

  static generatePaymentHashInfo = (
    paymentDetails: z.infer<typeof NewRecipientSchema> & {
      vpa: string;
      startDate: Date;
    },
    reverseHash = false,
    status?: string,
    transactionId?: string
  ): PaymentHashInfo => {
    const txnId = reverseHash
      ? (transactionId as string)
      : this.generateTxnId();
    const amount = parseFloat(paymentDetails.amount).toFixed(2);
    const productInfo = `Pocket Money - ${"MONTHLY"} - ${
      paymentDetails.firstName
    } ${paymentDetails.lastName}`;
    const firstName = paymentDetails.customerFirstName;
    const email = paymentDetails.customerEmail;
    const udf1 = paymentDetails.firstName || "";
    const udf2 = paymentDetails.lastName || "";
    const udf3 = paymentDetails.email || "";
    const udf4 = paymentDetails.phone || "";
    const udf5 = paymentDetails.vpa || ""; // VPA is used as udf5
    const udf6 = ""; // empty
    const udf7 = ""; // empty
    const udf8 = ""; // empty
    const udf9 = ""; // empty
    const udf10 = ""; // empty
    const siDetails: StandingInstructionsDetails = {
      billingAmount: amount,
      billingCurrency: "INR",
      billingCycle: "MONTHLY",
      billingInterval: 1,
      paymentStartDate: paymentDetails.startDate.toISOString().split("T")[0],
      paymentEndDate: paymentDetails.endDate.toISOString().split("T")[0],
    };

    const hashStringContent = [
      KEY,
      txnId,
      amount,
      productInfo,
      firstName,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      udf6,
      udf7,
      udf8,
      udf9,
      udf10,
      reverseHash ? status : JSON.stringify(siDetails),
      SALT,
    ];

    const hashString = reverseHash
      ? hashStringContent.reverse().join("|")
      : hashStringContent.join("|");

    const hash = this.sha512(hashString);

    return {
      key: KEY,
      hash,
      txnId,
      productInfo,
      apiVersion: "7",
      si: "4",
      siDetails,
      udfDetails: {
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
        udf6,
        udf7,
        udf8,
        udf9,
        udf10,
      },
    };
  };

  static generatePayUInitiatePaymentForm = (
    params: InitiatePaymentParams & { key: string; hash: string }
  ) => {
    function inputGen(name: string, val: any) {
      if (typeof val == "object")
        return (
          "<input hidden type='text' name='" +
          name +
          "' value='" +
          JSON.stringify(val) +
          "'/>"
        );
      else
        return (
          "<input hidden type='text' name='" + name + "' value='" + val + "'/>"
        );
    }

    const header = `<form name="payment_post" id="payment_post" action="${PayU.Client.credes.paymentURL}" method="post">`;
    const footer = `</form>`;
    // const footer = `</form><script type='text/javascript'> window.onload=function(){document.forms['payment_post'].submit();}</script>`;

    let inputs = header;

    for (let key in params) {
      inputs += inputGen(key, (params as { [key: string]: any })[key]);
    }

    return inputs + footer;
  };

  static initiatePaymentForm = async (
    paymentDetails: z.infer<typeof NewRecipientSchema> & {
      vpa: string;
      startDate: Date;
    },
    userId: string
  ) => {
    const paymentHashInfo = this.generatePaymentHashInfo(paymentDetails);

    const userProfile = await UsersService.getUserProfile(userId); // to get user address details

    const params = {
      key: PayU.Client.credes.key,
      txnid: paymentHashInfo.txnId,
      amount: paymentHashInfo.siDetails.billingAmount,
      productinfo: paymentHashInfo.productInfo,
      firstname: paymentDetails.customerFirstName,
      lastname: paymentDetails.customerLastName,
      address1: userProfile?.addressLine1 || "",
      address2: userProfile?.addressLine2 || "",
      city: userProfile?.city || "",
      state: userProfile?.region || "",
      country: userProfile?.country || "",
      zipcode: userProfile?.postalCode || "",
      email: paymentDetails.customerEmail,
      phone: paymentDetails.customerPhone,
      udf1: paymentHashInfo.udfDetails.udf1,
      udf2: paymentHashInfo.udfDetails.udf2,
      udf3: paymentHashInfo.udfDetails.udf3,
      udf4: paymentHashInfo.udfDetails.udf4,
      udf5: paymentHashInfo.udfDetails.udf5,
      surl: `${APP_URL}/api/payment/success`,
      furl: `${APP_URL}/api/payment/failure`,
      api_version: "7" as "7",
      si: "4" as "4",
      si_details: paymentHashInfo.siDetails,
      hash: paymentHashInfo.hash,
    };

    const form = this.generatePayUInitiatePaymentForm(params);

    const recipientData = {
      firstname: paymentDetails.firstName,
      lastname: paymentDetails.lastName,
      email: paymentDetails.email,
      phone: paymentDetails.phone,
      createdBy: userId,
    };

    const pocketMoneyDetails = {
      amount: paymentDetails.amount,
      startDate: paymentDetails.startDate,
      endDate: paymentDetails.endDate,
      createdBy: userId,
    };

    const transactionDetails: Omit<
      InferInsertModel<typeof Transactions>,
      "pocketMoneyId"
    > = {
      paymentGatewayTxnId: paymentHashInfo.txnId,
      productinfo: paymentHashInfo.productInfo,
      amount: paymentDetails.amount,
      firstname: paymentDetails.customerFirstName,
      lastname: paymentDetails.customerLastName,
      address1: userProfile?.addressLine1 || "",
      address2: userProfile?.addressLine2 || "",
      city: userProfile?.city || "",
      state: userProfile?.region || "",
      country: userProfile?.country || "",
      zipcode: userProfile?.postalCode || "",
      email: paymentDetails.customerEmail,
      phone: paymentDetails.customerPhone,
      udf1: paymentHashInfo.udfDetails.udf1 || "",
      udf2: paymentHashInfo.udfDetails.udf2 || "",
      udf3: paymentHashInfo.udfDetails.udf3 || "",
      udf4: paymentHashInfo.udfDetails.udf4 || "",
      udf5: paymentHashInfo.udfDetails.udf5 || "",
      udf6: paymentHashInfo.udfDetails.udf6 || "",
      udf7: paymentHashInfo.udfDetails.udf7 || "",
      udf8: paymentHashInfo.udfDetails.udf8 || "",
      udf9: paymentHashInfo.udfDetails.udf9 || "",
      udf10: paymentHashInfo.udfDetails.udf10 || "",
      key: PayU.Client.credes.key,
      hash: paymentHashInfo.hash,
      createdBy: userId,
    };

    const { recipient, pocketMoney, transaction } =
      await RecipientsDAL.createRecipientWithPocketMoney(
        recipientData,
        pocketMoneyDetails,
        transactionDetails,
        userId
      );

    return {
      form,
      paymentHashInfo,
      recipient,
      pocketMoney,
      transaction,
    };
  };

  static getAuthHeaderForVPAValidation = (
    requestBody: string,
    date: string
  ) => {
    const AUTH_TYPE = "sha512";
    const SECRET = process.env.PAYU_SALT_32BIT!;

    // If GET request and no body, requestBody should be ""
    const hashString = [requestBody, date, SECRET].join("|");
    const hash = this.sha512(hashString);

    return `hmac username="${KEY}", algorithm="${AUTH_TYPE}", headers="date", signature="${hash}"`;
  };

  static validateVPAManual = async (
    vpa: string
  ): Promise<ValidateVPAResponse> => {
    const body: ValidateVPARequestParams = {
      vpa,
      isAutoVPAValid: true, // This parameter is used to check if the VPA is valid for Autopay or UPI Recurring Payments or not.
    };

    const date = new Date().toUTCString();
    const requestBody = ""; // GET request has no body
    const authorization = this.getAuthHeaderForVPAValidation(requestBody, date);

    // const url = new URL("https://test.payu.in/payment-mode/v1/upi/vpa");
    const url = new URL("https://info.payu.in/payment-mode/v1/upi/vpa");

    url.searchParams.append("vpa", body.vpa);
    url.searchParams.append("isAutoVPAValid", body.isAutoVPAValid.toString());

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization,
        date,
      },
    };

    const response = await fetch(url, options);
    const data: ValidateVPAResponse = await response.json();

    return data;
  };

  static initiatePayment = (
    paymentDetails: z.infer<typeof NewRecipientSchema>
  ) => {
    const productInfo = `Pocket Money - ${"MONTHLY"} - ${
      paymentDetails.firstName
    } ${paymentDetails.lastName}`;

    const params: InitiatePaymentParams = {
      txnid: this.generateTxnId(),
      amount: parseFloat(paymentDetails.amount).toFixed(2),
      productinfo: productInfo,
      firstname: paymentDetails.firstName,
      lastname: paymentDetails.lastName,
      email: paymentDetails.email,
      phone: paymentDetails.phone,
      surl: `${APP_URL}/api/payment/success`,
      furl: `${APP_URL}/api/payment/failure`,
      api_version: "7",
      si: "4",
      si_details: {
        billingAmount: paymentDetails.amount,
        billingCurrency: "INR",
        billingCycle: "MONTHLY",
        billingInterval: 1,
        paymentStartDate: new Date().toISOString().split("T")[0],
        paymentEndDate: paymentDetails.endDate.toISOString().split("T")[0],
      },
    };

    return PayU.Client.paymentInitiate(params);
  };

  static validateVPA = async (vpa: string): Promise<ValidateVPAResponse> => {
    return PayU.Client.validateVPA(vpa);
  };

  static verifyPayment = async (
    txnId: string
  ): Promise<VerifyPaymentResponse> => {
    return PayU.Client.verifyPayment(txnId);
  };

  static validatePayment = async (
    txnId: string,
    txnDetails: Partial<InferInsertModel<typeof Transactions>>,
    receivedReverseHash: string
  ): Promise<URL> => {
    const [_, transaction, verifyPaymentResult] = await Promise.all([
      TransactionsService.updateTransaction(txnId, txnDetails),
      TransactionsService.getTransaction(txnId),
      PaymentService.verifyPayment(txnId),
    ]);

    const paymentDetails: z.infer<typeof NewRecipientSchema> & {
      vpa: string;
      startDate: Date;
    } = {
      amount: transaction?.amount || "",
      firstName: transaction?.udf1 || "",
      lastName: transaction?.udf2 || "",
      email: transaction?.udf3 || "",
      phone: transaction?.udf4 || "",
      vpa: transaction?.udf5 || "",
      customerEmail: transaction?.email || "",
      customerFirstName: transaction?.firstname || "",
      customerLastName: transaction?.lastname || "",
      customerPhone: transaction?.phone || "",
      startDate: transaction?.pocketMoney.startDate as Date,
      endDate: transaction?.pocketMoney.endDate as Date,
    };

    const generateReverseHash = true;
    const { hash: reverseHash } = PaymentService.generatePaymentHashInfo(
      paymentDetails,
      generateReverseHash,
      txnDetails.txnStatus,
      txnId
    );

    const isValidTxn = receivedReverseHash === reverseHash;

    if (verifyPaymentResult.status === 0) {
      const url = new URL(`${APP_URL}/payment/process/error`);
      url.searchParams.append("txnStatus", "failed");
      url.searchParams.append(
        "message",
        "Payment processing failed, verification failed."
      );

      await TransactionsService.updateFinalStatus(
        txnId,
        receivedReverseHash,
        reverseHash,
        isValidTxn,
        "error",
        "Payment processing failed, verification failed."
      );

      return url;
    }

    if (!isValidTxn) {
      const url = new URL(`${APP_URL}/payment/process/error`);

      url.searchParams.append("txnStatus", "failed");
      url.searchParams.append(
        "message",
        "Payment processing failed, invalid transaction."
      );

      await TransactionsService.updateFinalStatus(
        txnId,
        receivedReverseHash,
        reverseHash,
        isValidTxn,
        "error",
        "Payment processing failed, invalid transaction."
      );

      return url;
    }

    if (
      !transaction ||
      !transaction.pocketMoneyId ||
      !transaction.pocketMoney ||
      !transaction.pocketMoney.recipientId
    ) {
      const url = new URL(`${APP_URL}/payment/process/error`);

      url.searchParams.append("txnStatus", "error");
      url.searchParams.append(
        "message",
        "Payment processing failed, transaction details not found"
      );

      await TransactionsService.updateFinalStatus(
        txnId,
        receivedReverseHash,
        reverseHash,
        isValidTxn,
        "error",
        "Payment processing failed, transaction details not found"
      );

      return url;
    }

    const url = new URL(
      `${APP_URL}/pm-recipients/${transaction.pocketMoney.recipientId}/${transaction.pocketMoneyId}`
    );

    const txnStatus = txnDetails.txnStatus ?? "";
    const message = txnDetails.field9 ?? "";

    url.searchParams.append("txnStatus", txnStatus);
    url.searchParams.append("message", message);

    return url;
  };
}

export default PaymentService;
