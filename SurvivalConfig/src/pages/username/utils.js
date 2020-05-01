export const formatHour = hour => {
  if (hour === 0) {
    return '12a'
  } else if (hour === 12) {
    return '12p'
  } else if (hour < 13) {
    return `${hour}a`
  }
  return `${hour - 12}p`
}

export const generateGUID = () => {
  let d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
