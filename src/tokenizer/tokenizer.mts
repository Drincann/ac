import { decNumber, isDecLiteralStart, isNotEOF, parseDec } from "./utils.mjs"

export interface Token<TokenTypeGeneric extends TokenType = TokenType> {
  type: TokenTypeGeneric
  value: TokenValue<TokenTypeGeneric>
  original: string
}

type TokenValue<TokenTypeGeneric extends TokenType> =
  TokenTypeGeneric extends 'Number' ? number :
  undefined

export type TokenType =
  | 'Number'
  | 'Add'
  | 'Subtract'
  | 'Multiply'
  | 'Divide'
  | 'LeftParen'
  | 'RightParen'

export class Tokenizer {
  private expression: string
  private cursor: number = 0

  private constructor(expression: string) {
    this.expression = expression
  }

  static fromExpression(expression: string): Tokenizer {
    return new Tokenizer(expression)
  }

  public next(): Token<TokenType> | undefined {
    let current: string = this.expression[this.cursor]
    const tokenScanStart = this.cursor
    while (isNotEOF(current)) {
      current = this.expression[this.cursor]

      if (isDecLiteralStart(current)) {
        const start = this.cursor
        this.untilNot(decNumber)
        const literal = this.expression.substring(start, this.cursor)
        return /* new Token */ {
          value: parseDec(literal),
          type: 'Number',
          original: this.expression.substring(tokenScanStart, this.cursor)
        }
      }

      if (current === '+') {
        this.cursor++
        return { type: 'Add', value: undefined, original: this.expression.substring(tokenScanStart, this.cursor) }
      }

      if (current === '-') {
        this.cursor++
        return { type: 'Subtract', value: undefined, original: this.expression.substring(tokenScanStart, this.cursor) }
      }

      if (current === '*') {
        this.cursor++
        return { type: 'Multiply', value: undefined, original: this.expression.substring(tokenScanStart, this.cursor) }
      }

      if (current === '/') {
        this.cursor++
        return { type: 'Divide', value: undefined, original: this.expression.substring(tokenScanStart, this.cursor) }
      }

      if (current === '(') {
        this.cursor++
        return { type: 'LeftParen', value: undefined, original: this.expression.substring(tokenScanStart, this.cursor) }
      }

      if (current === ')') {
        this.cursor++
        return { type: 'RightParen', value: undefined, original: this.expression.substring(tokenScanStart, this.cursor) }
      }

      this.cursor++
    }

    return undefined
  }
  private untilNot(shouldContinue: (char: string) => boolean) {
    while (
    /* */isNotEOF(this.expression[this.cursor])
      && shouldContinue(this.expression[this.cursor])
    ) {
      this.cursor++
    }
  }
}