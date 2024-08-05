const _0_ASCII = '0'.charCodeAt(0)

export function parseDec(value: string): number {
  const [integerPart, decimalPart] = value.split(".")
  return parseInteger(integerPart) + (decimalPart ? parseInteger(decimalPart) / Math.pow(10, decimalPart.length) : 0)
}

function parseInteger(value: string): number {
  const digits = value.split("").map(digit => digit.charCodeAt(0) - _0_ASCII).reverse()
  let result = 0
  for (let i = 0; i < digits.length; ++i) {
    result += Math.pow(10, i) * digits[i]
  }
  return result
}

export function isEOF(char?: string): boolean {
  return char === '\0' || char === undefined
}

export function isNotEOF(char?: string): boolean {
  return !isEOF(char)
}

export function decNumber(char: string): boolean {
  return char >= '0' && char <= '9' || char === '.'
}

export function isDecLiteralStart(char: string): boolean {
  return char >= '1' && char <= '9'
}
