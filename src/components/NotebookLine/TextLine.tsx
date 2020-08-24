import React, {Component, ReactNode} from 'react';
import Caret from "../../utils/Caret";
import {NotebookContext} from "../Notebook/NotebookContext";



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any>  {
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
  caretPosition?: number,
  type?: "p" | "h1" | "h2" | "h3" | string,
}



/**
 * class TextLine
 * @author Ingo Andelhofs
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
  }

  // References
  private ref = React.createRef<HTMLDivElement>();

  // Methods
  private onCaretChange = () => {
    const caretPosition = Caret.getPosition(this.ref.current);
    this.setState(() => {
      return {
        caretPosition,
      }
    });
  }


  private onChange = () => {
    // Update state
    const element = this.ref.current!;
    const text = element!.innerText;
    const content = element!.innerHTML;
    const length = element!.textContent!.length;

    this.setState(() => {
      return {
        text,
        content,
        length,
      }
    }, () => {
      // Handle types
      this.handleTypeChange();
    });
  }

  private handleTypeChange = () => {
    const {text} = this.state;
    const caretPosition = Caret.getPosition(this.ref.current);

    // Handle reset
    if (text === "") {
      this.setType("p");
      return;
    }

    // Handle inner line type change
    const innerChangeKeywords = {
      "#": "h1",
      "##": "h2",
      "###": "h3",
    }

    for (const [keyword, value] of Object.entries(innerChangeKeywords)) {
      if (this.changedKeywordIs(keyword, text, caretPosition)) {
        this.setType(value);
        return;
      }
    }


    // Handle line type change
    const outerChangeKeywords = [
      "img",
      "txt",
    ];

    for (const keyword of outerChangeKeywords) {
      if (this.changedKeywordIs(keyword, text, caretPosition)) {
        this.props.onChangeType(keyword);
        return;
      }
    }
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

  }

  private onEnter = () => {
    this.context.createLine();
  }

  private onBackspace = (event: React.KeyboardEvent) => {
    // TODO: Handle Del key

    if (Caret.getPosition(this.ref.current) === 0) {
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
    if (Caret.getPosition(this.ref.current) === 0) {
      event.preventDefault();
      this.context.selectPrevLine({end: true});
    }
  }

  private onRightArrow = (event: React.KeyboardEvent) => {
    if (Caret.getPosition(this.ref.current) === this.state.text.length) {
      event.preventDefault();
      this.context.selectNextLine({end: false});
    }
  }



  private ensureSelected() {
    //TODO: UnFocus when not selected (image can not be focussed
    if (this.props.selected && this.ref.current)
      this.ref.current.focus();
  }

  private ensureCaretOptions() {
    if (this.props.selected) {
      if (this.props.caretOptions.end) {
        Caret.setPosition(this.ref.current, this.state.length);
        this.context.resetCaretOptions();
      }
    }
  }

  public componentDidMount() {
    this.ensureSelected();
  }

  public componentDidUpdate() {
    this.ensureSelected();
    this.ensureCaretOptions();
  }



  public render(): ReactNode {
    const selectedClass = this.props.selected ? "--selected" : "--not-selected";

    // TODO: Switch to React-ContentEditable
    return <div
      className={selectedClass}
      ref={this.ref}

      data-line-type={this.state.type}

      onInput={this.onChange}
      onKeyDown={this.onKeyDown}
      onKeyUp={this.onKeyUp}
      onMouseUp={this.onCaretChange}

      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      contentEditable
    />;
  }
}


export default TextLine;