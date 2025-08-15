export enum HTTPStatus {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

export enum APIStatus {
  Success = "success",
  Error = "error",
}

export enum ErrorCode {
  ProfileNotSet = "ProfileNotSet",
  InvalidVPA = "InvalidVPA",
  ProcessingPaymentFailed = "ProcessingPaymentFailed",
}

export type APIResponse<T = undefined> = {
  status: APIStatus;
  statusCode: HTTPStatus;
  message: string;
  errorCode?: ErrorCode;
  data: T;
};

export class APIError extends Error {
  status: HTTPStatus;
  data: any;
  errorCode?: ErrorCode;

  constructor(
    message: string,
    status: HTTPStatus,
    data: any,
    errorCode?: ErrorCode
  ) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "APIError";
    this.errorCode = errorCode;
  }
}
