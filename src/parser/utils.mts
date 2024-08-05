import { ArithToken } from "../tokenizer/index.mjs"

export function isNumber(token?: ArithToken<any>): token is ArithToken<'Number'> {
  return token?.type === 'Number'
}

export function isAdd(token?: ArithToken<any>): token is ArithToken<'Add'> {
  return token?.type === 'Add'
}

export function isSubtract(token?: ArithToken<any>): token is ArithToken<'Subtract'> {
  return token?.type === 'Subtract'
}

export function isMultiply(token?: ArithToken<any>): token is ArithToken<'Multiply'> {
  return token?.type === 'Multiply'
}

export function isDivide(token?: ArithToken<any>): token is ArithToken<'Divide'> {
  return token?.type === 'Divide'
}

export function isLeftParen(token?: ArithToken<any>): token is ArithToken<'LeftParen'> {
  return token?.type === 'LeftParen'
}

export function isRightParen(token?: ArithToken<any>): token is ArithToken<'RightParen'> {
  return token?.type === 'RightParen'
}
