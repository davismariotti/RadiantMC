import usePostAPI from './usePostApi'

export default function useUpdateMobileNumber(id: string) {
  return usePostAPI(`user/${id}/updatemobile`)
}
