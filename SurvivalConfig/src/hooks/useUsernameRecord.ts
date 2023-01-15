import useGetAPI from './useGetAPI'
import { GetOptions } from '../types'

export default function useUsernameRecord(username: string, options?: GetOptions) {
  return useGetAPI(`user/${username}`, options)
}
