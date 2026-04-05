export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export function successResponse<T>(data: T): SuccessResponse<T> {
  return { success: true, data };
}
