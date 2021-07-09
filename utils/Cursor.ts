/**
 * util Cursor
 * @author Ingo Andelhofs
 *
 * @todo: Create a range method with start and end chars (offset)
 * @todo: Cursor max position is textLength + </br> count, currently we are not counting </br> as an extra cursor position
 */
class Cursor {
  /**
   * Get the position of the cursor
   * @param parentElement The element you want to check the cursor position of
   */
  public static getPosition(parentElement: any) {
    let selection = window.getSelection()!;
    let charCount = -1;
    let node;

    if (selection.focusNode) {
      if (Cursor._isChildOf(selection.focusNode, parentElement)) {
        node = selection.focusNode;
        charCount = selection.focusOffset;

        while (node) {
          if (node === parentElement) {
            break;
          }

          if (node.previousSibling) {
            console.log("Cursor:getPosition: ", node.nodeName);
            node = node.previousSibling;
            charCount += node!.textContent!.length;
          }
          else {
            node = node.parentNode;
            if (node === null) {
              break;
            }
          }
        }
      }
    }

    return charCount;
  }


  /**
   * Set the cursor at the given position
   * @param element The element you want to move the cursor of
   * @param chars The cursor position in chars
   */
  public static setPosition(element: any, chars: number) {
    if (chars >= 0) {
      let selection = window.getSelection()!;

      let range = Cursor._createRange(element, {count: chars}, null);

      if (range) {
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }


  /**
   * Create a range
   *
   * A node can be both a text or element node:
   * - for text nodes offset skips that many of characters
   * - for element nodes that many child nodes.
   */
  private static _createRange(node: any, chars: any, range: any) {
    if (!range) {
      range = document.createRange()
      range.selectNode(node);
      range.setStart(node, 0);
    }

    // If the chars count is 0, we dont have to check for textNodes or elementNodes
    if (chars.count === 0) {
      range.setEnd(node, chars.count);
    }
    else if (node && chars.count > 0) {
      if (node.nodeType === Node.TEXT_NODE) { // Handle TEXT node
        if (node.textContent.length < chars.count) {
          chars.count -= node.textContent.length;
        }
        else {
          range.setEnd(node, chars.count);
          chars.count = 0;
        }
      }
      else if (node.nodeName === "BR") {
        if (chars.count > 0) {
          chars.count--;
        }
        else {
          range.setEnd(node, chars.count);
          chars.count = 0;
        }
      }
      else { // Handle ELEMENT node
        for (let lp = 0; lp < node.childNodes.length; lp++) {
          // Extend the range of the node by adding the range of the child nodes
          range = Cursor._createRange(node.childNodes[lp], chars, range);

          // Stop extending the range if there are no more chars to go forward
          if (chars.count === 0) {
            break;
          }
        }
      }
    }

    return range;
  }


  /**
   * Checks if a node is a child of the parent node
   */
  private static _isChildOf(node: any, parentElement: any) {
    while (node !== null) {
      if (node === parentElement) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }
}


export default Cursor;