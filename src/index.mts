import readlinePromises from 'readline/promises'
import { ArithDirectAsmGenParser } from './parser/index.mjs'
import { VirtualMachine } from './vm/vm.mjs'
import { ParserError } from './parser/error.mjs'

const args = process.argv.slice(2)
const clInterface = readlinePromises.createInterface(process.stdin, process.stdout)
if (arrayContains(args, '-e') || arrayContains(args, '--expression')) {
  const expression = args[args.indexOf('-e') + 1] || args[args.indexOf('--expression') + 1]
  clInterface.write(`${interpret(expression)}`)
  process.exit(0)
}

// REPL
clInterface.write('Arithmatic Evaluator REPL:\n')
clInterface.write('Type "exit" to exit\n\n')
while (true) {
  // R(ead)
  const expression = await clInterface.question('> ')
  if (expression === 'exit') {
    process.exit(0)
  }
  if (expression === null || expression === undefined || expression.trim() === '') {
    continue
  }

  // E(val)
  const result = interpret(expression)

  // P(rint)
  clInterface.write(`< ${result}\n\n`)

  // L(oop)
}

// utils
function arrayContains(arr: string[], value: string) {
  return arr.indexOf(value) > -1
}

function interpret(expression: string) {
  try {
    const parser = ArithDirectAsmGenParser.fromExpression(expression)
    const instructions = parser.parse()

    return new VirtualMachine().program(instructions).run()
  } catch (e: unknown) {
    if (e instanceof ParserError) {
      return e?.message ?? 'An error occurred'
    }
    return 'An error occurred'
  }
}
