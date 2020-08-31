import React, {Component, ReactNode} from 'react';
import Focusable from "../Focusable/Focusable";



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<HTMLElement> {
  defaultData: {
    subType: "lines" | "grid",
    amountOfLines: number,
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
interface IState {
  subType: "lines" | "grid",
  amountOfLines: number | string,
}



/**
 * class LinesLine
 * @author Ingo Andelhofs
 */
class LinesLine extends Component<IProps, IState> {
  private ref = React.createRef<HTMLDivElement>();
  public state: IState = {
    subType: "lines",
    amountOfLines: 3,
  }
  public static defaultProps = {
    defaultData: {
      subType: "lines",
      amountOfLines: 3,
    },
  }


  private onChangeAmountOfLines = (event: React.FormEvent) => {
    let value = (event.target as HTMLInputElement).value;
    let parsedValue = Number.parseInt(value);

    this.setState(() => ({
      amountOfLines: Number.isNaN(parsedValue) ? "" : parsedValue,
    }))
  }


  private onToggleSubType = () => {
    this.setState((prevState) => ({
      subType: prevState.subType === "lines" ? "grid" : "lines",
    }))
  }


  /**
   * Called if the component mounts
   */
  public componentDidMount() {
    this.setState(() => {
      const { subType, amountOfLines } = this.props.defaultData;
      return { subType, amountOfLines };
    });
  }


  /**
   * Render as grid
   */
  public renderGrid(): ReactNode {
    let rows = [];
    let cols = [];

    for (let i = 0; i < 30; ++i) {
      cols.push(<td key={i}/>);
    }

    for (let i = 0; i < this.state.amountOfLines; ++i) {
      rows.push(<tr key={i}>{cols}</tr>);
    }

    return <table className={"grid"}>
      <tbody>
      {rows}
      </tbody>
    </table>;
  }


  /**
   * Render as lines
   */
  public renderLines(): ReactNode {
    let rows = [];

    for (let i = 0; i < this.state.amountOfLines; ++i) {
      rows.push(<tr key={i}><td/></tr>);
    }

    return <table className={"lines"}>
      <tbody>
        {rows}
      </tbody>
    </table>;
  }


  /**
   * Render the container
   */
  private renderContainer(): ReactNode {
    return <div>
      <div className="action-buttons">
        <button
          onClick={this.onToggleSubType}
          children={this.state.subType === "lines" ? "Change to grid" : "Change to lines"}
        />
        &nbsp;
        &nbsp;

        <label>
          Amount of lines: <input
            type="number"
            value={this.state.amountOfLines.toString()}
            onChange={this.onChangeAmountOfLines}
          />
        </label>

      </div>
      <div
        className="grid-wrapper"
        children={this.state.subType === "lines" ? this.renderLines() : this.renderGrid()}
      />
    </div>
  }


  /**
   * Render the component
   */
  public render(): ReactNode {
    return <Focusable
      innerRef={this.ref}
      children={this.renderContainer()}
    />;
  }
}


export default LinesLine;