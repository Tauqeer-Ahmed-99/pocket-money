import Payu from "payu-websdk";

const PAYU_ENVIRONMENT = process.env.PAYU_ENVIRONMENT!;
const KEY = process.env.PAYU_MERCHANT_KEY!;
const SALT = process.env.PAYU_SALT_256BIT!;

if (!PAYU_ENVIRONMENT) {
  throw new Error("PAYU_ENVIRONMENT is not defined");
}
if (!KEY) {
  throw new Error("PAYU_MERCHANT_KEY is not defined");
}
if (!SALT) {
  throw new Error("PAYU_SALT_256BIT is not defined");
}

class PayUService {
  readonly PayUClient: Payu;

  constructor() {
    this.PayUClient = new Payu(
      {
        key: KEY,
        salt: SALT,
      },
      PAYU_ENVIRONMENT
    );
  }

  get Client() {
    return this.PayUClient;
  }
}

const PayU = new PayUService();

export default PayU;
