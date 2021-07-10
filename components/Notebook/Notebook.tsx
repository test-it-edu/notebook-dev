import React, {Component, ReactNode} from 'react';
import {NotebookContextValue, NotebookProvider} from "./NotebookContext";
import KeyManager from "../../utils/KeyManager";
import {notebookConfig} from "../../core/config/config";
import NotebookLine from "../NotebookLine/base/NotebookLine";



/**
 * Props Interface
 * @author Ingo Andelhofs
 */
interface Props {}


/**
 * State Interface
 * @author Ingo Andelhofs
 */
interface State {
  notebookLines: any[];
  currentSelection: number;
  lineIdCounter: number;

  cursor: number;
  selection: [number, number];
}



/**
 * Notebook Component
 * @author Ingo Andelhofs
 */
class Notebook extends Component<Props, State> {

  // State
  public state: State = {
    notebookLines: notebookConfig.defaultLines,
    lineIdCounter: notebookConfig.defaultID,
    currentSelection: 0,

    cursor: 0,
    selection: [0, 0],
  }


  // Boolean Methods
  public isLastElement = (position: number): boolean => {
    return position >= this.state.notebookLines.length - 1;
  }

  public isFirstElement = (position: number): boolean => {
    return position <= 0;
  }


  // NotebookProvider Methods
  private defaultKeyDown = (event: React.KeyboardEvent) => {
    const keyManager = new KeyManager(event);

    keyManager.on({
      "ArrowUp": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.selectPreviousLine(Infinity)
      },
      "ArrowDown": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.selectNextLine(Infinity)
      },
      "ArrowLeft": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.selectPreviousLine(Infinity)
      },
      "ArrowRight": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.selectNextLine(0)
      },

      "Enter": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.insertNewLine();
      },
      "Backspace": (event: React.KeyboardEvent) => {
        event.preventDefault();
        this.deleteLine(Infinity);
      },
    });
  }

  public insertNewLine = (): void => {
    const index = this.state.currentSelection;

    this.setState((prevState: State) => {
      const lines = [
        ...prevState.notebookLines.slice(0, index + 1),
        {id: prevState.lineIdCounter},
        ...prevState.notebookLines.slice(index + 1)
      ];

      return {
        notebookLines: lines,
        currentSelection: prevState.currentSelection + 1,
        lineIdCounter: prevState.lineIdCounter + 1,
      }
    });
  }

  public selectNextLine = (cursor: number): void => {
    if (this.isLastElement(this.state.currentSelection))
      return;

    this.setState((prevState: State) => {
      return {
        currentSelection: prevState.currentSelection + 1,
        cursor: cursor,
      };
    });
  }

  public selectPreviousLine = (cursor: number): void => {
    if (this.isFirstElement(this.state.currentSelection))
      return;

    this.setState((prevState: State) => ({
      currentSelection: prevState.currentSelection - 1,
      cursor: cursor,
    }));
  }

  public selectLine = (position: number): void => {
    this.setState(() => {
      return {
        currentSelection: position,
      };
    })
  }

  public deleteLine = (cursor: number = Infinity): void => {
    if (this.isFirstElement(this.state.currentSelection))
      return;

    this.setState((prevState: State) => {
      const lines = prevState.notebookLines.filter((element, index: number) => {
        return index !== prevState.currentSelection;
      });

      const indexDiff = prevState.currentSelection === 0 ? 0 : -1;

      return {
        notebookLines: lines,
        currentSelection: prevState.currentSelection + indexDiff,
        cursor: cursor,
      }
    });
  }


  // Exporting
  public exportLine = (position: number, type: string, data: any): void => {
    let updatedLines = this.state.notebookLines.map((element: any, index: number) => {
      if (index === position) {
        return {
          ...element,
          type,
          data,
        }
      }
      return element;
    });

    this.setState(() => ({
      notebookLines: updatedLines,
    }));
  }

  public export(): any {
    return this.state.notebookLines;
  }


  // Loading
  public load(lines: any[]): void {
    let currentId = this.state.lineIdCounter;

    lines = lines.map((element: any) => {
      element.id = currentId++;
      return element;
    });

    this.setState(() => ({
      notebookLines: lines,
      lineIdCounter: currentId,
    }));
  }


  // Other Methods
  private initContext(): NotebookContextValue {

    return {
      selectLine: this.selectLine,
      selectNextLine: this.selectNextLine,
      selectPrevLine: this.selectPreviousLine,
      createLine: this.insertNewLine,
      deleteLine: this.deleteLine,
      exportLine: this.exportLine,

      defaultKeyDown: this.defaultKeyDown,
    };
  }


  // Rendering
  private renderNotebookLines(): ReactNode[] {
    // Render all the lines in of the Notebook

    const {cursor, currentSelection} = this.state;

    return this.state.notebookLines.map((element: any, index: number) => {
        return <NotebookLine
          key={element.id}

          defaultData={element.data || null}
          defaultType={element.type || "txt"}

          selected={currentSelection === index}
          position={index}
          first={this.isFirstElement(index)}
          last={this.isLastElement(index)}

          cursor={cursor}
        />
      });
  }

  public render(): ReactNode {
    // Render the notebook lines inside of a provider.

    return <div className="notebook">
      <NotebookProvider
        value={this.initContext()}
        children={this.renderNotebookLines()}
      />
    </div>
  }
}


// export type NotebookProps = Props;
export default Notebook;
