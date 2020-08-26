import React, {Component, ReactNode} from 'react';


/**
 * interface IProps
 * @author Ingo Andelhofs
 */
export interface IProps extends React.HTMLAttributes<any> {
  html: any,
  cursor: any,
  innerRef: React.Ref<HTMLDivElement>,
}



/**
 * class ContentEditable
 * @todo: Clean up and finalize
 * @author Ingo Andelhofs
 */
class ContentEditable extends Component<IProps, any> {
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
    const {html, cursor, innerRef, className, children, ...props} = this.props;

    return <div
      ref={innerRef}
      contentEditable={true}
      dangerouslySetInnerHTML={{__html: ContentEditable.serializeHTML(html)}}
      {...props}
    />;
  }
}


export default ContentEditable;