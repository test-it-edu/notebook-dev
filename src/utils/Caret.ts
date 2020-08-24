/**
 * util Caret
 * @author Ingo Andelhofs
 */
class Caret {
  public static getPosition(element: any): number {
    let doc = element.ownerDocument || element.document;
    let window = doc.defaultView || doc.parentWindow;
    let selection;

    if (window.getSelection()) {
      if (window.getSelection().rangeCount > 0) {
        let range = window.getSelection().getRangeAt(0);
        let preCaretRange = range.cloneRange();

        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
      }
    }
    else if((selection = doc.selection) && selection.type !== "Control") {
      let textRange = selection.createRange();
      let preCaretTextRange = doc.body.createTextRange();

      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      return preCaretTextRange.text.length;
    }

    return 0;
  }
  public static setPosition(element: any, offset: number): void {
    let doc = element.ownerDocument || element.document;
    let window = doc.defaultView || doc.parentWindow;
    let range = doc.createRange();
    let selection = window.getSelection();

    // Check for child nodes
    if (element.childNodes.length === 0) {
      range.setStart(element, offset);
    }
    else {
      range.setStart(element.childNodes[0], offset);
    }

    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }
}


export default Caret;