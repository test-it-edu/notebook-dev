import React, {Component, ReactNode} from 'react';
import ContentEditableParser from "../../utils/ContentEditableParser";
import MathParser from "../../utils/MathParser";
import KeyManager from "../../utils/KeyManager";
import {NotebookContext, NotebookContextValue} from "../Notebook/NotebookContext";
import {StringRenderMap} from "./base/NotebookLine";

import Cursor from "../../utils/Cursor";
import SelectionManager from "../../utils/Selection/SelectionManager";



/**
 * Types
 * @author Ingo Andelhofs
 */
type TextLineSubType = "p" | "h1" | "h2" | "h3" | string;
type HTMLString = string;
type Selection = [number, number];
type DefaultData = {
  subType: TextLineSubType;
  html: HTMLString;
  selection: Selection;
}



/**
 * Props Interface
 * @author Ingo Andelhofs
 */
interface Props extends React.HTMLAttributes<HTMLElement> {
  // Data
  defaultData?: DefaultData;

  // Notebook
  selected: boolean;
  position: number;
  cursor: any;

  // NotebookLine
  onLineTypeChange: (type: string) => void;
  onPaste: (event: React.ClipboardEvent) => void;
}


/**
 * State Interface
 * @author Ingo Andelhofs
 */
interface State {
  subType: TextLineSubType;
  html: HTMLString;
}



/**
 * TextLine Component
 * @author Ingo Andelhofs
 *
 * @todo (BUG): Handle cursor on selection (onClick componentDidMount is called)
 * @todo: Handle Del button and Enter (in the middle of text)
 */
class TextLine extends Component<Props, State> {

  // Properties
  public context: NotebookContextValue;
  private selectionManager: SelectionManager;
  private ref = React.createRef<HTMLDivElement>();
  public state: State = {
    subType: "p",
    html: "",
  };

  // Static properties
  public static readonly TYPE = "txt";
  public static contextType = NotebookContext;
  public static defaultProps = {};

  // Getters
  private get element(): HTMLDivElement { return this.ref.current! };
  private get text(): string { return this.element.innerText; }
  private get html(): string { return this.element.innerHTML; }
  private get maxCursor(): number { return this.text.length; }


  // Methods
  private htmlToInnerText = (html: HTMLString) => {
    const tempContainer = document.createElement("DIV");
    tempContainer.innerHTML = html;
    return tempContainer.innerText || "";
  }


  // Event Handlers
  // OnMouseUp Handlers
  private onMouseUp = () => {
    this.onSelect();
  }

  // OnClick Handlers
  private onSelect = () => {
    this.context.selectLine(this.props.position);
  }


  // OnChange handlers
  private onChange = () => {
    const {html} = this.state;
    this.setState(() => ({ html: this.html }), () => this.handleTypeChange(html));
  }

  private handleTypeChange = (prevHTML: HTMLString) => {
    // todo: Move typeChange handler to onSpace pressed
    const {html} = this.state;
    const prevText = this.htmlToInnerText(prevHTML);
    const text = this.text;

    const insertIntoString = (string: string, index: number, insertion: string) => {
      return string.slice(0, index) + insertion + string.slice(index);
    }

    const isKeyword = (keyword: string, text: string, prevText: string): boolean => {
      const prevInsertedText = insertIntoString(prevText, keyword.length, " ").trim();
      const firstKeyword = text.split(" ")[0].trim();

      return prevInsertedText === text.trim() && firstKeyword === keyword;
    }


    // Handle inner line type change
    const innerChangeKeywords = {
      "#": "h1",
      "##": "h2",
      "###": "h3",
    }

    for (const [keyword, value] of Object.entries(innerChangeKeywords)) {
      if (isKeyword(keyword, text, prevText)) {
        this.setType(value);

        // Remove text until the first space " " or "&nbsp;"
        let extraRemove = (html.substr(keyword.length, 1) === " ") ? " ".length : "&nbsp;".length;
        let removedKeywordContent = html.substring(keyword.length + extraRemove);

        this.element.innerHTML = removedKeywordContent;
        this.setState(() => ({ html: removedKeywordContent }));

        this.selectionManager.setCaret(0);
        return;
      }
    }

    // Handle line type change
    for (const keyword of Object.keys(StringRenderMap)) {
      if (isKeyword(keyword, text, prevText)) {
        this.props.onLineTypeChange(keyword);
        return;
      }
    }
  }

