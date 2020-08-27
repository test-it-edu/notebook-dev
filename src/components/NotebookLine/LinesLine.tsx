import React, {Component, ReactNode} from 'react';



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<HTMLElement> {
  type: "lines" | "grid",
  amount: number,
}



/**
 * interface IState
 * @author Ingo Andelhofs
 */
interface IState {
  type: "lines" | "grid" | string,
  amount: number,
}



/**
 * class LinesLine
 * @author Ingo Andelhofs
 */
class LinesLine extends Component<IProps, IState> {
  private ref = React.createRef<HTMLDivElement>();

  public state: IState = {
    type: "lines",
    amount: 2,
  }

  public static defaultProps = {
    type: "lines",
    amount: 2,
  }


  public renderLines(): ReactNode {
    let rows = [];

    for (let i = 0; i < this.state.amount; ++i) {
      rows.push(<tr key={i}><td/></tr>);
    }

    return <table className={"lines"}>
      <tbody>
        {rows}
      </tbody>
    </table>
  }

  public componentDidMount() {
    this.setState({
      type: this.props.type,
      amount: this.props.amount,
    });
  }

  public render(): ReactNode {
    return <div
      ref={this.ref}
      tabIndex={0}
    >
      {this.renderLines()}
    </div>;
  }
}


export default LinesLine;