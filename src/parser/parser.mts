import { ArithToken, ArithTokenizer, ArithTokenType } from '../tokenizer/index.mjs'
import { Instruction } from '../vm/vm.mjs'
import { ParserError } from './error.mjs'
import { isAdd, isDivide, isLeftParen, isMultiply, isNumber, isSubtract } from './utils.mjs'

export class Parser {
  private tokenizer: ArithTokenizer
  private instructions: Instruction[] = []
  private currentExpr: string = ''
  private token: ArithToken | undefined

  private constructor(expression: string) {
    this.tokenizer = ArithTokenizer.fromExpression(expression)
  }

  static fromExpression(expression: string): Parser {
    return new Parser(expression)
  }

  /*
    <expr> ::= <term> <expr_tail>
    <expr_tail> ::= "+" <term> <expr_tail>
                  | "-" <term> <expr_tail>
                  | E

    <term> ::= <factor> <term_tail>
    <term_tail> ::= "*" <factor> <term_tail>
                  | "/" <factor> <term_tail>
                  | E

    <factor> ::= "(" <expr> ")"
                | <Number>
  */
  public parse(): Instruction[] {
    this.next()
    this.parseExpr()
    return this.instructions
  }

  /*
    <expr> ::= <term> <expr_tail>
  */
  private parseExpr() {
    this.parseTerm()
    this.parseExprTail()
  }

  /*
    <term> ::= <factor> <term_tail>
  */
  private parseTerm() {
    this.parseFactor()
    this.parseTermTail()
  }

  /*
    <expr_tail> ::= "+" <term> <expr_tail>
                  | "-" <term> <expr_tail>
                  | E
  */
  private parseExprTail() {
    if (this.token === undefined) return

    if (this.token?.type !== 'Add' && this.token?.type !== 'Subtract') {
      return
    }

    if (isAdd(this.token)) {
      this.match('Add')
      this.parseTerm()
      this.instructions.push(Instruction.POP())
      this.instructions.push(Instruction.ADD())
      this.instructions.push(Instruction.PUSH())
    }
    if (isSubtract(this.token)) {
      this.match('Subtract')
      this.parseTerm()
      this.instructions.push(Instruction.POP())
      this.instructions.push(Instruction.SUB())
      this.instructions.push(Instruction.PUSH())
    }
    this.parseExprTail()
  }

  /*
    <term_tail> ::= "*" <factor> <term_tail>
                  | "/" <factor> <term_tail>
                  | E
  */
  private parseTermTail() {
    if (this.token === undefined) return

    if (this.token.type !== 'Multiply' && this.token.type !== 'Divide') {
      return
    }


    if (isMultiply(this.token)) {
      this.match('Multiply')
      this.parseFactor()
      this.instructions.push(Instruction.POP())
      this.instructions.push(Instruction.MUL())
      this.instructions.push(Instruction.PUSH())

    }
    if (isDivide(this.token)) {
      this.match('Divide')
      this.parseFactor()
      this.instructions.push(Instruction.POP())
      this.instructions.push(Instruction.DIV())
      this.instructions.push(Instruction.PUSH())
    }

    this.parseTermTail()
  }

  /*
    <factor> ::= "(" <expr> ")"
                | <Number>
  */
  private parseFactor() {
    ParserError.assert(
      this.token?.type === 'LeftParen' || this.token?.type === 'Number',
      `Unexpected token: <${this.token?.type}> after <${this.currentExpr}>`
    )

    if (isNumber(this.token)) {
      this.instructions.push(Instruction.IMM(this.token.value))
      this.instructions.push(Instruction.PUSH())
      this.next()
    }

    if (isLeftParen(this.token)) {
      this.match('LeftParen')
      this.parseExpr()
      this.match('RightParen')
    }

  }

  private next(): void {
    this.token = this.tokenizer.next()
    this.currentExpr += this.token?.original ?? ''
  }

  private match(type: ArithTokenType) {
    ParserError.assert(
      this.token?.type === type,
      `Unexpected token: <${this.token?.type}> after <${this.currentExpr}>`
    )
    this.next()
  }
}
