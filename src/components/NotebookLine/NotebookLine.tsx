import React, {Component, ReactNode} from 'react';
import {NotebookContext} from "../Notebook/NotebookContext";
import TextLine from "./TextLine";
import ImageLine from "./ImageLine";
import LinesLine from "./LinesLine";



/**
 * map StringRenderMap
 * @author Ingo Andelhofs
 */
export const StringRenderMap = {
  "txt": TextLine,
  "img": ImageLine,
  "line": LinesLine,
};



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any>  {
  data?: any,

  selected: boolean,

  position: number,
  first?: boolean,
  last?: boolean,

  cursorOptions: number,
}



/**
 * interface IState
 * @author Ingo Andelhofs
 */
interface IState {
  type: string,
  data?: any,
}



/**
 * class NotebookLine
 * A line of the Notebook, this component handles switching to other Line types.
 * @author Ingo Andelhofs
 */
class NotebookLine extends Component<IProps, IState> {
  public static contextType = NotebookContext;
  public state: IState = {
    type: "txt",
  }


  /**
   * Selects this line as the currently selected line
   * @TODO: Move selection to the node itself
   */
  private select = () => {
    this.context.selectLine(this.props.position);
  }


  /**
   * Updates the LineType of the current line
   * @param type The LineType you want to change to
   */
  private changeType = (type: string) =>  {
    this.setState({ type });
  }


  public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>) {
    console.log("NotebookLine updated");
  }

  public componentDidMount() {
    console.log("NotebookLine mounted");
  }


  /**
   * Renders the correct line by it's LineType
   */
  private renderLine(): ReactNode {
    const Element = (StringRenderMap as any)[this.state.type];
    return <Element {...this.props} onChangeType={this.changeType} />
  }


  /**
   * Render this component
   */
  public render(): ReactNode {
    return <div
      className={"line-wrapper notebook__line"}
      onClick={this.select}
      children={this.renderLine()}
    />;
  }
}


export default NotebookLine;