/**
 * create a helper method that enables sub methods to just call the route they desire and go!
 *
 * This should be only consumed at the "API" layer!
 */

type mimeTypes =
  | "application/json"
  | "multipart/form-data"
  | "application/x-www-form-urlencoded"
  | "text/plain";

export interface ResponseBody {
  status?: string;
  data: Record<string, unknown> | string;
}

export interface ApiResponseBody extends ResponseBody {
  apiVersion: number;
  context: Record<string, unknown>;
  method: HttpMethod;
}

export interface ApiErrorResponse {
  error: {
    apiVersion: number;
    method: string;
    error: {
      error: string;
    }[];
  };
}

const constructRequest = (
  path: RequestInfo | URL,
  method: HttpMethod,
  body?: BodyInit,
  contentType?: mimeTypes,
  accept?: mimeTypes,
): { input: RequestInfo | URL; init?: RequestInit } => {
  const csrfToken: HTMLMetaElement | undefined = document.querySelector(
    "meta[name='csrf-token']",
  );
  const contentTypeHeader = contentType ? { "Content-Type": contentType } : {};
  const acceptHeaders = accept ? { Accept: accept } : {};

  return {
    input: path,
    init: {
      method,
      headers: {
        "X-CSRF-Token": csrfToken?.content || "",
        ...contentTypeHeader,
        ...acceptHeaders,
      },
      body: body || undefined,
      credentials: "same-origin",
    },
  };
};

const localFetch = async (
  input: RequestInfo | URL,
  method: HttpMethod,
  body?: BodyInit,
  contentType?: mimeTypes,
  accept?: mimeTypes,
  errorOnFailure = true,
) => {
  try {
    const val = constructRequest(input, method, body, contentType, accept);
    const response = await fetch(val.input, val.init);
    if (!response.ok && errorOnFailure) {
      let data;
      const contentType = response.headers.get('content-type') || '';
      if(contentType.includes('application/json')) data = await response.json() 
      throw new Error(data?.message || response.statusText);
    } 
    
    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const post = async (
  input: RequestInfo | URL,
  body: BodyInit,
  contentType?: mimeTypes,
  errorOnFailure?: boolean,
) => localFetch(input, "POST", body, contentType, contentType, errorOnFailure);

export const postJson = async (
  input: RequestInfo | URL,
  body: BodyInit,
  errorOnFailure?: boolean,
) =>
  localFetch(
    input,
    "POST",
    body,
    "application/json",
    "application/json",
    errorOnFailure,
  );

export const putJson = async (
  input: RequestInfo | URL,
  body: BodyInit,
  errorOnFailure?: boolean,
) =>
  localFetch(
    input,
    "PUT",
    body,
    "application/json",
    "application/json",
    errorOnFailure,
  );

export const patchJson = async (
  input: RequestInfo | URL,
  body: BodyInit,
  errorOnFailure?: boolean,
) =>
  localFetch(
    input,
    "PATCH",
    body,
    "application/json",
    "application/json",
    errorOnFailure,
  );

export const get = async (input: RequestInfo | URL) => localFetch(input, "GET");

export const put = async (input: RequestInfo | URL, body: BodyInit) =>
  localFetch(input, "PUT", body);

export const patch = async (input: RequestInfo | URL, body: BodyInit) =>
  localFetch(input, "PATCH", body);

/**
 * can't be called delete as that's a protected word
 * @param input
 * @returns
 */
export const deleteReq = async (input: RequestInfo | URL, errorOnFailure?: boolean) =>
  localFetch(
    input,
    "DELETE",
    null,
    "application/json",
    "application/json",
    errorOnFailure
  );
