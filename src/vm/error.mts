export class VirtualMachineError extends Error {
  public constructor(message: string) {
    super(message)
  }

  static assert(condition: boolean, message: string) {
    if (!condition) {
      throw new VirtualMachineError(message)
    }
  }

  public static assertGte(num: number, min: number, message: string): void {
    if (num < min) {
      throw new VirtualMachineError(message)
    }
  }

  public static assertNonNull(v: unknown, message: string): void {
    if (v === null || v === undefined) {
      throw new VirtualMachineError(message)
    }
  }

  public toString(): string {
    return `VirtualMachineError: ${this.message}`
  }
}
