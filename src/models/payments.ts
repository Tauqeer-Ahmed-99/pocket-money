export type StandingInstructionsDetails = {
  billingAmount: string;
  billingCurrency: "INR";
  billingCycle: "MONTHLY" | "QUARTERLY" | "YEARLY";
  billingInterval: number;
  paymentStartDate: string;
  paymentEndDate: string;
};

export type PaymentHashInfo = {
  key: string;
  txnId: string;
  siDetails: StandingInstructionsDetails;
  hash: string;
  productInfo: string;
  apiVersion: "7";
  si: "1" | "4"; // 4 Indicates Pay & Subscribe
  udfDetails: {
    udf1: string;
    udf2: string;
    udf3: string;
    udf4: string;
    udf5: string;
    udf6: string;
    udf7: string;
    udf8: string;
    udf9: string;
    udf10: string;
  };
};

export type InitiatePaymentParams = {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  api_version: "7";
  si: "1" | "4";
  si_details: StandingInstructionsDetails;
};

export type ValidateVPARequestParams = {
  vpa: string;
  isAutoVPAValid: boolean;
};

export type ValidateVPAResponse = {
  status: "SUCCESS" | "FAILURE";
  vpa: string;
  isVPAValid: 0 | 1;
  isAutoPayVPAValid: 0 | 1;
  isAutoPayBankValid: string;
  payerAccountName: string;
};
