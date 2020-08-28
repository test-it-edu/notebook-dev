import React, {Component, ReactNode} from 'react';
import {NotebookContext} from "../Notebook/NotebookContext";



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any>  {
  data?: any,
  selected: boolean,
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


  private onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.context.selectNextLine(Infinity);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.context.selectPrevLine(Infinity);
    }


  }

  private ensureSelected() {
    if (!this.ref.current)
      return;

    this.props.selected ?
      this.ref.current.focus() :
      this.ref.current.blur();
  }

  public componentDidMount() {
    this.ensureSelected();
  }

  public componentDidUpdate() {
    this.ensureSelected();
  }


  /**
   * Render the Image container with Action buttons
   */
  private renderImageContainer() {
    return <div>
      <div className="action-buttons">
        <button>Upload Image</button>
        <br/>
        <button>Align Left</button>
        <button>Align Middle</button>
        <button>Align Right</button>
      </div>
      <div className="image-wrapper">
        <img src="https://via.placeholder.com/400x200" alt="Placeholder" />
      </div>
    </div>;
  }


  /**
   * Render the component
   */
  public render(): ReactNode {
    const selectedClass = this.props.selected ? " --selected" : " --not-selected";

    return <div
      tabIndex={0}
      ref={this.ref}
      className={"image-line" + selectedClass}
      children={this.renderImageContainer()}

      onKeyDown={this.onKeyDown}
    />;
  }
}


export default ImageLine;