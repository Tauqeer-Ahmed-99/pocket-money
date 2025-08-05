import { APIResponse, APIStatus, HTTPStatus } from "@/models/network";
import { NewRecipientSchema } from "@/models/zod";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { success, error, data } = NewRecipientSchema.safeParse({
      ...body,
      amount: parseFloat(body.amount),
      endDate: new Date(body.endDate),
    });

    if (!success) {
      const errors = z.treeifyError(error);

      const response: APIResponse<typeof errors.properties> = {
        status: APIStatus.Error,
        statusCode: HTTPStatus.BadRequest,
        message: errors.errors.map((err) => err).join(", "),
        data: errors.properties,
      };

      return NextResponse.json(response, {
        status: HTTPStatus.BadRequest,
      });
    }
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
