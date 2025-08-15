import TransactionsDAL from "@/database/access-layer/transactions-dal";
import { Transactions } from "@/database/schema";
import { InferInsertModel } from "drizzle-orm";

class TransactionsService {
  static updateTransaction = (
    txnId: string,
    txnDetails: Partial<InferInsertModel<typeof Transactions>>
  ) => {
    return TransactionsDAL.updateTransaction(txnId, txnDetails);
  };

  static getTransaction = (txnId: string) => {
    return TransactionsDAL.getTransaction(txnId);
  };

  static updateFinalStatus = (
    txnId: string,
    receivedHash: string,
    reverseHash: string,
    isValidTxn: boolean,
    finalStatus: string,
    finalErrorMessage: string
  ) => {
    return TransactionsDAL.updateFinalStatus(
      txnId,
      receivedHash,
      reverseHash,
      isValidTxn,
      finalStatus,
      finalErrorMessage
    );
  };
}

export default TransactionsService;
