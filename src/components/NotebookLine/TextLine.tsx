import React, {Component, ReactNode} from 'react';
import Cursor from "../../utils/Cursor";
import {NotebookContext} from "../Notebook/NotebookContext";
import ContentEditableParser from "../../utils/ContentEditableParser";
import MathJaxParser from "../../utils/MathJaxParser";
import {StringRenderMap} from "./NotebookLine";
import KeyManager from "../../utils/KeyManager";



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any> {
  // NotebookLine data
  data?: {
    subType: "p" | "h1" | "h2" | "h3" | string,
    content: string,
  },

  // Notebook info
  selected: boolean,
  cursorOptions: any,
  onChangeType: any,
}



/**
 * interface IState
 * @author Ingo Andelhofs
 */
interface IState {
  type?: "p" | "h1" | "h2" | "h3" | string,
  content: string,

  text: any,
  length: number,
  spacePressed: boolean,
  caretPosition?: number,
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
    text: "",
    content: "",
    length: 0,
    caretPosition: 0,
    type: "p",
    spacePressed: false,
  }



  // Methods
  private updateCursorPosition = () => {
    const caretPosition = Cursor.getPosition(this.ref.current);
    this.setState(() => { return { caretPosition, }; });
  }


  // OnMouseUp Handlers
  private onMouseUp = () => {
    this.updateCursorPosition();
  }


  // OnChange handlers
  private onChange = () => {
   // Update state
    const element = this.ref.current!;
    const text = element!.innerText;
    const content = element!.innerHTML;
    const length = element!.textContent!.length;
    const caretPosition = Cursor.getPosition(this.ref.current);

    this.setState(() => {
      return {
        text,
        content,
        length,
        caretPosition,
      }
    }, () => {
      this.handleTypeChange();
      // this.parseText();
    });
  }

  private handleTypeChange = () => {
    const {text, content, spacePressed} = this.state;
    const caretPosition = Cursor.getPosition(this.ref.current);


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
        let extraRemove = (content.substr(keyword.length, 1) === " ") ? " ".length : "&nbsp;".length;

        let removedKeywordContent = content.substring(keyword.length + extraRemove);
        this.setState(() => {
          return {
            content: removedKeywordContent,
            caretPosition: 0,
          };
        });

        return;
      }
    }


    // Handle line type change
    for (const keyword of Object.keys(StringRenderMap)) {
      if (this.changedKeywordIs(keyword, text, caretPosition)) {
        this.props.onChangeType(keyword);
        return;
      }
    }
  }

  private parseText = () => {
    let {text, content} = this.state;

    let cep = new ContentEditableParser(text, content, Cursor.getPosition(this.ref.current));

    let delimiter = /(\$[^$]*\$)/; /* Opening and closing $ */
    let parseCallback = (string: string) => {
      string = string.split("$").join("");

      let MJP = new MathJaxParser();
      MJP.setContainerOptions(this.ref.current);
      return MJP.parse(string);
    }

    return cep.getContentWithTextBetween(delimiter, parseCallback);
  }

  private setType = (type: string) => {
    console.log("Type Changed");
    this.setState(() => { return { type } });
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
    const cursorPosition = Cursor.getPosition(this.ref.current);

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

  private onSpace = (event: React.KeyboardEvent) => {
    this.setState(() => { return { spacePressed: true, }; });
  }

  private onArrowUp = (event: React.KeyboardEvent) => {
    event.preventDefault();
    this.context.selectPrevLine(Cursor.getPosition(this.ref.current));
  }

  private onArrowDown = (event: React.KeyboardEvent) => {
    event.preventDefault();
    this.context.selectNextLine(Cursor.getPosition(this.ref.current));
  }

  private onArrowLeft = (event: React.KeyboardEvent) => {
    if (Cursor.getPosition(this.ref.current) === 0) {
      event.preventDefault();
      this.context.selectPrevLine(Infinity);
    }

    this.updateCursorPosition();
  }

  private onArrowRight = (event: React.KeyboardEvent) => {
    if (Cursor.getPosition(this.ref.current) === this.state.text.length) {
      event.preventDefault();
      this.context.selectNextLine(0);
    }

    this.updateCursorPosition();
  }



  /**
   * Ensures that this TextLine is focussed
   */
  private ensureSelected() {
    if (!this.ref.current)
      return;

    if (this.props.selected)
      this.ref.current.focus();
    else {
      // POSSIBLE-BUG: Does not un-focus correctly
      this.ref.current.blur();
    }
  }


  /**
   * Called if the component mounts
   */
  public componentDidMount() {
    console.log("TextLine mounted");
    this.ensureSelected();
  }


  /**
   * Called if the components updates
   */
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    console.log("TextLine updated");
    this.ensureSelected();

    if (this.props.selected) {
      this.ref.current!.innerHTML = this.state.content;

      // Updated caret options
      if (prevProps.cursorOptions !== this.props.cursorOptions) {
        // POSSIBLE-BUG: cursor moves weirdly
        console.log("Caret Options change");

        let chars = Math.min(this.props.cursorOptions, this.state.length);
        Cursor.setPosition(this.ref.current, chars);
      }
      else {
        Cursor.setPosition(this.ref.current, this.state.caretPosition!);
      }

    }
    else {
      this.ref.current!.innerHTML = this.parseText();
    }
  }


  /**
   * Render the component
   */
  public render(): ReactNode {
    const selectedClass = this.props.selected ? "--selected" : "--not-selected";

    return <div
      className={selectedClass}
      ref={this.ref}

      data-line-type={this.state.type}

      onInput={this.onChange}
      onKeyDown={this.onKeyDown}
      onKeyUp={this.onKeyUp}
      onMouseUp={this.onMouseUp}

      spellCheck={false}
      contentEditable
    />;
  }
}


export default TextLine;