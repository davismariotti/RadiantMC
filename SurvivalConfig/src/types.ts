export type TimeSlotData = [DaySlot]

export interface DaySlot {
  day: number
  slots: [TimeSlot]
}

export interface TimeSlot {
  id: string
  start_time: number
  end_time: number
}

export interface GetOptions {
  onCompleted?: (data: any) => void
  onError?: (error: Error) => void
}

export interface GetResult {
  data: any
  loading: boolean
  error?: Error
  refetch: RefetchFunction
}

export type LazyGetResult = [
  LazyGetExecFunction,
  {
    data: any
    loading: boolean
    error?: Error
    refetch: LazyGetExecFunction
  }
]

export type RefetchFunction = () => void

export type LazyGetExecFunction = (endpoint: string) => Promise<any>

export type PostExecFunction = (data: any) => Promise<any>

export type PostResult = [PostExecFunction, { loading: boolean }]

export interface MobileNumberFormValues {
  mobile: string
}

export interface UsernameFormValues {
  username: string
}

export interface CreateFormValues {
  username?: string
  mobile?: string
}
