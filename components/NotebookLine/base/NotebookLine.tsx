import React, {Component, ReactNode} from 'react';
import ClipboardManager from "../../../utils/ClipboardManager";
import {NotebookContext} from "../../Notebook/NotebookContext";
import {config} from "../../../core/config/config";
import Dropdown from "../../Dropdown/Dropdown";


/**
 * Props Interface
 * @author Ingo Andelhofs
 */
interface Props extends React.HTMLAttributes<HTMLElement> {
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
  private setType = (type: string, props: any = {}): void => {
    this.setState(() => ({type, props}));
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
  }


  // Render methods
  /**
   * Renders the correct line by it's LineType
   */
  private renderLine(): ReactNode {
    const Element = config.elements[this.state.type];

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

    const data: { type: string, props: any, icon: string, text: string }[] = [
      {
        type: "txt",
        props: {defaultData: {subType: "p"}},
        icon: "fa-paragraph",
        text: "Paragraph",
      },
      {
        type: "txt",
        props: {defaultData: {subType: "h1"}},
        icon: "fa-heading",
        text: "Heading 1",
      },
      {
        type: "txt",
        props: {defaultData: {subType: "h2"}},
        icon: "fa-heading",
        text: "Heading 2",
      },
      {
        type: "txt",
        props: {defaultData: {subType: "h3"}},
        icon: "fa-heading",
        text: "Heading 3",
      },

      {
        type: "img",
        props: {},
        icon: "fa-image",
        text: "Image",
      },
      {
        type: "line",
        props: {},
        icon: "fa-grip-lines",
        text: "Lines",
      }
    ];

    const renderHandle = ({onToggle, style}) => {
      return <i
        className="fas fa-ellipsis-v"
        onClick={onToggle}
        style={style}
      />;
    }

    const renderMenu = ({onToggle, open, style}) => {
      return <div style={style} className={`options-dropdown${open ? " --active" : ""}`}>
        <ul style={{width: "max-content"}}>
          {data.map(({type, props, text, icon}: { type: string, props: any, icon: string, text: string }) => {
            const child = <><i className={`fas ${icon}`}/> {text}</>;
            const onClick = () => {
              this.setType(type, props);
              onToggle();
            }

            return <li key={text} onClick={onClick} children={child}/>;
          })}
        </ul>
      </div>
    }

    return <Dropdown
      className="button"
      renderToggle={renderHandle}
      renderMenu={renderMenu}
    />;
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