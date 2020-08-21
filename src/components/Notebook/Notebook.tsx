import React, {Component, ReactNode} from 'react';
import NotebookLine from "../NotebookLine/NotebookLine";


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

  public deleteLine = (position: number, options: any) => {
    if (this.isFirstElement(position))
      return;

    this.setState((prevState: IState) => {
      const lines = prevState.notebookLines.filter((element, index: number) => {
        return index !== position;
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


  public render(): ReactNode {
    const cOptions = this.state.caretOptions ?? {end: false};

    return <div className="notebook">
      {this.state.notebookLines.map((element: any, index: number) => {
        const selected = this.state.currentSelection === index;

        return <NotebookLine
          // TODO: element is not unique
          key={element.id}
          data={element}
          position={index}
          selected={selected}
          first={this.isFirstElement(index)}
          last={this.isLastElement(index)}
          caretOptions={cOptions}

          onAppendNewLine={this.insertNewLine}
          onNext={this.selectNextLine}
          onPrevious={this.selectPreviousLine}
          onDelete={this.deleteLine}
          onSelect={this.selectLine}
          onResetCaretOptions={this.resetCaretOptions}
        />
      })}
    </div>;
  }
}

export default Notebook;