  private parseText = () => {
    const {html} = this.state;
    const text = this.text;
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


  // KeyDown Handlers
  private onKeyDown = (event: React.KeyboardEvent) => {
    let keyManager = new KeyManager(event);

    keyManager.on({
      "Enter": this.onEnter,
      "Backspace": this.onBackspace,
      "ArrowUp": this.onArrowUp,
      "ArrowDown": this.onArrowDown,
      "ArrowLeft": this.onArrowLeft,
      "ArrowRight": this.onArrowRight,
      "Delete": this.onDelete,
    });
  }

  private onEnter = (event: React.KeyboardEvent) => {
    event.preventDefault();
    this.context.createLine();
  }

  private onBackspace = (event: React.KeyboardEvent) => {
    const text = this.text;
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
  }

  private onArrowRight = (event: React.KeyboardEvent) => {
    if (Cursor.getPosition(this.element) === this.maxCursor) {
      event.preventDefault();
      this.context.selectNextLine(0);
    }
  }

  private onDelete = (event: React.KeyboardEvent) => {
    // todo: Handle onDelete()
    // const text = this.text;
    // const cursorPosition = Cursor.getPosition(this.element);
    //
    // const beforeCursor = text.substring(0, cursorPosition);
    // const afterCursor = text.substring(cursorPosition);
    //
    // if (beforeCursor === "") {
    //   if (afterCursor === "") {
    //     event.preventDefault();
    //     this.context.deleteLine(Infinity);
    //   }
    //
    //   this.setType("p");
    // }
  }


  // Methods
  /**
   * Export the component data to the Notebook
   */
  private export(): void {
    this.context.exportLine(this.props.position, TextLine.TYPE, {
      subType: this.state.subType,
      html: this.state.html,
    });
  }

  /**
   * Ensures that this TextLine is focussed
   */
  private ensureSelected(): void {
    this.props.selected ?
      this.element.focus() :
      this.element.blur();
  }


  // Lifecycle methods
  /**
   * Called if the component mounts
   */
  public componentDidMount(): void {
    this.selectionManager = new SelectionManager(this.element);
    this.ensureSelected();


    // Handle default data
    // ==================================================
    let {defaultData} = this.props;
    let html = defaultData?.html || this.state.html;
    let subType = defaultData?.subType || this.state.subType;

    this.element.innerHTML = html;

    if (defaultData?.selection) {
      console.log("Moved selection");
      this.selectionManager.setSelection(defaultData!.selection);
    }

    this.setState(() => ({html, subType}));
    // ==================================================


    this.export();
  }

  /**
   * Called if the components updates
   */
  public componentDidUpdate(prevProps: Props, prevState: State): void {
    this.ensureSelected();

    if (this.props.selected) {
      // Un-parse text
      if (prevProps.selected !== this.props.selected) {
        this.element.innerHTML = this.state.html;
      }

      // todo: Update selections
    }
    else {
      if (prevProps.selected !== this.props.selected) {
        // Parse text
        this.element.innerHTML = this.parseText();
      }
    }

    // Export if content updates
    // TODO: If prevState !== state
    if (prevState.html !== this.state.html) {
      this.export();
    }

    // Change in subType
    if (this.props.defaultData?.subType &&
        this.props.defaultData?.subType !== this.state.subType &&
        this.props.defaultData?.subType !== prevProps.defaultData?.subType)
    {
      this.setState(() => ({subType: this.props.defaultData?.subType!}));
    }
  }


  // Rendering
  public render(): ReactNode {
    // Renders the TextLine Component

    const selectedClass = this.props.selected ? "--selected" : "--not-selected";

    return <div
      className={selectedClass + "line text-line"}
      ref={this.ref}

      data-line-type={this.state.subType}

      onInput={this.onChange}
      onKeyDown={this.onKeyDown}
      onMouseUp={this.onMouseUp}

      onPaste={this.props.onPaste}

      spellCheck={false}
      contentEditable
    />;
  }
}


export default TextLine;