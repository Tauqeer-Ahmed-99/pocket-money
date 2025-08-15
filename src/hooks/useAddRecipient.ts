import { APIError, APIResponse } from "@/models/network";
import { PaymentHashInfo } from "@/models/payments";
import { NewRecipientSchema } from "@/models/zod";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

const postNewRecipient = async (
  body: z.infer<typeof NewRecipientSchema> & { vpa: string }
) => {
  const response = await fetch("/api/new-recipient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData: APIResponse<ReturnType<
      typeof z.treeifyError<z.infer<typeof NewRecipientSchema>>
    > | null> = await response.json();
    const error = new APIError(
      errorData.message,
      response.status,
      errorData.data,
      errorData.errorCode
    );
    throw error;
  }

  return response.json() as Promise<
    APIResponse<{ form: string; paymentHashInfo: PaymentHashInfo }>
  >;
};

const useAddRecipient = () => {
  return useMutation({
    mutationKey: ["add-recipient"],
    mutationFn: postNewRecipient,
  });
};

export default useAddRecipient;
