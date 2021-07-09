import React, {Component, ReactNode} from 'react';
import Focusable from "../Focusable/Focusable";
import {NotebookContext, NotebookContextValue} from "../Notebook/NotebookContext";
import clsx from "clsx";
import {NotebookLineInstance} from "./base/NotebookLineInstance";


/**
 * Types
 * @author Ingo Andelhofs
 */
type ImageAlignment = "left" | "right" | "center";
type DefaultData = {
  url: string;
  alignment: ImageAlignment;
};


/**
 * Props Interface
 * @author Ingo Andelhofs
 */
interface Props extends React.HTMLAttributes<HTMLElement> {
  defaultData?: DefaultData;

  // Notebook
  selected: boolean;
  position: number;

  // NotebookLine
  onLineTypeChange: (type: string) => void;
  onPaste: (pasteData: any) => void;
}


/**
 * State Interface
 * @author Ingo Andelhofs
 */
export interface State {
  url: string;
  alignment: ImageAlignment;
}


/**
 * ImageLine Component
 *
 * @author Ingo Andelhofs
 * @todo: Image must be pasted on a new line otherwise the line content is lost
 */
class ImageLine extends Component<Props, State> implements NotebookLineInstance {

  // Refs
  public ref = React.createRef<HTMLDivElement>();
  public fileInputRef = React.createRef<HTMLInputElement>();

  // Context
  public static contextType = NotebookContext;
  public context: NotebookContextValue;

  // State
  public state: State = {
    url: "",
    alignment: "left"
  }

  // Props
  public static defaultProps: Partial<Props> = {};


  // Getters
  private get fileInputElement(): HTMLInputElement {
    return this.fileInputRef.current!;
  }


  // Event Handlers
  /**
   * Handles the Click event
   */
  private onClick = (): void => {
    this.onSelect();
  }

  /**
   * Handles the KeyDown event
   * @param event The keyboard event
   */
  private onKeyDown = (event: React.KeyboardEvent): void => {
    this.context.defaultKeyDown(event);
  }

  /**
   * Handles the Select event
   */
  private onSelect = (): void => {
    this.context.selectLine(this.props.position);
  }

  /**
   * Handles the Alignment event
   * @param alignTo The alignment you want to set
   */
  private onChangeAlignment = (alignTo: "left" | "right" | "center"): void => {
    this.setState(() => ({
      alignment: alignTo,
    }));
  }

  /**
   * Handles the FileChange event
   * @param event The FormEvent
   */
  private onFileChange = (event: React.FormEvent) => {
    event.persist();
    const target = event.target as HTMLInputElement;

    // TODO: Handle (no files, incorrect files, ...)

    const file = target.files![0] as any;
    file?.arrayBuffer().then((ab: any) => {
      const base64 = btoa(String.fromCharCode(...new Uint8Array(ab)));

      this.setState(() => ({
        url: "data:image/png;base64," + base64,
      }));
    });
  }


  // Methods
  /**
   * Export the data of this component to the Notebook
   */
  public export(): void {
    this.context.exportLine(this.props.position, "img", {
      url: this.state.url,
      alignment: this.state.alignment,
    });
  }


  // Lifecycle methods
  /**
   * Called if the component mounts
   */
  public componentDidMount(): void {
    // Handle default data
    // ==================================================
    let {defaultData} = this.props;
    let url = defaultData?.url || this.state.url;
    let alignment = defaultData?.alignment || this.state.alignment;

    this.setState(() => ({url, alignment}));
    // ==================================================

    this.export();
  }

  /**
   * Called if the component updates
   * @param prevProps The previous props
   * @param prevState The previous state
   */
  public componentDidUpdate(prevProps: Props, prevState: State): void {

    // TODO: Equal state
    // Prevent infinite state loop
    if (!prevProps.defaultData ||
      prevState.url !== this.state.url ||
      prevState.alignment !== this.state.alignment) {
      this.export();
    }
  }


  // Render methods
  /**
   * Render the Image container with Action buttons
   */
  private renderImageContainer(): ReactNode {
    let url = this.state.url || this.props?.defaultData?.url || "https://via.placeholder.com/400x200";

    return <div>
      <div className={"action-buttons"}>
        <button onClick={() => this.fileInputElement.click()}>Upload Image</button>
        <input onChange={this.onFileChange} ref={this.fileInputRef} type="file" style={{display: "none"}}/>

        <br/>
        <button onClick={() => this.onChangeAlignment("left")}>Align Left</button>
        <button onClick={() => this.onChangeAlignment("center")}>Align Middle</button>
        <button onClick={() => this.onChangeAlignment("right")}>Align Right</button>
      </div>

      <div className="image-wrapper" style={{textAlign: this.state.alignment}}>
        <img src={url} alt="Placeholder"/>
      </div>
    </div>;
  }

  /**
   * Render the component
   */
  public render(): ReactNode {
    const classNames = clsx({
      "image-line": true,
      "--selected": this.props.selected,
      "--not-selected": !this.props.selected
    });

    return <Focusable
      innerRef={this.ref}
      className={classNames}
      children={this.renderImageContainer()}

      focus={this.props.selected}

      onClick={this.onClick}
      onKeyDown={this.onKeyDown}
    />;
  }
}


export default ImageLine;