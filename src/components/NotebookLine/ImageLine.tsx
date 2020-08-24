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
 * class ImageLine
 * @author Ingo Andelhofs
 */
class ImageLine extends Component<IProps, any> {
  public static contextType = NotebookContext;
  public ref = React.createRef<HTMLDivElement>();


  private onKeyDown = (e: any) => {
    console.log(e.key);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.context.selectNextLine({});
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.context.selectPrevLine({});
    }


  }

  private ensureSelected() {
    //TODO: UnFocus when not selected (image can not be focussed
    if (this.props.selected && this.ref.current)
      this.ref.current.focus();
  }

  public componentDidMount() {
    this.ensureSelected();
  }

  public componentDidUpdate() {
    this.ensureSelected();
  }


  public render(): ReactNode {
    const selectedClass = this.props.selected ? " --selected" : " --not-selected";

    return <div
      className={"image-line" + selectedClass}
      ref={this.ref}
      onKeyDown={this.onKeyDown}
      tabIndex={0}>
      <img src="https://via.placeholder.com/400x200" alt="Placeholder" />
    </div>;
  }
}


export default ImageLine;