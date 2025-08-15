import UsersDAL from "@/database/access-layer/users-dal";
import { Users } from "@/database/schema";
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
}

export default UsersService;
