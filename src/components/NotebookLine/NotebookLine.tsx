import React, {Component, ReactNode} from 'react';
import {NotebookContext} from "../Notebook/NotebookContext";
import TextLine from "./TextLine";
import ImageLine from "./ImageLine";
import LinesLine from "./LinesLine";
import ClipboardManager from "../../utils/ClipboardManager";



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
  defaultType: string,
  defaultData: any,

  selected: boolean,
  position: number,
  first?: boolean,
  last?: boolean,
  cursor: number,
}



/**
 * interface IState
 * @author Ingo Andelhofs
 */
interface IState {
  type: string,
  data: any,
  props: any,

  dropdownActive: boolean,
}



/**
 * class NotebookLine
 * A line of the Notebook, this component handles switching to other Line types.
 * @author Ingo Andelhofs
 */
class NotebookLine extends Component<IProps, IState> {
  public static contextType = NotebookContext;
  public buttonRef = React.createRef<any>();

  public static defaultProps: IProps | any = {
    defaultType: "txt",
    defaultData: {
      subType: "p",
      html: "",
    },
  }
  public state: IState = {
    type: "txt",
    data: {
      subType: "p",
      html: "",
    },

    props: {},
    dropdownActive: false,
  }


  /**
   * Select this line in the Notebook
   * @TODO: Move selection to the node itself
   */
  private select = () => {
    this.context.selectLine(this.props.position);
  }


  /**
   * Set the LineType
   * @param type The LineType you want to set
   * @param props Extra properties you want to pass to the NotebookLine
   */
  private setType = (type: string, props: any = {}): void =>  {
    this.setState(() => ({ type, props }));
  }


  private onPaste = (event: React.ClipboardEvent): void => {
    ClipboardManager.retrieveImageAsBase64(event, (base64: any) => {
      if (base64) {
        this.setType("img", {
          defaultData: {
            url: base64,
          },
        });
      }
    });
  }


  /**
   * Called if the component mounts
   */
  public componentDidMount() {
    // console.log("NotebookLine mounted");

    // Initialize state with defaults
    this.setState(() => ({
      type: this.props.defaultType,
      data: this.props.defaultData,
    }));


    // Click outside to close dropdown
    document.addEventListener("click", (event: MouseEvent) => {
        const isDescendant = (parent: any, child: any) => {
        let node = child;
        while (node != null) {
          if (node === parent) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      }

      if (!isDescendant(this.buttonRef.current, event.target)) {
        this.setState(() => ({dropdownActive: false}));
      }
    });
  }


  /**
   * Called if the component is updated
   * @param prevProps The previous props
   * @param prevState The previous state
   */
  public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>) {
    // console.log("NotebookLine updated");
  }


  /**
   * Renders the correct line by it's LineType
   */
  private renderLine(): ReactNode {
    const Element = (StringRenderMap as any)[this.state.type];

    const { defaultData, ...rest } = this.props;
    const props = {
      ...rest,
      ...this.state.props,
      onLineTypeChange: this.setType,
      onPaste: this.onPaste,
    };

    return <Element {...props} />
  }


  private renderDropdown(): ReactNode {
    return <button
      ref={this.buttonRef}
      className={this.state.dropdownActive ? " --active" : ""}
      onClick={() => this.setState(() => ({ dropdownActive: !this.state.dropdownActive }))}
    >
      <i className="fas fa-ellipsis-v"/>
      <div className={`options-dropdown${this.state.dropdownActive ? " --active" : ""}`}>
        <ul>
          <li
            onClick={() => this.setType("txt", { defaultData: { subType: "p" } })}>
            <i className="fas fa-paragraph"/> Paragraph</li>
          <li
            onClick={() => this.setType("txt", { defaultData: { subType: "h1" } })}>
            <i className="fas fa-heading"/> Header 1</li>
          <li
            onClick={() => this.setType("txt", { defaultData: { subType: "h2" } })}>
            <i className="fas fa-heading"/> Header 2</li>
          <li
            onClick={() => this.setType("txt", { defaultData: { subType: "h3" } })}>
            <i className="fas fa-heading"/> Header 3</li>
        </ul>

        <ul>
          <li onClick={() => this.setType("img")}><i className="fas fa-image"/> Image</li>
          <li onClick={() => this.setType("line")}><i className="fas fa-grip-lines"/> Lines</li>
        </ul>
      </div>
    </button>;
  }


  /**
   * Render this component
   */
  public render(): ReactNode {
    const selectedClass = this.props.selected ? " --selected" : "";

    return <div className={"notebook-line" + selectedClass}>
      <div className="type-button">
        {this.renderDropdown()}
      </div>
      <div onClick={this.select} className="line-wrapper">
        {this.renderLine()}
      </div>
    </div>;
  }
}


export default NotebookLine;