import { InferSelectModel } from "drizzle-orm";
import database from "..";
import { PocketMoneys, Recipients, Transactions } from "../schema";

class PocketMoneysDAL {
  static getTransactions = (
    pocketMoneyId: string
  ): Promise<InferSelectModel<typeof Transactions>[]> => {
    return database.query.Transactions.findMany({
      where: (columns, { eq }) => eq(columns.pocketMoneyId, pocketMoneyId),
    });
  };

  static getRecipient = (
    recipientId: string,
    pocketMoneyId: string
  ): Promise<
    | (InferSelectModel<typeof Recipients> & {
        pocketMoneys: InferSelectModel<typeof PocketMoneys>[];
      })
    | undefined
  > => {
    return database.query.Recipients.findFirst({
      where: (columns, { eq }) => eq(columns.recipientId, recipientId),
      with: {
        pocketMoneys: {
          where: (columns, { and, eq }) =>
            and(
              eq(columns.recipientId, recipientId),
              eq(columns.pocketMoneyId, pocketMoneyId)
            ),
        },
      },
    });
  };
}

export default PocketMoneysDAL;
