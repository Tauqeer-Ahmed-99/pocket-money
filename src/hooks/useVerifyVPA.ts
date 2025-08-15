import { APIError, APIResponse } from "@/models/network";
import { ValidateVPAResponse } from "@/models/payments";
import { useMutation } from "@tanstack/react-query";

const postVpaVerification = async (vpa: string) => {
  const response = await fetch("/api/payment/verify-vpa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vpa }),
  });

  if (!response.ok) {
    const errorData: APIResponse<ValidateVPAResponse> = await response.json();
    const error = new APIError(
      errorData.message,
      response.status,
      errorData.data
    );
    throw error;
  }

  return response.json() as Promise<APIResponse<ValidateVPAResponse>>;
};

const useVerifyVPA = () => {
  return useMutation({
    mutationKey: ["verify-vpa"],
    mutationFn: postVpaVerification,
  });
};

export default useVerifyVPA;
