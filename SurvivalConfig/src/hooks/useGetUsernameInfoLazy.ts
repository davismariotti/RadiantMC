import useLazyGetAPI from './useLazyGetAPI'
import { GetOptions, LazyGetExecFunction } from '../types'

export default function useGetUsernameInfoLazy(
  options?: GetOptions
): [
  (username: string) => Promise<any>,
  {
    data?: any
    loading: boolean
    error?: Error
    refetch: LazyGetExecFunction
  }
] {
  const lazyGet = useLazyGetAPI(options)

  return [(username: string) => lazyGet[0](`username/${username}`), lazyGet[1]]
}
