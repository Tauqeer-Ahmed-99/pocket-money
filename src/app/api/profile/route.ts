import UsersDAL from "@/database/access-layer/users-dal";
import {
  APIResponse,
  APIStatus,
  ErrorCode,
  HTTPStatus,
} from "@/models/network";
import { ProfileSchema } from "@/models/zod";
import UsersService from "@/services/users";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: Request) => {
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

    const {
      success,
      error,
      data: profileData,
    } = ProfileSchema.safeParse({
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

    const userProfile = await UsersService.setupUserProfile(
      userId,
      profileData
    );

    const response: APIResponse<typeof userProfile> = {
      status: APIStatus.Success,
      statusCode: HTTPStatus.Created,
      message: "User profile setup complete.",
      data: userProfile,
    };

    return NextResponse.json(response, { status: HTTPStatus.Created });
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

export const GET = async () => {
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

    const userProfile = await UsersService.getUserProfile(userId);

    const response: APIResponse<typeof userProfile> = {
      status: APIStatus.Success,
      statusCode: HTTPStatus.OK,
      message: userProfile
        ? "User profile retrieved successfully."
        : "User profile not found.",
      errorCode: userProfile ? undefined : ErrorCode.ProfileNotSet,
      data: userProfile,
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
