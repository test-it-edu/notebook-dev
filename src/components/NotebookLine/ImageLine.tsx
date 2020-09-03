import React, {Component, ReactNode} from 'react';
import KeyManager from "../../utils/KeyManager";
import Focusable from "../Focusable/Focusable";
import {NotebookContext} from "../Notebook/NotebookContext";
import clsx from "clsx";



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any>  {
  defaultData?: {
    url: string,
    alignment: "left" | "right" | "center",
  },

  // Notebook
  selected: boolean,
  position: number,

  // NotebookLine
  onLineTypeChange: (type: string) => void,
  onPaste: (pasteData: any) => void,
}


/**
 * interface IState
 * @author Ingo Andelhofs
 */
export interface IState {
  url: string,
  alignment: "left" | "right" | "center",
}



/**
 * class ImageLine
 * @author Ingo Andelhofs
 *
 * @TODO: Image must be pasted on a new line otherwise the line content is lost
 */
class ImageLine extends Component<IProps, IState> {
  // Properties
  public ref = React.createRef<HTMLDivElement>();
  public fileInputRef = React.createRef<HTMLInputElement>();
  public state: IState = {
    url: "",
    alignment: "left"
  }

  // Static properties
  public static contextType = NotebookContext;
  public static defaultProps = {};

  // Getters
  private get element(): HTMLDivElement {
    return this.ref.current!;
  }
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
   * @param event
   */
  private onKeyDown = (event: React.KeyboardEvent): void => {
    let keyManager = new KeyManager(event);
    keyManager.on({
      "ArrowUp": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.context.selectPrevLine(Infinity)
      },
      "ArrowDown": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.context.selectNextLine(Infinity)
      },
      "ArrowLeft": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.context.selectPrevLine(Infinity)
      },
      "ArrowRight": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.context.selectNextLine(0)
      },

      "Enter": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.context.createLine();
      },
      "Backspace": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.context.deleteLine(Infinity)
      },
    });
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

    let file = target.files![0] as any;
    file?.arrayBuffer().then((ab: any) => {
      let base64 = btoa(String.fromCharCode(...new Uint8Array(ab)));

      this.setState(() => ({
        url: "data:image/png;base64," + base64,
      }));
    });
  }


  // Methods
  /**
   * Export the data of this component to the Notebook
   */
  private export(): void {
    this.context.exportLine(this.props.position, "image", {
      url: this.state.url,
      alignment: this.state.alignment,
    });
  }


  // Lifecycle methods
  /**
   * Called if the component mounts
   */
  public componentDidMount(): void {
    this.export();
  }

  /**
   * Called if the component updates
   * @param prevProps The previous props
   * @param prevState The previous state
   */
  public componentDidUpdate(prevProps: IProps, prevState: IState): void {

    // TODO: Equal state
    // Prevent infinite state loop
    if (prevState.url !== this.state.url) {
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
        <img src={url} alt="Placeholder"  />
      </div>
    </div>;
  }

  /**
   * Render the component
   */
  public render(): ReactNode {
    let classNames = clsx({
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