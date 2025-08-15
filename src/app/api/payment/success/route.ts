import { APIResponse, APIStatus, HTTPStatus } from "@/models/network";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.formData();
    console.log("Payment Success:", data);

    return NextResponse.redirect("http://localhost:3000/pm-recipients", 303);
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
