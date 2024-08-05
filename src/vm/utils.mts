export function reverse<T extends Record<string, string>>(obj: T): {
  [V in T[keyof T]]: GetKeyByValue<T, V>
} {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc[v] = Number(k)
    return acc
  }, {} as any)
}

export type GetKeyByValue<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

export function shallowCopy<T>(arr: T[]): T[] {
  return arr.slice()
}