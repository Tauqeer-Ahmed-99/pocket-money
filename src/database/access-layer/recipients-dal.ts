import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { Recipients } from "../tables/recipients";
import database from "..";
import { PocketMoneys, Transactions } from "../schema";

class RecipientsDAL {
  static async createRecipient(data: InferInsertModel<typeof Recipients>) {
    return database.insert(Recipients).values(data).returning();
  }

  static createRecipientWithPocketMoney = (
    recipientData: InferInsertModel<typeof Recipients>,
    pocketMoneyDetails: { amount: string; createdBy: string },
    transactionDetails: Omit<
      InferInsertModel<typeof Transactions>,
      "pocketMoneyId"
    >
  ): Promise<{
    recipient: InferSelectModel<typeof Recipients>;
    pocketMoney: InferSelectModel<typeof PocketMoneys>;
    transaction: InferSelectModel<typeof Transactions>;
  }> => {
    return database.transaction(async (txn) => {
      const [recipient] = await txn
        .insert(Recipients)
        .values(recipientData)
        .returning();

      const pmDetails = {
        recipientId: recipient.recipientId,
        amount: pocketMoneyDetails.amount,
        createdBy: pocketMoneyDetails.createdBy,
      };

      const [pocketMoney] = await txn
        .insert(PocketMoneys)
        .values(pmDetails)
        .returning();

      const txnDetails: InferInsertModel<typeof Transactions> = {
        pocketMoneyId: pocketMoney.pocketMoneyId,
        ...transactionDetails,
      };

      const [transaction] = await txn
        .insert(Transactions)
        .values(txnDetails)
        .returning();

      return { recipient, pocketMoney, transaction };
    });
  };

  static getRecipientById = async (id: string) => {
    // Implementation for fetching a recipient by ID
  };

  static updateRecipient = async (id: string, data: any) => {
    // Implementation for updating a recipient
  };

  static deleteRecipient = async (id: string) => {
    // Implementation for deleting a recipient
  };
}

export default RecipientsDAL;
