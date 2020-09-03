import React, {Component, ReactNode} from 'react';
import Focusable from "../Focusable/Focusable";
import KeyManager from "../../utils/KeyManager";
import {NotebookContext} from "../Notebook/NotebookContext";
import clsx from "clsx";



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
  // Properties
  private ref = React.createRef<HTMLDivElement>();
  public state: IState = {
    subType: "lines",
    amountOfLines: 3,
  }

  // Static properties
  public static contextType = NotebookContext;
  public static defaultProps = {
    defaultData: {
      subType: "lines",
      amountOfLines: 3,
    },
  }


  // Event handlers
  /**
   * Handles the click event
   */
  private onClick = (): void => {
    this.onSelect();
  }

  /**
   * Handles the selection of this element
   */
  private onSelect = (): void => {
    this.context.selectLine(this.props.position);
  }

  /**
   * Handles the KeyDown event
   * @param event The KeyboardEvent
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
   * Handles the change of amount of lines of this element
   * @param event The FormEvent of the input element
   */
  private onChangeAmountOfLines = (event: React.FormEvent): void => {
    let value = (event.target as HTMLInputElement).value;
    let parsedValue = Number.parseInt(value);

    this.setState(() => ({
      amountOfLines: Number.isNaN(parsedValue) ? "" : parsedValue,
    }))
  }

  /**
   * Handles the change of type form lines to grid or grid to lines
   */
  private onToggleSubType = (): void => {
    this.setState((prevState) => ({
      subType: prevState.subType === "lines" ? "grid" : "lines",
    }))
  }


  // Lifecycle methods
  /**
   * Called if the component mounts
   */
  public componentDidMount(): void {
    this.setState(() => {
      const { subType, amountOfLines } = this.props.defaultData;
      return { subType, amountOfLines };
    });
  }


  // Render methods
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
    let classNames = clsx({
      "lines-line": true,
      "--selected": this.props.selected,
      "--not-selected": !this.props.selected
    });

    return <Focusable
      innerRef={this.ref}
      className={classNames}
      children={this.renderContainer()}

      focus={this.props.selected}

      onClick={this.onClick}
      onKeyDown={this.onKeyDown}
    />;
  }
}


export default LinesLine;