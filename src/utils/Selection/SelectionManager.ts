/**
 * class SelectionManager
 * @author Ingo Andelhofs
 */
import DOMUtil from "../DOM/DOMUtil";
import DOMSelection from "./DOMSelection";

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
    let [, end] = this.findSelection();
    return end;
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
    const selection = DOMSelection.getSelection();

    if (!selection)
      return [0, 0];

    let [startNode, startOffset] = DOMSelection.selectionAnchor;
    let [endNode, endOffset] = DOMSelection.selectionFocus;

    if (!DOMUtil.isChildOf(startNode, this.element) ||
        !DOMUtil.isChildOf(endNode, this.element))
      return [0, 0];

    let [startPositions, endPositions] = this.getCaretPositionsBeforeNodes(startNode, endNode);

    return [
      startPositions + startOffset + 1,
      endPositions + endOffset + 1
    ];
  }

  /**
   * Get the amount of caret positions before the node given
   * @param node The node
   * @return caretPositions The amount of caret positions
   */
  private getCaretPositionsBeforeNode(node: Node): number {
    // Helper function + stack initialization
    let stack = new Array<Node>();
    const pushChildren = (_children: NodeListOf<ChildNode>) => {
      for (let i = _children.length - 1; i >= 0; --i)
        stack.push(_children[i]);
    }

    // Initialize
    let positions = 0;
    let children = this.element.childNodes;
    pushChildren(children);

    // Depth first count positions
    while(stack.length > 0) {
      let _node = stack.pop()!;

      if (node === _node) {
        return positions;
      }

      let name = _node.nodeName;
      let text = _node.textContent;
      let length = (name === "#text" ? text!.length : 0) + 1;
      positions += length;

      pushChildren(_node.childNodes);
    }

    return positions;
  }

  /**
   * Get the amount of caret positions before the 2 nodes given
   * @param startNode The start Node
   * @param endNode The end Node
   * @return [startCaretPositions, endCaretPositions] The amount of caret positions for each node
   */
  private getCaretPositionsBeforeNodes(startNode: Node, endNode: Node): [number, number] {
    // Helper function + stack initialization
    let stack = new Array<Node>();
    const pushChildren = (_children: NodeListOf<ChildNode>) => {
      for (let i = _children.length - 1; i >= 0; --i)
        stack.push(_children[i]);
    }

    // Initialize
    let startIndex = 0;
    let endIndex = 1;
    let positions: [number, number] = [0, 0];
    let positionsFound: [boolean, boolean] = [false, false];

    let children = this.element.childNodes;
    pushChildren(children);


    // Depth first count positions
    while(stack.length > 0) {
      let _node = stack.pop()!;

      if (startNode === _node) {
        positionsFound[startIndex] = true;
      }

      if (endNode === _node) {
        positionsFound[endIndex] = true;
      }

      if (positionsFound[startIndex] && positionsFound[endIndex]) {
        return positions;
      }

      let name = _node.nodeName;
      let text = _node.textContent;
      let length = (name === "#text" ? text!.length : 0) + 1;

      if (!positionsFound[startIndex]) {
        positions[startIndex] += length;
      }

      if (!positionsFound[endIndex]) {
        positions[endIndex] += length;
      }

      pushChildren(_node.childNodes);
    }

    return positions;
  }


  /**
   * Set a selection on the managed element
   * @param selection The selection parameters
   * @todo: Handle reverse range
   * @todo: Check selection out of range
   */
  public setSelection(selection: [number, number]): void {
    const windowSelection = DOMSelection.getSelection();

    if (!windowSelection)
      return;

    let [start, end] = selection;
    let range = this.createRange(selection);

    start > end ?
      DOMSelection.selectRangeReversed(range) :
      DOMSelection.selectRange(range);
  }

  /**
   * Create a range between bounds
   * @param bounds The bounds of the range
   * @return range The created range
   */
  public createRange(bounds: [number, number]): Range {
    // Helper function + stack initialization
    let stack = new Array<Node>();
    const pushChildren = (_children: NodeListOf<ChildNode>) => {
      for (let i = _children.length - 1; i >= 0; --i)
        stack.push(_children[i]);
    }

    // Initialize
    let position = 0;
    let range = new Range();
    let [startBound, endBound] = bounds.sort((a: any, b: any) => a - b);
    let [startBoundFound, endBoundFound] = [false, false];


    let children = this.element.childNodes;
    pushChildren(children);

    // Handle bounds lower than 0
    if (startBound <= 0) {
      range.setStart(this.element, 0);
      startBoundFound = true;

      if (startBound === endBound) {
        range.setEnd(this.element, 0);
        return range;
      }
    }



    // Depth first setRange and count position
    while(stack.length > 0) {
      let node = stack.pop()!;

      let name = node.nodeName;
      let text = node.textContent;
      let length = (name === "#text" ? text!.length : 0) + 1;

      // Start position
      if (!startBoundFound && position <= startBound - 1 && startBound <= position + length) {
        let offset = (startBound - 1) - position;
        range.setStart(node, offset);
        startBoundFound = true;
      }

      // End position
      if (!endBoundFound && position <= endBound - 1 && endBound <= position + length) {
        let offset = (endBound - 1) - position;
        range.setEnd(node, offset);
        endBoundFound = true;
      }

      if (startBoundFound && endBoundFound) {
        // console.log(bounds, range.startOffset, range.endOffset, 1);
        return range;
      }

      position += length;
      pushChildren(node.childNodes);


      // Set range start / end if not already set
      if (stack.length <= 0) {
        if (!startBoundFound) {
          range.setStart(node, length - 1);
        }
        if (!endBoundFound) {
          range.setEnd(node, length - 1);
        }
      }
    }

    // console.log(bounds, range.startOffset, range.endOffset, 2);
    return range;
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
   * Selects everything before the cursor
   * @return void
   */
  public selectBeforeCaret(): void {
    let caret = this.findCaret();
    let selection: [number, number] = [1, caret];

    this.setSelection(selection);
  }

  /**
   * Selects everything after the cursor
   * @return void
   */
  public selectAfterCaret(): void {
    let caret = this.findCaret();
    let end = this.lastCaretPosition;
    let selection: [number, number] = [caret, end];

    this.setSelection(selection);
  }


  /**
   * Get the first possible caretPosition
   * @return firstCaretPosition The first possible caret position
   */
  public get firstCaretPosition(): number {
    return 1;
  }

  /**
   * Get the last possible caretPosition
   * @return lastCaretPosition The last possible caret position
   */
  public get lastCaretPosition(): number {
    // Helper function + stack initialization
    let stack = new Array<Node>();
    const pushChildren = (_children: NodeListOf<ChildNode>) => {
      for (let i = _children.length - 1; i >= 0; --i)
        stack.push(_children[i]);
    }

    // Initialize
    let lastCaretPosition = 0;
    let children = this.element.childNodes;
    pushChildren(children);

    // Depth first count lastCaretPosition
    while(stack.length > 0) {
      let node = stack.pop()!;

      let name = node.nodeName;
      let text = node.textContent;
      let length = (name === "#text" ? text!.length : 0) + 1;
      lastCaretPosition += length;

      pushChildren(node.childNodes);
    }

    return lastCaretPosition;
  }


  /**
   * Prints the structure of the element tree to the console
   * @return void
   */
  public printStructure(spaces: number = 4): void {
    // Helper function
    let stack = new Array<[Node, number]>();
    const pushChildren = (_children: NodeListOf<ChildNode>, _depth: number) => {
      for (let i = _children.length - 1; i >= 0; --i)
        stack.push([_children[i], _depth]);
    }

    // Init data
    let element = this.element;
    let children = element.childNodes;
    let totalLength = 0;
    pushChildren(children, 0);


    while(stack.length > 0) {
      let [node, depth] = stack.pop()!;

      // Handle node
      let name = node.nodeName;
      let text = node.textContent;
      let length = (name === "#text" ? text!.length : 0) + 1;
      totalLength += length;

      let strSpaces = new Array((depth * spaces) + 1).join(" ");

      console.log(
        `${strSpaces}%c${name}%c: '${text}':${length}:${totalLength}`,
        "background: #e3e3e3; color: green;",
        "background: #fff; color: #111"
      );

      // Push children to stack
      ++depth;
      pushChildren(node.childNodes, depth);
    }
  }
}


export default SelectionManager;