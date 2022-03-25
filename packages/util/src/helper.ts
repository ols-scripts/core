export function pickPropertyByArr(arr: any[], key: string): any[] {
  if (!Array.isArray(arr)) {
    return []
  }

  return arr.reduce((pre, cur) => {
    return [...pre, ...(cur[key] || [])]
  }, [])
}

export const getDays = () => {
  const date = new Date()

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export const getFullDay = (timestamp) => {
  const date = new Date(timestamp)

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${String(
    date.getHours(),
  ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(
    2,
    '0',
  )}`
}

export function getFormatEllipsis(str, len) {
  if (str.length < len) {
    return str
  }

  return str.slice(0, len - 3).concat('...')
}

export function getTimes(time: number) {
  // 暂时只支持到分+秒，应该不存在时的情况
  const minutes = parseInt(String(time / 60), 10)
  const seconds = time - minutes * 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
