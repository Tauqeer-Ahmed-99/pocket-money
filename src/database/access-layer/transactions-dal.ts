import { eq, InferInsertModel } from "drizzle-orm";
import { Transactions } from "../schema";
import database from "..";

class TransactionsDAL {
  static updateTransaction = (
    txnId: string,
    txnDetails: Partial<InferInsertModel<typeof Transactions>>
  ) => {
    return database
      .update(Transactions)
      .set(txnDetails)
      .where(eq(Transactions.paymentGatewayTxnId, txnId))
      .returning();
  };

  static getTransaction = (txnId: string) => {
    return database.query.Transactions.findFirst({
      where: (columns, { eq }) => eq(columns.paymentGatewayTxnId, txnId),
      with: {
        pocketMoney: true,
      },
    });
  };

  static updateFinalStatus = (
    txnId: string,
    receivedHash: string,
    reverseHash: string,
    isValidTxn: boolean,
    finalStatus: string,
    finalErrorMessage: string
  ) => {
    return database
      .update(Transactions)
      .set({
        receivedHash,
        reverseHash,
        isValidTxn,
        finalStatus,
        finalErrorMessage,
      })
      .where(eq(Transactions.paymentGatewayTxnId, txnId))
      .returning();
  };
}

export default TransactionsDAL;
