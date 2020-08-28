import React, {Component, ReactNode} from 'react';
import Cursor from "../../utils/Cursor";



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any> {
  defaultHTML: string,
  defaultCursor: number,
  disableEditing: boolean,
  focus: boolean,

  innerRef: React.RefObject<HTMLDivElement>,
}



/**
 * interface IState
 * @author Ingo Andelhofs
 */
interface IState {
  html: string,
  cursor: number,
  selection: {},
  length: number,
}





/**
 * class ContentEditable
 * @todo: Clean up and finalize
 * @author Ingo Andelhofs
 *
 * Example:
 * <ContentEditable
 *   className="content-editable"
 *   spellCheck={false}
 *   defaultHTML={"Hello"}
 *   defaultCursor={2} />
 */
class ContentEditable extends Component<IProps, IState> {
  public static defaultProps: IProps = {
    defaultHTML: "",
    defaultCursor: 0,
    disableEditing: false,
    focus: false,

    innerRef: React.createRef<HTMLDivElement>(),
  }
  public state: IState = {
    html: "",
    cursor: 0,
    selection: {},
    length: 0,
  }


  /**
   * Get a reference to the div element
   */
  private get element(): HTMLDivElement {
    return this.props.innerRef.current!;
  }


  /**
   * Serialize the given HTML
   * @param html The HTML you want to serialize
   */
  private static serializeHTML(html: any) {
    // TODO: Serialize
    return html;
  }


  // Event listeners
  /**
   * The input change handler
   */
  private onInput = () => {
    // Update
    this.setState(() => ({
      html: this.element.innerHTML,
      cursor: Cursor.getPosition(this.element),
    }));
  }



  /**
   * Moves the cursor to the position of the current state
   */
  private moveCursorToCurrentPosition = () => {
    Cursor.setPosition(this.element, this.state.cursor);
  }


  private ensureFocused() {
    this.props.focus ?
      this.element.focus() :
      this.element.blur();
  }


  /**
   * Called when the component mounts
   */
  public componentDidMount() {
    this.ensureFocused();

    this.setState(() => ({
      html: this.props.defaultHTML,
      cursor: this.props.defaultCursor,
    }), () => {
      this.moveCursorToCurrentPosition();
    });
  }


  /**
   * Called when the component updates
   * @param prevProps The previous properties
   * @param prevState The previous state
   */
  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    this.ensureFocused();

    if (prevProps.defaultHTML !== this.props.defaultHTML) {
      this.setState(() => ({
        html: this.props.defaultHTML,
      }));
    }

    if (prevProps.defaultCursor !== this.props.defaultCursor) {
      this.setState(() => ({
        cursor: this.props.defaultCursor,
      }));
    }

    this.moveCursorToCurrentPosition();
  }


  /**
   * Render the component
   */
  public render(): ReactNode {
    const {focus, defaultHTML, defaultCursor, disableEditing, innerRef, ...props} = this.props;
    const {html} = this.state;

    return <div
      ref={innerRef}

      onInput={this.onInput}

      contentEditable={!disableEditing}
      dangerouslySetInnerHTML={{__html: ContentEditable.serializeHTML(html)}}
      {...props}
    />;
  }
}


export default ContentEditable;