import React, {Component, ReactNode} from 'react';


/**
 * interface IProps
 * @author Ingo Andelhofs
 */
export interface IProps extends React.HTMLAttributes<any> {
  html: any,
  cursorPosition: number,
  innerRef: React.Ref<HTMLDivElement>,
}


/**
 * interface IState
 * @author Ingo Andelhofs
 */
export interface IState extends React.HTMLAttributes<any> {
  html: any,
  cursorPosition: number,
}



/**
 * class ContentEditable
 * @todo: Clean up and finalize
 * @author Ingo Andelhofs
 */
class ContentEditable extends Component<IProps, IState> {
  public state: IState = {
    html: "",
    cursorPosition: 0,
  }


  /**
   * Serialize the given HTML
   * @param html The HTML you want to serialize
   */
  private static serializeHTML(html: any) {
    // TODO: Serialize
    return html;
  }


  /**
   * Called when the component mounts
   */
  public componentDidMount() {
    // Initialize state
    this.setState({
      html: this.props.html,
      cursorPosition: this.props.cursorPosition,
    });
  }


  /**
   * Called when the component state updates
   * @param prevProps The previous properties
   * @param prevState The previous state
   */
  public componentDidUpdate(prevProps: any, prevState: any) {
    // ...
  }


  /**
   * Render the component
   */
  public render(): ReactNode {
    const {html, cursorPosition, innerRef, className, children, ...props} = this.props;

    return <div
      ref={innerRef}
      contentEditable={true}
      dangerouslySetInnerHTML={{__html: ContentEditable.serializeHTML(html)}}
      {...props}
    />;
  }
}


export default ContentEditable;