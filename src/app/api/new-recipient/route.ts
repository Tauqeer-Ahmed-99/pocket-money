import {
  APIResponse,
  APIStatus,
  ErrorCode,
  HTTPStatus,
} from "@/models/network";
import { NewRecipientSchema } from "@/models/zod";
import PaymentService from "@/services/payments";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const { userId, isAuthenticated } = await auth();

    if (!isAuthenticated || !userId) {
      const response: APIResponse<null> = {
        status: APIStatus.Error,
        statusCode: HTTPStatus.Unauthorized,
        message: "User is not authenticated.",
        data: null,
      };

      return NextResponse.json(response, { status: HTTPStatus.Unauthorized });
    }

    const body = await req.json();

    const startDate = new Date();
    const endDate = new Date(body.endDate);

    const {
      success,
      error,
      data: paymentDetails,
    } = NewRecipientSchema.safeParse({
      ...body,
      endDate,
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

    const { vpa } = body;

    if (!vpa) {
      const response: APIResponse<null> = {
        status: APIStatus.Error,
        statusCode: HTTPStatus.BadRequest,
        message: "VPA is required.",
        errorCode: ErrorCode.InvalidVPA,
        data: null,
      };

      return NextResponse.json(response, { status: HTTPStatus.BadRequest });
    }

    // const { isVPAValid } = await PaymentService.validateVPA(vpa);

    // if (isVPAValid === 0) {
    //   const response: APIResponse<null> = {
    //     status: APIStatus.Error,
    //     statusCode: HTTPStatus.BadRequest,
    //     message: "Invalid VPA. Please check and try again.",
    //     errorCode: ErrorCode.InvalidVPA,
    //     data: null,
    //   };

    //   return NextResponse.json(response, { status: HTTPStatus.BadRequest });
    // }

    const { form } = await PaymentService.initiatePaymentForm(
      { ...paymentDetails, vpa, startDate },
      userId
    );

    const response: APIResponse<{
      form: string;
    }> = {
      status: APIStatus.Success,
      statusCode: HTTPStatus.OK,
      message: "Payment form initiated successfully.",
      data: {
        form,
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
