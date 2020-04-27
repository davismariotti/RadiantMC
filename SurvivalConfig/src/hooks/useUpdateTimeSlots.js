import usePostAPI from './usePostApi'

export default function useUpdateTimeSlots(phone, time_slots) {
  return usePostAPI(`time_slots/${phone}/update`, {
    time_slots,
  })
}
