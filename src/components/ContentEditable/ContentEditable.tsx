import React, {Component, ReactNode} from 'react';


/**
 * Props Interface
 * @author Ingo Andelhofs
 */
interface Props extends React.HTMLAttributes<HTMLElement> {
  defaultHTML: string;
  defaultCursor: number;
  disableEditing: boolean;
  focus: boolean;
  innerRef: React.RefObject<HTMLDivElement>;
}


/**
 * State Interface
 * @author Ingo Andelhofs
 */
interface State {
  html: string;
  cursor: number;
  selection: {};
  length: number;
}



/**
 * ContentEditable Component
 * @todo: Clean up and finalize
 * @deprecated This component will not be used, because there are easier ways to get the same effect.
 * @author Ingo Andelhofs
 *
 * Example:
 * <ContentEditable
 *   className="content-editable"
 *   spellCheck={false}
 *   defaultHTML={"Hello"}
 *   defaultCursor={2} />
 */
class ContentEditable extends Component<Props, State> {

  // Properties
  public state: State = {
    html: "",
    cursor: 0,
    selection: {},
    length: 0,
  }

  // Static properties
  public static defaultProps: Props = {
    defaultHTML: "",
    defaultCursor: 0,
    disableEditing: false,
    focus: false,

    innerRef: React.createRef<HTMLDivElement>(),
  }

  // Getters
  private get element(): HTMLDivElement {
    return this.props.innerRef.current!;
  }


  // Methods
  /**
   * Serialize the given HTML
   * @param html The HTML you want to serialize
   */
  private static serializeHTML(html: any) {
    // TODO: Serialize
    return html;
  }

  /**
   * Ensures that the element is focussed
   */
  private ensureFocused() {
    this.props.focus ?
      this.element.focus() :
      this.element.blur();
  }


  // Event Handlers
  /**
   * The input change handler
   */
  private onInput = () => {
    // this.setState(() => ({
    //   html: this.element.innerHTML,
    //   cursor: Cursor.getPosition(this.element),
    // }));
  }

  /**
   * Moves the cursor to the position of the current state
   */
  private moveCursorToCurrentPosition = () => {
    // Cursor.setPosition(this.element, this.state.cursor);
  }


  // Lifecycle methods
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
  public componentDidUpdate(prevProps: Props, prevState: State) {
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


  // Render methods
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