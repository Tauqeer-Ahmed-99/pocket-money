import { APIResponse, APIStatus, HTTPStatus } from "@/models/network";
import PaymentService from "@/services/payments";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const vpa = body.vpa;

    if (!vpa) {
      const response: APIResponse<null> = {
        status: APIStatus.Error,
        statusCode: HTTPStatus.BadRequest,
        message: "VPA is required",
        data: null,
      };

      return NextResponse.json(response, {
        status: HTTPStatus.BadRequest,
      });
    }

    const validationResponse = await PaymentService.validateVPA(vpa);

    const apiStatus =
      validationResponse.status === "SUCCESS"
        ? APIStatus.Success
        : APIStatus.Error;
    const statusCode =
      validationResponse.status === "SUCCESS"
        ? HTTPStatus.OK
        : HTTPStatus.BadRequest;

    const response: APIResponse<typeof validationResponse> = {
      status: apiStatus,
      statusCode: statusCode,
      message: "VPA validation completed.",
      data: validationResponse,
    };

    return NextResponse.json(response, {
      status: statusCode,
    });
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
