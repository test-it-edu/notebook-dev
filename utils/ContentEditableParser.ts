/**
 * util ContentEditableParser
 * @author Ingo Andelhofs
 */
class ContentEditableParser {
  private text: string;
  private content: string;
  private cursorPosition: number;


  public constructor(text: string, content: string, cursorPosition: number) {
    this.text = text;
    this.content = content;
    this.cursorPosition = cursorPosition;
  }


  public getContentWithTextBetween(delimiter: any, parseCallback: any = null) {
    let textParts = this.text.split(delimiter);
    let contentParts = this.content.split(delimiter);

    parseCallback = parseCallback ?? ((v: any) => v);

    if (textParts.length !== contentParts.length) {
      throw new Error(`
        Unexpected behaviour: HTML Uses delimiter character. 
        Text: -${this.text}-, HTML: -${this.content}-
      `);
    }

    for (let i = 0; i < textParts.length; i++) {
      if (i % 2 === 1 /* odd */) {
        contentParts[i] = parseCallback(textParts[i]);
      }
    }

    return contentParts.join("");
  }
}


export default ContentEditableParser;