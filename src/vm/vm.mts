import { VirtualMachineError } from "./error.mjs"
import { reverse, shallowCopy } from "./utils.mjs"

type InstructionArgs<Type extends InstructionType> =
  Type extends 'IMM' ? [number] :
  [undefined]

// inst code --> inst name
const instructionNames = {
  0: 'IMM', // IMM <num> -- save <num> to register AX
  1: 'LI', // LI -- load integer from address in AX
  2: 'SI', // SI -- save integer from AX to address referenced by stack top
  3: 'PUSH', // PUSH -- push AX to stack
  4: 'ADD', // ADD -- add stack top to AX
  5: 'SUB', // SUB -- subtract AX from stack top
  6: 'MUL', // MUL -- multiply stack top by AX
  7: 'DIV', // DIV -- divide stack top by AX
  8: 'POP' // POP -- pop stack top to AX
  // system calls
} as const
// inst name --> inst code
const instructionCodes = reverse(instructionNames)

type InstructionType = keyof typeof instructionCodes
export class Instruction<Type extends InstructionType = InstructionType> {
  public type: Type
  public args: InstructionArgs<Type>

  private constructor(type: Type, ...args: InstructionArgs<Type>) {
    this.type = type
    this.args = args
  }

  public flatten(): number[] {
    VirtualMachineError.assertNonNull(this.type, 'Instruction type must be non-null')
    VirtualMachineError.assertNonNull(instructionCodes[this.type], 'Instruction ' + this.type + ' not found')
    VirtualMachineError.assertNonNull(this.args, 'Instruction args must be non-null')

    return [instructionCodes[this.type], ...(this.args.filter(arg => arg !== undefined))]
  }

  public toString(): string {
    return this.type + ' ' + this.args.join(' ')
  }

  public static IMM(num: number): Instruction<'IMM'> {
    return new Instruction('IMM', num)
  }

  public static LI(): Instruction<'LI'> {
    return new Instruction('LI', undefined)
  }

  public static SI(): Instruction<'SI'> {
    return new Instruction('SI', undefined)
  }

  public static PUSH(): Instruction<'PUSH'> {
    return new Instruction('PUSH', undefined)
  }

  public static ADD(): Instruction<'ADD'> {
    return new Instruction('ADD', undefined)
  }

  public static SUB(): Instruction<'SUB'> {
    return new Instruction('SUB', undefined)
  }

  public static MUL(): Instruction<'MUL'> {
    return new Instruction('MUL', undefined)
  }

  public static DIV(): Instruction<'DIV'> {
    return new Instruction('DIV', undefined)
  }

  public static POP(): Instruction<'POP'> {
    return new Instruction('POP', undefined)
  }
}
export class VirtualMachine {
  private instuctions: Instruction[] = []
  private memory: number[]

  // the top of the text segment
  private textTop = 0

  // registers
  private pc = 0
  private ax = 0
  private bp = 0
  private sp = 0

  public constructor(size?: number) {
    size = size ?? 1024
    this.memory = Array.from<number>({ length: size }).fill(0)
  }

  public program(instructions: Instruction[]): VirtualMachine {
    this.reset()
    this.instuctions = shallowCopy(instructions)
    this.copy(instructions.flatMap(inst => inst.flatten()), this.memory)
    this.sp = this.memory.length
    this.bp = this.sp

    return this
  }

  private copy(instructions: number[], memory: number[]) {
    VirtualMachineError.assertGte(
      memory.length, instructions.length,
      'load program instructions error, heap overflow'
    )

    for (let i = 0; i < instructions.length; i++) {
      memory[i] = instructions[i]
    }

    this.textTop = instructions.length - 1
  }

  private reset() {
    this.memory = this.memory.fill(0)
    this.pc = 0
    this.ax = 0
    this.bp = 0
    this.sp = 0
  }

  public snapshot(): {
    memory: number[],
    textTop: number,
    registers: {
      pc: number,
      ax: number,
      bp: number,
      sp: number
    }
  } {
    return {
      memory: shallowCopy(this.memory),
      textTop: this.textTop,
      registers: {
        pc: this.pc,
        ax: this.ax,
        bp: this.bp,
        sp: this.sp
      }
    }
  }

  public run(): number {
    while (this.pc <= this.textTop && this.memory[this.pc] !== undefined) {
      const inst: InstructionType | undefined = instructionNames[this.memory[this.pc] as keyof typeof instructionNames]
      if (inst === 'IMM') {
        this.ax = this.memory[++this.pc]
      }

      else if (inst === 'LI') {
        VirtualMachineError.assert(
          this.ax >= 0 && this.ax < this.memory.length,
          'The memory address ' + this.ax + ' in ax register referenced by LI(' + this.pc + ') is out of bounds'
        )

        this.ax = this.memory[this.ax]
      }

      else if (inst === 'SI') {
        const addrToSave = this.memory[ /* stack pop */ this.sp++]
        VirtualMachineError.assert(
          addrToSave > this.textTop && addrToSave < this.memory.length,
          'The memory address ' + addrToSave + ' referenced in stack(' + (this.sp - 1) + ') with SI(' + this.pc + ') is out of bounds'
        )

        this.memory[addrToSave] = this.ax
      }

      else if (inst === 'PUSH') {
        VirtualMachineError.assertGte(
          this.sp - 1, this.textTop,
          'The address being pushed onto the stack (' + this.sp + ') has reached the top of the text segment (' + this.textTop + '), causing a stack overflow'
        )

        this.memory[--this.sp] = this.ax
      }

      else if (inst === 'ADD') {
        this.ax = this.memory[this.sp++] + this.ax
      }

      else if (inst === 'SUB') {
        this.ax = this.memory[this.sp++] - this.ax
      }

      else if (inst == 'MUL') {
        this.ax = this.memory[this.sp++] * this.ax
      }

      else if (inst == 'DIV') {
        this.ax = this.memory[this.sp++] / this.ax
      }

      else if (inst == 'POP') {
        VirtualMachineError.assert(
          this.sp < this.memory.length,
          'The address being popped from the stack (' + this.sp + ') has reached the bottom of the stack, causing a stack underflow'
        )
        this.ax = this.memory[this.sp++]
      }

      else {
        throw new VirtualMachineError('Unknown instruction: ' + inst)
      }

      this.pc++
    }

    return this.ax
  }
}
