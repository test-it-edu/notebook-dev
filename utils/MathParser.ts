import katex from "katex";


/**
 * util MathParser
 * @author Ingo Andelhofs
 */
class MathParser {
  /**
   * Parse the given string
   * @param string The string
   */
  public static parse(string: string): string {
    return katex.renderToString(string, {
      throwOnError: false,
    });
  }
}


export default MathParser;