import PocketMoneysDAL from "@/database/access-layer/pocket-moneys-dal";
import { PocketMoneys, Recipients, Transactions } from "@/database/schema";
import { InferSelectModel } from "drizzle-orm";

class PocketMoneysService {
  static getTransactions = (
    pocketMoneyId: string
  ): Promise<InferSelectModel<typeof Transactions>[]> => {
    return PocketMoneysDAL.getTransactions(pocketMoneyId);
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
    return PocketMoneysDAL.getRecipient(recipientId, pocketMoneyId);
  };
}

export default PocketMoneysService;
