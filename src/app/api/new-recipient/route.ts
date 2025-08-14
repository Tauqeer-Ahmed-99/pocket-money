import { APIResponse, APIStatus, HTTPStatus } from "@/models/network";
// import { PaymentHashInfo } from "@/models/payments";
import { NewRecipientSchema } from "@/models/zod";
import PaymentService from "@/services/payments";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { success, error, data } = NewRecipientSchema.safeParse({
      ...body,
      endDate: new Date(body.endDate),
    });

    if (!success) {
      const errors = z.treeifyError(error);

      const response: APIResponse<typeof errors> = {
        status: APIStatus.Error,
        statusCode: HTTPStatus.BadRequest,
        message:
          errors.errors.join(", ") || "One or more validation errors occurred.",
        data: errors,
      };

      return NextResponse.json(response, {
        status: HTTPStatus.BadRequest,
      });
    }

    const paymentDetails = data;

    // const paymentHashInfo =
    //   PaymentService.generatePaymentHashInfo(paymentDetails);

    const form = PaymentService.getInitiatePaymentForm(paymentDetails);

    const response: APIResponse<{
      form: string;
      // paymentHashInfo: PaymentHashInfo;
    }> = {
      status: APIStatus.Success,
      statusCode: HTTPStatus.OK,
      message: "Payment form initiated successfully.",
      data: {
        form,
        // paymentHashInfo,
      },
    };

    return NextResponse.json(response, { status: HTTPStatus.OK });
  } catch (error) {
    const response: APIResponse<typeof error> = {
      status: APIStatus.Error,
      statusCode: HTTPStatus.InternalServerError,
      message: error instanceof Error ? error.message : "Internal Server Error",
      data: error,
    };

    return NextResponse.json(response, {
      status: HTTPStatus.InternalServerError,
    });
  }
};
