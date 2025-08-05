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

export type APIResponse<T = undefined> = {
  status: APIStatus;
  statusCode: HTTPStatus;
  message: string;
  data: T;
};
