import crypto from "crypto";

class PaymentService {
  static generateTxnId = () => {
    return `txn_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  };

  static sha512 = (data: string) => {
    return crypto.createHash("sha512").update(data).digest("hex");
  };

  static generatePaymentHash = () => {};
}

export default PaymentService;
