import React, {Component, ReactNode} from 'react';
import NotebookLine from "../NotebookLine/NotebookLine";
import {NotebookProvider} from "./NotebookContext";



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any> {}



/**
 * interface IState
 * @author Ingo Andelhofs
 */
interface IState {
  notebookLines: any[],
  currentSelection: number,
  lineIdCounter: number,
  cursor: number,
}



/**
 * class Notebook
 * @author Ingo Andelhofs
 */
class Notebook extends Component<IProps, IState> {
  public state: IState = {
    notebookLines: [{id: 0}],
    lineIdCounter: 1,
    currentSelection: 0,
    cursor: 0,
  }


  public isLastElement = (position: number): boolean => {
    return position >= this.state.notebookLines.length - 1;
  }

  public isFirstElement = (position: number): boolean => {
    return position <= 0;
  }


  public insertNewLine = (): void => {
    const index = this.state.currentSelection;

    this.setState((prevState: IState) => {
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

    this.setState((prevState: IState) => {
      return {
        currentSelection: prevState.currentSelection + 1,
        cursor: cursor,
      };
    });
  }

  public selectPreviousLine = (cursor: number): void => {
    if (this.isFirstElement(this.state.currentSelection))
      return;

    this.setState((prevState: IState) => {
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

    this.setState((prevState: IState) => {
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


  public exportLine = (position: number, type: string, data: any) => {
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


  /**
   * Render the all the Lines
   */
  private renderNotebookLines(): ReactNode[] {
    const {cursor, currentSelection} = this.state;

    return this.state.notebookLines.map((element: any, index: number) => {
        return <NotebookLine
          key={element.id} // TODO: element is not unique

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

export default Notebook;