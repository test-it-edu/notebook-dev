import React, {Component, ReactNode} from 'react';
import NotebookLine from "../NotebookLine/NotebookLine";
import {NotebookProvider} from "./NotebookContext";



/**
 * interface Props
 * @author Ingo Andelhofs
 */
interface Props extends React.HTMLAttributes<HTMLElement> {}



/**
 * interface State
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
 * Data default Lines
 */
const defaultId = 1;
const defaultLines = [
  {
    id: 0,
    data: {
      subType: "h1",
      html: "Hallo",
      selection: [1, 1],
    },
    type: "txt"
  }
];



/**
 * Notebook Component
 * @author Ingo Andelhofs
 */
class Notebook extends Component<Props, State> {
  public state: State = {
    notebookLines: defaultLines,
    lineIdCounter: defaultId,
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

    this.setState((prevState: State) => {
      return {
        currentSelection: prevState.currentSelection - 1,
        cursor: cursor,
      };
    });
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


  // Export Methods
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


  // Load Method
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



  // Render Methods
  /**
   * Render the all the Lines
   */
  private renderNotebookLines(): ReactNode[] {
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

  /**
   * Render the component
   */
  public render(): ReactNode {
    return <div className={"notebook"}>
      <NotebookProvider
        value={{
          selectLine: this.selectLine,
          selectNextLine: this.selectNextLine,
          selectPrevLine: this.selectPreviousLine,
          createLine: this.insertNewLine,
          deleteLine: this.deleteLine,

          exportLine: this.exportLine,
        }}
        children={this.renderNotebookLines()}
      />
    </div>
  }
}


// export type NotebookProps = Props;
export default Notebook;
