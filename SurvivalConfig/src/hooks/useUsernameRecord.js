import { HttpMethod } from './httpMethod'
import useAPI from './useApi'

export default function useUsernameRecord(username) {
  return useAPI(`username/${username}`, HttpMethod.get)
}
