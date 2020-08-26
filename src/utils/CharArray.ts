/**
 * util CharArray
 * @deprecated This class will not be used in future code
 * @author Ingo Andelhofs
 */
class CharArray {
  private charArray: Array<any> = [];
  private originalString: string;
  private readonly originalCursorPosition: number;


  /**
   * Constructor
   * @param string The original String
   * @param cursorPosition The original cursor Position
   */
  public constructor(string: string, cursorPosition: number) {
    this.originalString = string;
    this.originalCursorPosition = cursorPosition;

    this.initCharArray();
  }


  /**
   * Initialize The CharArray
   */
  private initCharArray(): void {
    this.charArray = [];
    const originalStringLength = this.originalString.length;

    for (let index = 0; index < originalStringLength; ++index) {
      let char = this.originalString.charAt(index);
      this.charArray.push(char);
    }

    this.insertAt(this.originalCursorPosition, {cursor: true});
  }


  /**
   * Insert an element into this CharArray
   * @param position The position you want to insert the element in
   * @param element The element you want to insert
   */
  public insertAt(position: number, element: any): void {
    if (position < 0 || position > this.charArray.length) {
      throw new Error("Invalid position");
    }

    this.charArray.splice(position, 0, element);
  }


  /**
   * Converts this object to a String version
   */
  public toString(): string {
    let string = "";

    this.charArray.forEach((char: any, index: number) => {
      if (typeof char === "string")
        string += char;
    });

    return string;
  }


  /**
   * Get all the intervals between a given character
   * @param between The character you want the intervals of
   */
  public getAllIntervals(between: string | [string, string]): Array<any> {
    // Generalize between
    between = Array.isArray(between) ? between : [between, between];

    let result = [];
    let current = [];
    let opening = true;

    for (let i = 0; i < this.originalString.length; i++) {
      const char = this.originalString[i];

      if (opening && char === between[0]) {
        current.push(i);

        opening = !opening;
      }
      else if (!opening && char === between[1]) {
        current.push(i);
        result.push([...current]);
        current = [];

        opening = !opening;
      }

    }

    if (current.length > 0) {
      // TODO: Change to text.length
      result.push([...current, Infinity]);
    }

    return result;
  }


  /**
   * Get the interval where the cursor is located
   * or null if there is no interval with a cursor in it
   * @param intervals The intervals you want to search
   */
  public getCurrentInterval(intervals: Array<any>) {
    for (let [start, end] of intervals) {
      // Start after runner[0], stop after runner[1]
      // Only find an interval if we are typing in it, or finished typing
      if (start < this.originalCursorPosition /*- 1*/ && end > this.originalCursorPosition /*- 2*/) {
        return [start, end];
      }
    }

    return null;
  }


  // public replaceIntervalsWith(charArray: CharArray, between: string | [string, string]) {
  //   let thisIntervals = this.getAllIntervals(between);
  //   let replaceIntervals = charArray.getAllIntervals(between);
  //
  //
  // }


  public parseAll(between: string | [string, string], parseCallback: any) {
    let intervals = this.getAllIntervals(between);
    let intervalExtra = 0;

    for (let [start, end] of intervals) {
      start += intervalExtra;
      end += intervalExtra;

      let intervalLength = end - start;
      let intervalString = this.originalString.substring(start + 1, end);
      console.log(intervalString);

      let parsedInterval = parseCallback(intervalString);
      let parsedIntervalArray =
      // let parsedLength =  parsedInterval.length;
      console.log(parsedInterval);
    }

  }


  public parseAllWithoutCursor() {

  }
}


export default CharArray;