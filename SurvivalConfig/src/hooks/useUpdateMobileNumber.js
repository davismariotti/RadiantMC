import usePostAPI from './usePostApi'

export default function useUpdateMobileNumber(id) {
  return usePostAPI(`user/${id}/updatemobile`)
}
