export class ParserError extends Error {
  public constructor(message: string) {
    super(message)
  }

  public static assert(condition: boolean, message: string) {
    if (!condition) {
      throw new ParserError(message)
    }
  }
}
