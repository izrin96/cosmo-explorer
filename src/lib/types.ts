export type ActionResultSuccess<T> = {
  status: "success";
  data: T;
};

export type ActionResultError = {
  status: "error";
  error?: string;
  validationErrors?: Record<string, string[] | undefined>;
};

export type TypedActionResult<T> = ActionResultSuccess<T> | ActionResultError;
