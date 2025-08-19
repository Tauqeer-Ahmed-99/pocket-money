import { InferModelFromColumns, InferSelectModel } from "drizzle-orm";
import database from "..";
import { Recipients, UserPMRecipients, Users } from "../schema";

class UsersDAL {
  static getUserProfile = async (
    userId: string
  ): Promise<InferSelectModel<typeof Users> | undefined> => {
    return database.query.Users.findFirst({
      where: (columns, { eq }) => eq(columns.userId, userId),
    });
  };

  static setupUserProfile = async (
    userId: string,
    profileData: Omit<InferSelectModel<typeof Users>, "userId">
  ): Promise<InferSelectModel<typeof Users>> => {
    const [userProfile] = await database
      .insert(Users)
      .values({ userId, ...profileData })
      .returning();

    return userProfile;
  };

  static getUserWithPMRecipients = async (
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
    return database.query.Users.findFirst({
      where: (columns, { eq }) => eq(columns.userId, userId),
      with: {
        userPocketMoneyRecipients: {
          with: {
            recipient: true,
          },
        },
      },
    });
  };
}

export default UsersDAL;
