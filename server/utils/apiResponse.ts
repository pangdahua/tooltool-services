export interface ApiResponse<T = unknown> {
  error: boolean
  message?: string
  errorKey?: string
  data?: T
}

export function sendSuccess<T>(data: T): ApiResponse<T> {
  return { error: false, data }
}

export function sendApiError(errorKey: string, message?: string): ApiResponse<never> {
  return { error: true, errorKey, message } as ApiResponse<never>
}

export class BusinessError extends Error {
  errorKey: string

  constructor(errorKey: string, message?: string) {
    super(message)
    this.errorKey = errorKey
    this.name = 'BusinessError'
  }
}
