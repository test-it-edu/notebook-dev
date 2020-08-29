import React, {Component, ReactNode} from 'react';
import {NotebookContext} from "../Notebook/NotebookContext";
import KeyManager from "../../utils/KeyManager";
import Focusable from "../Focusable/Focusable";



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any>  {
  defaultData?: {
    url: string,
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
export interface IState {}



/**
 * class ImageLine
 * @author Ingo Andelhofs
 */
class ImageLine extends Component<IProps, any> {
  public static contextType = NotebookContext;
  public ref = React.createRef<HTMLDivElement>();


  // Getters
  private get element(): HTMLDivElement {
    return this.ref.current!;
  }


  // KeyDown handlers
  private onKeyDown = (event: React.KeyboardEvent) => {
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
   * Render the Image container with Action buttons
   */
  private renderImageContainer() {
    let url = this.props?.defaultData?.url || "https://via.placeholder.com/400x200";

    return <div>
      <div className={"action-buttons"}>
        <button>Upload Image</button>
        <br/>
        <button>Align Left</button>
        <button>Align Middle</button>
        <button>Align Right</button>
      </div>

      <div className="image-wrapper" style={{textAlign: "center"}}>
        <img src={url} alt="Placeholder"  />
      </div>
    </div>;
  }


  /**
   * Render the component
   */
  public render(): ReactNode {
    const selectedClass = this.props.selected ? " --selected" : " --not-selected";

    return <Focusable
      innerRef={this.ref}
      focus={this.props.selected}

      className={"image-line" + selectedClass}
      children={this.renderImageContainer()}

      onKeyDown={this.onKeyDown}
    />;
  }
}


export default ImageLine;