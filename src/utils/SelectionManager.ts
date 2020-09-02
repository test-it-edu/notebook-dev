/**
 * class SelectionManager
 * @author Ingo Andelhofs
 */
class SelectionManager {
  // Properties
  /**
   * element The element you want to manage the selection state of
   */
  private readonly element: HTMLElement;


  // Constructor
  /**
   * Constructor
   * @param element The element you want to manage the caret / range of
   */
  public constructor(element: HTMLElement) {
    this.element = element;
  }


  // Methods
  /**
   * Find the position of the caret in (possible caret positions)
   * @return caretPosition The caret positions found || 1 (the first caret position)
   */
  public findCaret(): number {
    let selection = SelectionManager.selection;

    if (!selection)
      return 1;

    let [node, offset] = SelectionManager.selectionFocus;

    if (!SelectionManager.isChildOfOrEqualTo(node, this.element))
      return 1;

    return this.countCaretPositionsBeforeNode(this.element, node, offset + 1);
  }

  /**
   * Set the caret to a given position
   * @param position The position of the caret (from 1 - end)
   */
  public setCaret(position: number): void {
    this.setSelection([position, position]);
  }

  /**
   * Find the selection of the managed element
   */
  public findSelection(): [number, number] {
    const selection = SelectionManager.selection;

    if (!selection)
      return [0, 0];

    let [startNode, startOffset] = SelectionManager.selectionAnchor;
    let [endNode, endOffset] = SelectionManager.selectionFocus;

    if (!SelectionManager.isChildOfOrEqualTo(startNode, this.element) ||
        !SelectionManager.isChildOfOrEqualTo(endNode, this.element))
      return [0, 0];

    return [
      this.countCaretPositionsBeforeNode(this.element, startNode, startOffset + 1),
      this.countCaretPositionsBeforeNode(this.element, endNode, endOffset + 1)
    ];
  }

  /**
   * Set a selection on the managed element
   * @param selection The selection parameters
   * @todo: Handle reverse range
   * @todo: Check selection out of range
   */
  public setSelection(selection: [number, number]): void {
    const windowSelection = SelectionManager.selection;
    const range = document.createRange();

    if (!windowSelection)
      return;

    let [start, end] = selection;
    let ltrSelection: [number, number] = start > end ? [end, start] : selection;
    this.setSelectionHelper(this.element, ltrSelection, range, [false, false], 0);

    if (start > end) {
      SelectionManager.selectRangeBackwards(range);
    }
    else {
      SelectionManager.selectRange(range);
    }
  }

  /**
   * Select a child element of the parent element
   * @param childElement The child element
   * @param collapseToStart
   *   True if you want to collapse to start,
   *   false if you want to collapse to end,
   *   null if none of both
   * @return void
   */
  public setElementSelection(childElement: HTMLElement, collapseToStart: boolean | null = null): void {
    const selection = window.getSelection();
    const range = document.createRange();

    if (!selection)
      return;

    selection?.removeAllRanges();
    range.selectNodeContents(childElement);

    if (collapseToStart !== null) {
      range.collapse(collapseToStart);
    }

    selection?.addRange(range);
  }

  /**
   * Returns the last possible caret position
   * @todo: finish
   */
  public getLastCaretPosition(): number {
    return 0;
  }

  /**
   * Print the structure of the managed element
   * @return void
   */
  public printStructure(): void {
    this.printStructureHelper(this.element, 0, 0);
  }


  // Getter methods
  private static getSelectionNodeAndOffset(node: Node, offset: number): [Node, number] {
    return node.childNodes.length - 1 >= offset ?
      [node.childNodes[offset], 0] :
      [node, offset];
  }

  private static get selectionAnchor(): [Node, number] {
    const selection = SelectionManager.selection;
    return SelectionManager.getSelectionNodeAndOffset(selection?.anchorNode!, selection?.anchorOffset!);
  }

  private static get selectionFocus(): [Node, number]  {
    const selection = SelectionManager.selection;
    return SelectionManager.getSelectionNodeAndOffset(selection?.focusNode!, selection?.focusOffset!);
  }

  private static get selection(): Selection | null {
    return window.getSelection() || null;
  }


  // DOM Helper methods
  /**
   * isChildOfOrEqualTo
   * @param childNode The child Node
   * @param parentNode The parent Node
   */
  private static isChildOfOrEqualTo(childNode: Node | null, parentNode: Node) {
    while (childNode !== null) {
      if (childNode === parentNode) {
        return true;
      }
      childNode = childNode.parentNode;
    }

    return false;
  }


