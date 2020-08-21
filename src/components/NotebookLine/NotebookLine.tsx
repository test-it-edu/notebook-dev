import React, {Component, ReactNode} from 'react';


/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any> {
  // NotebookLine data
  data: any,

  // Notebook info
  selected: boolean,
  position: number,
  first: boolean,
  last: boolean,
  caretOptions: any,

  // Actions
  onSelect: any,
  onNext: any,
  onPrevious: any,
  onDelete: any,
  onAppendNewLine: any,
  onResetCaretOptions: any,
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
  type?: string,
}



/**
 * class NotebookLine
 * @author Ingo Andelhofs
 */
class NotebookLine extends Component<IProps, IState> {
  private ref = React.createRef<HTMLDivElement>();
  public state: IState = {
    text: "",
    content: "",
    length: 0,
    caretPosition: 0,
    type: "",
  }

  private getCaretPosition = (element: any): number => {
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

  private setCaretPosition = (element: any, offset: number): void => {
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

  private onCaretChange = () => {
    const caretPosition = this.getCaretPosition(this.ref.current);
    this.setState(prevState => {
      return {
        caretPosition,
      }
    });
  }

  private onChange = () => {
    const element = this.ref.current!;

    this.setState(() => {
      return {
        text: element!.textContent,
        content: element!.innerHTML,
        length: element!.textContent!.length,
      }
    });
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
    this.props.onAppendNewLine();
  }

  private onBackspace = (event: React.KeyboardEvent) => {
    if (this.getCaretPosition(this.ref.current) === 0) {
      const {position, onDelete} = this.props;
      event.preventDefault();
      onDelete(position, {end: true});
    }
  }

  private onUpArrow = () => {
    this.props.onPrevious({});
  }

  private onDownArrow = () => {
    this.props.onNext({});
  }

  private onLeftArrow = (event: React.KeyboardEvent) => {
    if (this.getCaretPosition(this.ref.current) === 0) {
      event.preventDefault();
      this.props.onPrevious({end: true});
    }
  }

  private onRightArrow = (event: React.KeyboardEvent) => {
    if (this.getCaretPosition(this.ref.current) === this.state.text.length) {
      event.preventDefault();
      this.props.onNext({end: false});
    }
  }


  private ensureSelected() {
    if (this.props.selected)
      this.ref.current!.focus();
  }

  private ensureCaretOptions() {
    if (this.props.selected) {
      if (this.props.caretOptions.end) {
        console.log("Caret move: ", this.state.length);

        this.setCaretPosition(this.ref.current, this.state.length);
        this.props.onResetCaretOptions();
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
    const {selected, onSelect, position} = this.props;
    const selectedColor = selected ? "#fafafa" : "#f1f1f1";

    return <div
      className={"notebook--line"}
      ref={this.ref}
      onInput={this.onChange}
      onKeyDown={this.onKeyDown}
      onKeyUp={this.onKeyUp}
      onMouseUp={this.onCaretChange}
      onClick={() => onSelect(position)}
      contentEditable
      style={{backgroundColor: selectedColor}}
    />;
  }
}


export default NotebookLine;