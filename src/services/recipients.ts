import RecipientsDAL from "@/database/access-layer/recipients-dal";
import { PocketMoneys, Recipients } from "@/database/schema";
import { InferSelectModel } from "drizzle-orm";

class RecipientsService {
  static async getRecipient(recipientId: string): Promise<
    | (InferSelectModel<typeof Recipients> & {
        pocketMoneys: InferSelectModel<typeof PocketMoneys>[];
      })
    | undefined
  > {
    return RecipientsDAL.getRecipient(recipientId);
  }
}

export default RecipientsService;
