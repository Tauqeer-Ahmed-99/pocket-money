import UsersDAL from "@/database/access-layer/users-dal";
import { Recipients, UserPMRecipients, Users } from "@/database/schema";
import { InferSelectModel } from "drizzle-orm";

class UsersService {
  static getUserProfile = (userId: string) => {
    return UsersDAL.getUserProfile(userId);
  };

  static setupUserProfile = (
    userId: string,
    profileData: Omit<InferSelectModel<typeof Users>, "userId">
  ) => {
    return UsersDAL.setupUserProfile(userId, profileData);
  };

  static getUserWithPMRecipients = (
    userId: string
  ): Promise<
    | (InferSelectModel<typeof Users> & {
        userPocketMoneyRecipients: Array<
          InferSelectModel<typeof UserPMRecipients> & {
            recipient: InferSelectModel<typeof Recipients>;
          }
        >;
      })
    | undefined
  > => {
    return UsersDAL.getUserWithPMRecipients(userId);
  };
}

export default UsersService;
