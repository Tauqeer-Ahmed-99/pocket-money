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

export type VerifyPaymentRequestParams = {
  txnId: string;
};

export type VerifyPaymentResponse = {
  status: 0 | 1;
  msg: string;
  request_id: string;
  bank_ref_num: string;
  transaction_details: {
    mihpayid: string;
    request_id: string;
    bankrefnum: string;
    amt: string;
    transaction_amount: string;
    productinfo: string;
    firstname: string;
    bankcode: string;
    udf1: string;
    udf2: string;
    udf3: string;
    udf4: string;
    udf5: string;
    field2: string;
    field5: string;
    field3: string;
    field9: string;
    error_code: string;
    net_amount_debit: string;
    added_on: string;
    payment_source: string;
    card_type: string;
    error_Message: string;
    disc: string;
    Mode: string;
    PG_TYPE: string;
    card_no: string;
    name_on_card: string;
    status: string;
    unmappedstatus: string;
    Merchant_UTR: string;
    Settled_at: string;
  };
};
