import React, {Component, ReactNode} from 'react';
import Cursor from "../../utils/Cursor";
import {NotebookContext} from "../Notebook/NotebookContext";
import ContentEditableParser from "../../utils/ContentEditableParser";
import MathParser from "../../utils/MathParser";
import {StringRenderMap} from "./NotebookLine";
import KeyManager from "../../utils/KeyManager";



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any> {
  // Data
  defaultData?: {
    subType: "p" | "h1" | "h2" | "h3" | string,
    html: string,
    text: string,
    cursor: number,
  },

  // Notebook
  selected: boolean,
  position: number,
  cursor: any,

  // NotebookLine
  onLineTypeChange: (type: string) => void,
  onPaste: (event: React.ClipboardEvent) => void,
}



/**
 * interface IState
 * @author Ingo Andelhofs
 */
interface IState {
  // Data
  subType: "p" | "h1" | "h2" | "h3" | string,
  html: string,
  text: any,
  cursor: number,

  // Temporary state
  spacePressed: boolean,
}



/**
 * class TextLine
 * @author Ingo Andelhofs
 *
 * @TODO (BUG): Handle cursor on selection (onClick componentDidMount is called)
 * @TODO: Handle Del button and Enter (in the middle of text)
 */
class TextLine extends Component<IProps, IState> {
  // Properties
  public static contextType = NotebookContext;
  private ref = React.createRef<HTMLDivElement>();

  // Initial State
  public state: IState = {
    subType: "p",
    html: "",
    text: "",
    cursor: 0,

    spacePressed: false,
  }


  // Getters
  private get element(): HTMLDivElement {
    return this.ref.current!;
  }
  private get maxCursor(): number {
    return this.state.text.length;
  }


  // Methods
  private updateCursorPosition = () => {
    const caretPosition = Cursor.getPosition(this.element);

    this.setState(() => ({ cursor: caretPosition }));
  }


  // OnMouseUp Handlers
  private onMouseUp = () => {
    this.updateCursorPosition();
  }


  // OnChange handlers
  private onChange = () => {
   // Update state
    const text = this.element.innerText;
    const content = this.element.innerHTML;
    const caretPosition = Cursor.getPosition(this.element);

    this.setState(() => ({
        text,
        html: content,
        cursor: caretPosition,
    }), () => {
      this.handleTypeChange();
      // this.parseText();
    });
  }

  private handleTypeChange = () => {
    const {text, html, spacePressed} = this.state;
    const caretPosition = Cursor.getPosition(this.element);


    // Handle inner line type change
    const innerChangeKeywords = {
      "#": "h1",
      "##": "h2",
      "###": "h3",
    }

    for (const [keyword, value] of Object.entries(innerChangeKeywords)) {
      if (spacePressed && this.changedKeywordIs(keyword, text, caretPosition)) {
        this.setType(value);

        // Don't remove all text only the space!
        // Sometimes the space char is represented as &nbsp;
        let extraRemove = (html.substr(keyword.length, 1) === " ") ? " ".length : "&nbsp;".length;

        let removedKeywordContent = html.substring(keyword.length + extraRemove);
        this.setState(() => {
          return {
            html: removedKeywordContent,
            cursor: 0,
          };
        });

        return;
      }
    }


    // Handle line type change
    for (const keyword of Object.keys(StringRenderMap)) {
      if (this.changedKeywordIs(keyword, text, caretPosition)) {
        this.props.onLineTypeChange(keyword);
        return;
      }
    }
  }

  private parseText = () => {
    let {text, html} = this.state;

    let cep = new ContentEditableParser(text, html, Cursor.getPosition(this.element));

    let delimiter = /(\$[^$]*\$)/; /* Opening and closing $ */
    let parseCallback = (string: string) => {
      string = string.split("$").join("");

      return MathParser.parse(string);
    }

    return cep.getContentWithTextBetween(delimiter, parseCallback);
  }

  private setType = (type: string) => {
    this.setState(() => ({ subType: type }));
  }

  private changedKeywordIs = (keyword: string, text: string, caretPosition: number) => {
    const firstKeyword = text.split(" ")[0].trim();
    const keywordLength = keyword.length;

    return (firstKeyword === keyword && caretPosition === keywordLength + 1);
  }


