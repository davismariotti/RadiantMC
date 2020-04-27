import usePostAPI from './usePostApi'

export default function useCreateUser() {
  return usePostAPI(`user/new`)
}
