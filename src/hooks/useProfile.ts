import { APIError, APIResponse } from "@/models/network";
import { ProfileSchema } from "@/models/zod";
import { useQuery } from "@tanstack/react-query";
import z from "zod";

export type UserProfile = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  region: string;
  country: string;
  userId: string;
};

const fetchProfileData = async () => {
  const response = await fetch("/api/profile", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData: APIResponse<ReturnType<
      typeof z.treeifyError<z.infer<typeof ProfileSchema>>
    > | null> = await response.json();
    const error = new APIError(
      errorData.message,
      response.status,
      errorData.data,
      errorData.errorCode
    );
    throw error;
  }

  return response.json() as Promise<APIResponse<UserProfile>>;
};

const useProfile = () => {
  return useQuery({
    queryKey: ["/api/profile"],
    queryFn: fetchProfileData,
  });
};

export default useProfile;