  // KeyUp Handlers
  private onKeyUp = () => {
    this.updateCursorPosition();
  }


  // KeyDown Handlers
  private onKeyDown = (event: React.KeyboardEvent) => {
    let keyManager = new KeyManager(event);

    keyManager.on({
      "Enter": this.onEnter,
      "Backspace": this.onBackspace,
      " ": this.onSpace,
      "ArrowUp": this.onArrowUp,
      "ArrowDown": this.onArrowDown,
      "ArrowLeft": this.onArrowLeft,
      "ArrowRight": this.onArrowRight,
    });
  }

  private onEnter = (event: React.KeyboardEvent) => {
    event.preventDefault();
    this.context.createLine();
  }

  private onBackspace = (event: React.KeyboardEvent) => {
    const {text} = this.state;
    const cursorPosition = Cursor.getPosition(this.element);

    const beforeCursor = text.substring(0, cursorPosition);
    const afterCursor = text.substring(cursorPosition);

    if (beforeCursor === "") {
      if (afterCursor === "") {
        event.preventDefault();
        this.context.deleteLine(Infinity);
      }

      this.setType("p");
    }
  }

  private onSpace = () => {
    // event: React.KeyboardEvent
    this.setState(() => { return { spacePressed: true, }; });
  }

  private onArrowUp = (event: React.KeyboardEvent) => {
    event.preventDefault();
    this.context.selectPrevLine(Cursor.getPosition(this.element));
  }

  private onArrowDown = (event: React.KeyboardEvent) => {
    event.preventDefault();
    this.context.selectNextLine(Cursor.getPosition(this.element));
  }

  private onArrowLeft = (event: React.KeyboardEvent) => {
    if (Cursor.getPosition(this.element) === 0) {
      event.preventDefault();
      this.context.selectPrevLine(Infinity);
    }

    this.updateCursorPosition();
  }

  private onArrowRight = (event: React.KeyboardEvent) => {
    if (Cursor.getPosition(this.element) === this.maxCursor) {
      event.preventDefault();
      this.context.selectNextLine(0);
    }

    console.log(Cursor.getPosition(this.element));
    this.updateCursorPosition();
  }


  private export() {
    this.context.exportLine(this.props.position, "txt", {
      subType: this.state.subType,
      html: this.state.html,
      text: this.state.text,
      cursor: this.state.cursor,
    });
  }


  /**
   * Ensures that this TextLine is focussed
   */
  private ensureSelected() {
    this.props.selected ?
      this.element.focus() :
      this.element.blur();
  }


  /**
   * Called if the component mounts
   */
  public componentDidMount() {
    // console.log("TextLine mounted");
    this.ensureSelected();
    this.export();
  }


  /**
   * Called if the components updates
   */
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    // console.log("TextLine updated");
    this.ensureSelected();

    if (this.props.selected) {
      this.element.innerHTML = this.state.html;

      // Updated caret options
      if (prevProps.cursor !== this.props.cursor) {
        let chars = Math.min(this.props.cursor, this.maxCursor);
        Cursor.setPosition(this.element, chars);
      }
      else {
        Cursor.setPosition(this.element, this.state.cursor!);
      }

    }
    else {
      this.element.innerHTML = this.parseText();
    }

    // Export if content updates
    // TODO: If prevState !== state
    if (prevState.html !== this.state.html) {
      this.export();
    }


    if (this.props.defaultData?.subType &&
        this.props.defaultData?.subType !== this.state.subType &&
        this.props.defaultData?.subType !== prevProps.defaultData?.subType)
    {
      this.setState(() => ({subType: this.props.defaultData?.subType!}));
    }
  }


  /**
   * Render the component
   */
  public render(): ReactNode {
    const selectedClass = this.props.selected ? "--selected" : "--not-selected";

    return <div
      className={selectedClass + "line text-line"}
      ref={this.ref}

      data-line-type={this.state.subType}

      onInput={this.onChange}
      onKeyDown={this.onKeyDown}
      onKeyUp={this.onKeyUp}
      onMouseUp={this.onMouseUp}

      onPaste={this.props.onPaste}

      spellCheck={false}
      contentEditable
    />;
  }
}


export default TextLine;