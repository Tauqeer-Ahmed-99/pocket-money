import crypto from "crypto";
import {
  InitiatePaymentParams,
  PaymentHashInfo,
  StandingInstructionsDetails,
  ValidateVPARequestParams,
  ValidateVPAResponse,
} from "@/models/payments";
import { NewRecipientSchema } from "@/models/zod";
import z from "zod";
import PayU from "./payu";

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
    paymentDetails: z.infer<typeof NewRecipientSchema>
  ): PaymentHashInfo => {
    const txnId = this.generateTxnId();
    const amount = parseFloat(paymentDetails.amount).toFixed(2);
    const productInfo = `Pocket Money - ${"MONTHLY"} - ${
      paymentDetails.firstName
    } ${paymentDetails.lastName}`;
    const firstName = paymentDetails.firstName;
    const email = paymentDetails.email;
    const udf1 = paymentDetails.phone || "";
    const udf2 = "";
    const udf3 = "";
    const udf4 = "";
    const udf5 = "";
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
      paymentStartDate: new Date().toISOString().split("T")[0],
      paymentEndDate: paymentDetails.endDate.toISOString().split("T")[0],
    };

    const hashString = [
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
      JSON.stringify(siDetails),
      SALT,
    ].join("|");

    const hash = this.sha512(hashString);

    return {
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

  static getInitiatePaymentForm = (
    paymentDetails: z.infer<typeof NewRecipientSchema>
  ) => {
    const paymentHashInfo = this.generatePaymentHashInfo(paymentDetails);
    const params = {
      key: PayU.Client.credes.key,
      txnid: paymentHashInfo.txnId,
      amount: paymentHashInfo.siDetails.billingAmount,
      productinfo: paymentHashInfo.productInfo,
      firstname: paymentDetails.firstName,
      lastname: paymentDetails.lastName,
      email: paymentDetails.email,
      phone: paymentDetails.phone,
      udf1: paymentHashInfo.udfDetails.udf1,
      surl: `${APP_URL}/api/payment/success`,
      furl: `${APP_URL}/api/payment/failure`,
      api_version: "7" as "7",
      si: "4" as "4",
      si_details: paymentHashInfo.siDetails,
      hash: paymentHashInfo.hash,
    };

    return this.generatePayUInitiatePaymentForm(params);
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
}

export default PaymentService;
