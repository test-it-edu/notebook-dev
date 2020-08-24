import React, {Component, ReactNode} from 'react';
import {NotebookContext} from "../Notebook/NotebookContext";
import {StringRenderMap} from "./RenderMap";


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
  caretOptions: any,
}


/**
 * interface IState
 * @author Ingo Andelhofs
 */
interface IState {
  type: string,
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


  private select = () => {
    this.context.selectLine(this.props.position);
  }

  private changeType = (type: string) =>  {
    this.setState({ type });
  }


  private renderLine(): ReactNode {
    const Element = (StringRenderMap as any)[this.state.type];
    return <Element {...this.props} onChangeType={this.changeType} />
  }

  public render(): ReactNode {
    return <div
      className={"notebook__line"}
      onClick={this.select}
      children={this.renderLine()}
    />;
  }
}


export default NotebookLine;