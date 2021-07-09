import DOMRange from "./DOMRange";


/**
 * class DOMSelection
 * @author Ingo Andelhofs
 */
class DOMSelection {
  // Helper methods
  public static getSelection(): Selection {
    return window.getSelection() || new Selection();
  }

  private static getSelectionNodeAndOffset(node: Node, offset: number): [Node, number] {
    return node.childNodes.length - 1 >= offset ?
      [node.childNodes[offset], 0] :
      [node, offset];
  }

  public static get selectionAnchor(): [Node, number] {
    const selection = DOMSelection.getSelection();
    return DOMSelection.getSelectionNodeAndOffset(selection?.anchorNode!, selection?.anchorOffset!);
  }

  public static get selectionFocus(): [Node, number]  {
    const selection = DOMSelection.getSelection();
    return DOMSelection.getSelectionNodeAndOffset(selection?.focusNode!, selection?.focusOffset!);
  }

  public static selectRange(range: Range) {
    const selection = DOMSelection.getSelection();

    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  public static selectRangeReversed(range: Range) {
    const selection = DOMSelection.getSelection();

    let endRange = range.cloneRange();
    let toStart = true;
    endRange.collapse(!toStart);

    selection?.removeAllRanges();
    selection?.addRange(endRange);
    selection?.extend(range.startContainer, range.startOffset);
  }

  // TODO: Implement
  public static select(range: DOMRange): void {}
  public static selectReversed(range: DOMRange): void {}
}


export default DOMSelection;