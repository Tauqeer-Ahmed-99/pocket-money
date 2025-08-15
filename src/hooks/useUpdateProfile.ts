import { APIError, APIResponse } from "@/models/network";
import { useMutation } from "@tanstack/react-query";
import { UserProfile } from "./useProfile";
import z from "zod";
import { ProfileSchema } from "@/models/zod";

const postProfileData = async (body: z.infer<typeof ProfileSchema>) => {
  const response = await fetch("/api/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData: APIResponse<ReturnType<
      typeof z.treeifyError<z.infer<typeof ProfileSchema>>
    > | null> = await response.json();
    const error = new APIError(
      errorData.message,
      response.status,
      errorData.data
    );
    throw error;
  }

  return response.json() as Promise<APIResponse<UserProfile>>;
};

const useUpdateProfile = () => {
  return useMutation({
    mutationKey: ["/api/profile"],
    mutationFn: postProfileData,
  });
};

export default useUpdateProfile;
