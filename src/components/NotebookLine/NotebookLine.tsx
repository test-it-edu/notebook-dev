import React, {Component, ReactNode} from 'react';
import ClipboardManager from "../../utils/ClipboardManager";
import ImageLine from "./ImageLine";
import LinesLine from "./LinesLine";
import TextLine from "./TextLine";
import {NotebookContext} from "../Notebook/NotebookContext";



/**
 * String Render Map
 * @author Ingo Andelhofs
 */
export const StringRenderMap = {
  "txt": TextLine,
  "img": ImageLine,
  "line": LinesLine,
};


/**
 * Props Interface
 * @author Ingo Andelhofs
 */
interface Props extends React.HTMLAttributes<HTMLElement>  {
  defaultType: string;
  defaultData: any;

  selected: boolean;
  position: number;
  first?: boolean;
  last?: boolean;
  cursor: number;
}


/**
 * State Interface
 * @author Ingo Andelhofs
 */
interface State {
  type: string;
  data: any;
  props: any;

  dropdownActive: boolean;
}



/**
 * NotebookLine Component
 * A line of the Notebook, this component handles switching to other Line types.
 *
 * @author Ingo Andelhofs
 */
class NotebookLine extends Component<Props, State> {

  // Properties
  public buttonRef = React.createRef<any>();
  public state: State = {
    type: "txt",
    data: {
      subType: "p",
      html: "",
    },

    props: {},
    dropdownActive: false,
  }

  // Static properties
  public static contextType = NotebookContext;
  public static defaultProps: Props | any = {
    defaultType: "txt",
    defaultData: {
      subType: "p",
      html: "",
    },
  }


  // State modification methods
  /**
   * Set the LineType
   * @param type The LineType you want to set
   * @param props Extra properties you want to pass to the NotebookLine
   */
  private setType = (type: string, props: any = {}): void =>  {
    this.setState(() => ({ type, props }));
  }


  // Event Handlers
  /**
   * Handles the paste event
   * @param event The clipboard event
   * @todo: Handle other paste types
   */
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

  private onDropdownClose = (event: MouseEvent) => {
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
  }



  // Lifecycle methods
  /**
   * Called if the component mounts
   * @todo: Make sure type is not null
   */
  public componentDidMount() {
    // Initialize state with defaults
    this.setState(() => ({
      type: this.props.defaultType || "txt",
      data: this.props.defaultData,
    }));


    // Click outside to close dropdown
    document.addEventListener("click", this.onDropdownClose);
  }

  /**
   * Called if the component unmounts
   */
  public componentWillUnmount() {
    document.removeEventListener("click", this.onDropdownClose);
  }

  /**
   * Called if the component is updated
   * @param prevProps The previous props
   * @param prevState The previous state
   */
  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {}


  // Render methods
  /**
   * Renders the correct line by it's LineType
   */
  private renderLine(): ReactNode {
    const Element = (StringRenderMap as any)[this.state.type];

    // TODO: Check order of props (this.state.props overrides this.props!!!)
    // TODO: IMPORTANT
    const props = {
      ...this.props,
      ...this.state.props,
      onLineTypeChange: this.setType,
      onPaste: this.onPaste,
    };

    return <Element {...props} />
  }

  /**
   * Render the dropdown menu and line button
   */
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
      <div className="line-wrapper">
        {this.renderLine()}
      </div>
    </div>;
  }
}


export default NotebookLine;