import { describe, it } from "node:test"
import assert from 'assert/strict'
import { Instruction, VirtualMachine } from "../src/vm/vm.mjs"

describe("VirtualMachine", () => {
  describe("#run()", () => {
    it(
      "init",
      () => {
        const vm = new VirtualMachine(1024);
        vm.program([]).run()

        assert.deepEqual(
          vm.snapshot(),
          {
            memory: array(1024).fill(0),
            textTop: -1,
            registers: {
              pc: 0,
              ax: 0,
              bp: 1024,
              sp: 1024
            }
          }
        )
      }
    )

    it(
      "IMM LI SI PUSH",
      () => {
        const vm = new VirtualMachine(10);
        vm.program([
          Instruction.IMM(8),
          Instruction.PUSH(),
          Instruction.SI(),
          Instruction.IMM(7),
          Instruction.LI(),
        ]).run()

        assert.deepEqual(
          vm.snapshot(),
          {
            memory: [
              0, 8, // IMM 8
              3, // PUSH
              2, // SI
              0, 7, // IMM 7
              1, // LI
              // text top

              0, 8, 8,
            ],
            textTop: 6,
            registers: {
              pc: 7,
              ax: 0,
              bp: 10,
              sp: 10
            }
          }
        )
      }
    )

    it(
      "MUL",
      () => {
        const vm = new VirtualMachine(10);
        vm.program([
          Instruction.IMM(8),
          Instruction.PUSH(),
          Instruction.IMM(2),
          Instruction.MUL()
        ]).run()

        assert.deepEqual(
          vm.snapshot(),
          {
            memory: [
              0, 8, // IMM 8
              3, // PUSH
              0, 2, // IMM 2
              6, // MUL
              // text top

              0, 0, 0, 8,
            ],
            textTop: 5,
            registers: {
              pc: 6,
              ax: 16,
              bp: 10,
              sp: 10
            }
          }
        )
      }
    )

    it(
      "DIV",
      () => {
        const vm = new VirtualMachine(10);
        vm.program([
          Instruction.IMM(8),
          Instruction.PUSH(),
          Instruction.IMM(2),
          Instruction.DIV()
        ]).run()

        assert.deepEqual(
          vm.snapshot(),
          {
            memory: [
              0, 8, // IMM 8
              3, // PUSH
              0, 2, // IMM 2
              7, // DIV
              // text top

              0, 0, 0, 8,
            ],
            textTop: 5,
            registers: {
              pc: 6,
              ax: 4,
              bp: 10,
              sp: 10
            }
          }
        )
      }
    )

    it(
      "ADD",
      () => {
        const vm = new VirtualMachine(10);
        vm.program([
          Instruction.IMM(8),
          Instruction.PUSH(),
          Instruction.IMM(2),
          Instruction.ADD()
        ]).run()

        assert.deepEqual(
          vm.snapshot(),
          {
            memory: [
              0, 8, // IMM 8
              3, // PUSH
              0, 2, // IMM 2
              4, // ADD
              // text top

              0, 0, 0, 8,
            ],
            textTop: 5,
            registers: {
              pc: 6,
              ax: 10,
              bp: 10,
              sp: 10
            }
          }
        )
      }
    )

    it(
      "SUB",
      () => {
        const vm = new VirtualMachine(10);
        vm.program([
          Instruction.IMM(8),
          Instruction.PUSH(),
          Instruction.IMM(2),
          Instruction.SUB()
        ]).run()

        assert.deepEqual(
          vm.snapshot(),
          {
            memory: [
              0, 8, // IMM 8
              3, // PUSH
              0, 2, // IMM 2
              5, // SUB
              // text top

              0, 0, 0, 8,
            ],
            textTop: 5,
            registers: {
              pc: 6,
              ax: 6,
              bp: 10,
              sp: 10
            }
          }
        )
      }
    )

    it(
      "reset",
      () => {
        const vm = new VirtualMachine(10);

        vm.program([
          Instruction.IMM(8),
          Instruction.PUSH(),
          Instruction.SI(),
          Instruction.IMM(7),
          Instruction.LI(),
        ]).run()
        const snapshot1 = vm.snapshot()

        vm.program([
          Instruction.IMM(8),
          Instruction.PUSH(),
          Instruction.SI(),
          Instruction.IMM(7),
          Instruction.LI(),
        ]).run()
        const snapshot2 = vm.snapshot()

        assert.deepEqual(
          snapshot1, snapshot2
        )
      }
    )

  }) // suite run
}) // suite ClangTokenizer

function array(size: number) {
  return Array.from({ length: size })
}