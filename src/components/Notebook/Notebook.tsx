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
  caretOptions: any,
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

    // Caret Options
    caretOptions: null,
  }

  public isLastElement = (position: number) => {
    return position >= this.state.notebookLines.length - 1;
  }

  public isFirstElement = (position: number) => {
    return position <= 0;
  }

  public insertNewLine = () => {
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

  public selectNextLine = (options: any) => {
    if (this.isLastElement(this.state.currentSelection))
      return;

    this.setState((prevState: IState) => {
      return {
        currentSelection: prevState.currentSelection + 1,
        caretOptions: options,
      };
    });
  }

  public selectPreviousLine = (options: any) => {
    if (this.isFirstElement(this.state.currentSelection))
      return;

    this.setState((prevState: IState) => {
      return {
        currentSelection: prevState.currentSelection - 1,
        caretOptions: options,
      };
    });
  }

  public selectLine = (position: number) => {
    this.setState(() => {
      return {
        currentSelection: position,
      };
    })
  }

  public deleteLine = (options: any) => {
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
        caretOptions: options,
      }
    });
  }

  public resetCaretOptions = () => {
    this.setState(() => {
      return {
        caretOptions: {end: false}
      };
    })
  }


  private renderNotebookLines(): ReactNode[] {
    const {caretOptions, currentSelection} = this.state;

    return this.state.notebookLines.map((element: any, index: number) => {
        return <NotebookLine
          key={element.id} // TODO: element is not unique

          selected={currentSelection === index}
          position={index}
          first={this.isFirstElement(index)}
          last={this.isLastElement(index)}

          caretOptions={caretOptions ?? {end: false}}
        />
      });
  }

  public render(): ReactNode {
    return <div className={"notebook"}>
      <NotebookProvider
        value={{
          selectLine: this.selectLine,
          selectNextLine: this.selectNextLine,
          selectPrevLine: this.selectPreviousLine,
          createLine: this.insertNewLine,
          deleteLine: this.deleteLine,
          resetCaretOptions: this.resetCaretOptions,
        }}
        children={this.renderNotebookLines()}
      />
    </div>
  }
}

export default Notebook;