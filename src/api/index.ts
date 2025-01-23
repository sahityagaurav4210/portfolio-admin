export enum ApiStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  EXCEPTION = 'exception',
  VALIDATION = 'validation',
  CONFLICT = 'already exists',
  UNDEFINED = 'not defined',
  UNAUTHORISED = 'unauthorised',
  NOT_FOUND = 'not found',
  FORBIDDEN = 'forbidden',
  TIMEOUT = 'api time out'
}

export enum HttpVerbs {
  GET = "GET",
  POST = "POST",
  PUT = "PUT"
}