import usePostAPI from './usePostApi'

export default function useUpdateTimeSlots(id: string) {
  return usePostAPI(`time_slots/${id}/update`)
}