  // Helper methods
  private static selectRangeBackwards(range: Range) {
    const selection = SelectionManager.selection;

    let endRange = range.cloneRange();
    let toStart = true;
    endRange.collapse(!toStart);

    selection?.removeAllRanges();
    selection?.addRange(endRange);
    selection?.extend(range.startContainer, range.startOffset);
  }

  private static selectRange(range: Range) {
    const selection = SelectionManager.selection;

    selection?.removeAllRanges();
    selection?.addRange(range);
  }


  /**
   * Print the structure of the managed element
   * @param element The element
   * @param spaces The amount of spaces before the first item
   * @param totalLength The total length (in caret positions)
   * @return the totalLength of the print (in caret positions)
   */
  private printStructureHelper(element: Node, spaces: number, totalLength: number): number {
    let nodes = element.childNodes;

    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      let name = node.nodeName;
      let text = node.textContent;
      let length = (name === "#text" ? text!.length : 0) + 1;

      totalLength += length;

      console.log(
        `${new Array(spaces).join(" ")} %c${name}%c: '${text}':${length}:${totalLength}`,
        "background: #e3e3e3; color: green;",
        "background: #fff; color: #111"
      );

      if (node.childNodes && node.childNodes.length > 0) {
        totalLength = this.printStructureHelper(node, spaces + 4, totalLength);
      }
    }

    return totalLength;
  }

  /**
   * Counts the amount of possible caret positions until the given node starting from the parent node.
   * @param parent The parent node
   * @param child The searched node
   * @param caretPositions The amount of caret positions already before the node
   * @return caretPositions
   */
  private countCaretPositionsBeforeNode(parent: Node, child: Node, caretPositions: number = 0): number {
    let [result] = this.countCaretPositionsBeforeNodeHelper(parent, child, caretPositions);
    return result;
  }

  /**
   * Counts the amount of possible caret positions until the given node starting from the parent node.
   * @param parent The parent node
   * @param child The searched node
   * @param caretPositions The amount of caret positions already before the node
   * @return [caretPositions, found]
   */
  private countCaretPositionsBeforeNodeHelper(parent: Node, child: Node, caretPositions: number): [number, boolean] {
    let nodes = parent.childNodes;

    if (parent === child) {
      return [caretPositions, true];
    }

    // console.log(parent.nodeName, caretPositions);


    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];

      // Check if node is child
      if (node === child) {
        return [caretPositions, true];
      }

      let name = node.nodeName;
      let text = node.textContent;
      let length = (name === "#text" ? text!.length : 0) + 1;
      caretPositions += length;

      let [nodeCaretPositions, nodeFound] = this.countCaretPositionsBeforeNodeHelper(node, child, caretPositions);
      caretPositions = nodeCaretPositions;

      if (nodeFound) {
        return [caretPositions, true];
      }
    }

    return [caretPositions, false];
  }

  /**
   * Helper for the setSelection method
   *
   * @TODO: Make iterative
   * @param element The element you want to set the selection of
   * @param selection The selection you want to set
   * @param range The range you want to set the selection to
   * @param selectionFound A flag for if the selection is found
   * @param currentPosition A counter for the current position
   */
  private setSelectionHelper(element: Node, selection: [number, number], range: Range, selectionFound: [boolean, boolean], currentPosition: number): [number, boolean, boolean] {
    let [startPosition, endPosition] = selection;
    let [startFound, endFound] = selectionFound;

    let nodes = element.childNodes;

    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      let name = node.nodeName;
      let text = node.textContent;
      let length = (name === "#text" ? text!.length : 0) + 1;

      // Start position
      if (currentPosition <= startPosition - 1 && startPosition <= currentPosition + length) {
        let offset = (startPosition - 1) - currentPosition;
        range.setStart(node, offset);
      }

      // End position
      if (currentPosition <= endPosition - 1 && endPosition <= currentPosition + length) {
        let offset = (endPosition - 1) - currentPosition;
        range.setEnd(node, offset);
      }

      currentPosition += length;

      if (node.childNodes && node.childNodes.length > 0) {
        let [updatedCurrentPosition] = this.setSelectionHelper(
          node,
          selection,
          range,
          [startFound, endFound],
          currentPosition
        );

        currentPosition = updatedCurrentPosition;
      }
    }

    return [currentPosition, startFound, endFound];
  }
}


export default SelectionManager;