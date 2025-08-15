import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { Recipients } from "../tables/recipients";
import database from "..";
import { PocketMoneys, Transactions, UserPMRecipients } from "../schema";
import { start } from "repl";

class RecipientsDAL {
  static async createRecipient(data: InferInsertModel<typeof Recipients>) {
    return database.insert(Recipients).values(data).returning();
  }

  static createRecipientWithPocketMoney = (
    recipientData: InferInsertModel<typeof Recipients>,
    pocketMoneyDetails: {
      amount: string;
      createdBy: string;
      startDate: Date;
      endDate: Date;
    },
    transactionDetails: Omit<
      InferInsertModel<typeof Transactions>,
      "pocketMoneyId"
    >,
    userId: string
  ): Promise<{
    recipient: InferSelectModel<typeof Recipients>;
    pocketMoney: InferSelectModel<typeof PocketMoneys>;
    transaction: InferSelectModel<typeof Transactions>;
  }> => {
    return database.transaction(async (txn) => {
      // Create Recipient
      const [recipient] = await txn
        .insert(Recipients)
        .values(recipientData)
        .returning();

      // Create Pocket Money Account
      const pmDetails = {
        recipientId: recipient.recipientId,
        amount: pocketMoneyDetails.amount,
        startDate: pocketMoneyDetails.startDate,
        endDate: pocketMoneyDetails.endDate,
        createdBy: pocketMoneyDetails.createdBy,
      };

      const [pocketMoney] = await txn
        .insert(PocketMoneys)
        .values(pmDetails)
        .returning();

      // Create Initiated Txn Entry
      const txnDetails: InferInsertModel<typeof Transactions> = {
        pocketMoneyId: pocketMoney.pocketMoneyId,
        ...transactionDetails,
      };

      const [transaction] = await txn
        .insert(Transactions)
        .values(txnDetails)
        .returning();

      // Map Recipient to User
      await txn.insert(UserPMRecipients).values({
        userId: userId,
        recipientId: recipient.recipientId,
        createdBy: userId,
      });

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
