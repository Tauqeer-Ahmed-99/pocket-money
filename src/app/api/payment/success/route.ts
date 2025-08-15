import { Transactions } from "@/database/schema";
import { APIResponse, APIStatus, HTTPStatus } from "@/models/network";
import PaymentService from "@/services/payments";
import { InferInsertModel } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.formData();

    const txnId = data.get("txnid")?.toString() || "";

    const txnDetails: Partial<InferInsertModel<typeof Transactions>> = {
      mihpayid: data.get("mihpayid")?.toString() || "",
      mode: data.get("mode")?.toString() || "",
      txnStatus: (data.get("status")?.toString() as "success") || "",
      unmappedstatus: data.get("unmappedstatus")?.toString() || "",
      discount: data.get("discount")?.toString() || "",
      net_amount_debit: data.get("net_amount_debit")?.toString() || "",
      addedon: data.get("addedon")?.toString() || "",
      field1: data.get("field1")?.toString() || "",
      field2: data.get("field2")?.toString() || "",
      field3: data.get("field3")?.toString() || "",
      field4: data.get("field4")?.toString() || "",
      field5: data.get("field5")?.toString() || "",
      field6: data.get("field6")?.toString() || "",
      field7: data.get("field7")?.toString() || "",
      field8: data.get("field8")?.toString() || "",
      field9: data.get("field9")?.toString() || "",
      payment_source: data.get("payment_source")?.toString() || "",
      pa_name: data.get("pa_name")?.toString() || "",
      PG_TYPE: data.get("PG_TYPE")?.toString() || "",
      bank_ref_num: data.get("bank_ref_num")?.toString() || "",
      bankcode: data.get("bankcode")?.toString() || "",
      error: data.get("error")?.toString() || "",
      error_Message: data.get("error_Message")?.toString() || "",
    };

    const receivedReverseHash = data.get("hash")?.toString() as string;

    const url = await PaymentService.validatePayment(
      txnId,
      txnDetails,
      receivedReverseHash
    );

    return NextResponse.redirect(url, 303);
  } catch (error) {
    console.error("Error in payment fail endpoint:", error);
    const response: APIResponse<typeof error> = {
      status: APIStatus.Error,
      statusCode: HTTPStatus.InternalServerError,
      message:
        error instanceof Error
          ? error.message
          : "Failed to process payment failure.",
      data: error,
    };

    return NextResponse.json(response, {
      status: HTTPStatus.InternalServerError,
    });
  }
};
