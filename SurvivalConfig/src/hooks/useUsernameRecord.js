import useGetAPI from './useGetAPI'

export default function useUsernameRecord(username, props) {
  return useGetAPI(`user/${username}`, props)
}
