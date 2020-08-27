import React, {Component, ReactNode} from 'react';
import Cursor from "../../utils/Cursor";
import {NotebookContext} from "../Notebook/NotebookContext";
import ContentEditableParser from "../../utils/ContentEditableParser";
import MathJaxParser from "../../utils/MathJaxParser";
import {StringRenderMap} from "./RenderMap";



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any> {
  // NotebookLine data
  data?: {
    text: any,
    content: any,
    length: number,
    type: "p" | "h1" | "h2" | "h3",
  },

  // Notebook info
  selected: boolean,
  caretOptions: any,
  onChangeType: any,
}



/**
 * interface IState
 * @author Ingo Andelhofs
 */
interface IState {
  text: any,
  content: string,
  length: number,
  spacePressed: boolean,
  caretPosition?: number,
  type?: "p" | "h1" | "h2" | "h3" | string,
}



/**
 * class TextLine
 * @author Ingo Andelhofs
 *
 * @TODO (BUG): On left/right arrow key hold, cursor only moves 1 character
 * @TODO (BUG): Remove of text on type change to heading
 * @TODO (BUG): Handle cursor on selection
 * @TODO: Handle Del button and Enter (in the middle of text)
 */
class TextLine extends Component<IProps, IState> {
  // React
  public static contextType = NotebookContext;
  public state: IState = {
    text: "",
    content: "",
    length: 0,
    caretPosition: 0,
    type: "p",
    spacePressed: false,
  }

  // References
  private ref = React.createRef<HTMLDivElement>();

  // Methods
  private onCaretChange = () => {
    const caretPosition = Cursor.getPosition(this.ref.current);

    this.setState(() => {
      return {
        caretPosition,
      }
    });
  }


  private onMouseUp = () => {
    this.onCaretChange();
  }


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


  private onKeyUp = () => {
    this.onCaretChange();
  }

  private onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.onEnter();
    }
    else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.onUpArrow();
    }
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      this.onDownArrow();
    }
    else if (event.key === "Backspace") {
      this.onBackspace(event);
    }
    else if (event.key === "ArrowLeft") {
      this.onLeftArrow(event);
    }
    else if (event.key === "ArrowRight") {
      this.onRightArrow(event);
    }

    let spacePressed = event.key === " ";
    this.setState(() => {
      return { spacePressed };
    });


    // Reset type
    const {text} = this.state;
    if (event.key === "Backspace" && text.substring(0, Cursor.getPosition(this.ref.current)) === "") {
      this.setType("p");
    }
  }

  private onEnter = () => {
    this.context.createLine();
  }

  private onBackspace = (event: React.KeyboardEvent) => {
    if (Cursor.getPosition(this.ref.current) === 0) {
      event.preventDefault();
      this.context.deleteLine({end: true});
    }
  }

  private onUpArrow = () => {
    this.context.selectPrevLine({});
  }

  private onDownArrow = () => {
    this.context.selectNextLine({});
  }

  private onLeftArrow = (event: React.KeyboardEvent) => {
    if (Cursor.getPosition(this.ref.current) === 0) {
      event.preventDefault();
      this.context.selectPrevLine({end: true});
    }
  }

  private onRightArrow = (event: React.KeyboardEvent) => {
    if (Cursor.getPosition(this.ref.current) === this.state.text.length) {
      event.preventDefault();
      this.context.selectNextLine({end: false});
    }
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


  private ensureCaretOptions() {
    if (this.props.selected) {
      if (this.props.caretOptions.end) {
        Cursor.setPosition(this.ref.current, this.state.length);

        this.context.resetCaretOptions();
      }
    }
  }

  /**
   * Called if the component mounts
   */
  public componentDidMount() {
    this.ensureSelected();
  }


  /**
   * Called if the components updates
   */
  public componentDidUpdate() {
    this.ensureSelected();

    if (!this.props.selected) {
      this.ref.current!.innerHTML = this.parseText();
    }
    else {
      this.ref.current!.innerHTML = this.state.content;

      if (this.props.caretOptions.end) {
        Cursor.setPosition(this.ref.current, this.state.length);
        this.context.resetCaretOptions();
        this.onCaretChange();
        return;
      }

      Cursor.setPosition(this.ref.current, this.state.caretPosition!);
    }

    // this.ensureCaretOptions();
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

      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      contentEditable
    />;
  }
}


export default TextLine;