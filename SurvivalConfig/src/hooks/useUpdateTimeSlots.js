import usePostAPI from './usePostApi'

export default function useUpdateTimeSlots(id) {
  return usePostAPI(`time_slots/${id}/update`)
}
