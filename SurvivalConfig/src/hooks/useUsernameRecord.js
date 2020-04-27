import { HttpMethod } from './httpMethod'
import useGetAPI from './useGetAPI'

export default function useUsernameRecord(username) {
  return useGetAPI(`username/${username}`, HttpMethod.get)
}
