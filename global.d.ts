declare module "payu-websdk" {
  export default class Payu {
    constructor(config: { key: string; salt: string }, env: string);

    credes: {
      config: {};
      key: string;
      salt: string;
      paymentPath: string;
      apiPath: string;
      paymentURL: string;
      apiURL: string;
      paymentHost: string;
      apiHost: string;
    };

    paymentInitiate(params: InitiatePaymentParams): string;

    async verifyPayment(txnid: string): Promise<unknown>;

    async validateVPA(vpa: string): Promise<ValidateVPAResponse>;
  }
}
