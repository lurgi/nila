export const HANDLE_MIN_LENGTH = 3;
export const HANDLE_MAX_LENGTH = 30;
export const HANDLE_PATTERN = "^[a-z0-9._]+$";

export type HandleFormRequest = {
  handle: string;
};
