import { describe, it } from "node:test"
import assert from 'assert/strict'
import { ArithDirectAsmGenParser } from "../src/parser/index.mjs"
import { VirtualMachine } from "../src/vm/vm.mjs"

describe("ArithParser", () => {
  describe("#parse()", () => {
    const vm = new VirtualMachine(1024)
    it(
      "expression: '1 + 2'",
      () => {
        const parser = ArithDirectAsmGenParser.fromExpression('1 + 2')
        assert.equal(vm.program(parser.parse()).run(), 3)
      }
    )

    it(
      "expression with float: '1 + 2.3 * 4.5'",
      () => {
        const parser = ArithDirectAsmGenParser.fromExpression('1 + 2.3 * 4.5')
        assert.equal(vm.program(parser.parse()).run(), 11.35)
      }
    )

    it(
      "expression with parentheses: '((1 + 2) * 3) / 9 - 2'",
      () => {
        const parser = ArithDirectAsmGenParser.fromExpression('((1 + 2) * 3) / 9 - 2')
        assert.equal(vm.program(parser.parse()).run(), -1)
      }
    )

    it(
      "expression with parentheses: '1 - 2 * (9 / 3)'",
      () => {
        const parser = ArithDirectAsmGenParser.fromExpression('1 - 2 * (9 / 3)')
        assert.equal(vm.program(parser.parse()).run(), -5)
      }
    )
  }) // suite next
}) // suite ClangTokenizer
