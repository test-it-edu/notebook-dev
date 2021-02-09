import React, {Component, ReactNode} from 'react';



/**
 * interface IProps
 * @author Ingo Andelhofs
 */
interface IProps extends React.HTMLAttributes<any> {
  innerRef: React.RefObject<HTMLDivElement>,
  focus: boolean,
}



/**
 * class Focusable
 * @author Ingo Andelhofs
 */
class Focusable extends Component<IProps, any> {
  // Properties
  public static defaultProps: IProps = {
    innerRef: React.createRef<HTMLDivElement>(),
    focus: false,
  }

  // Getters
  private get element(): HTMLDivElement {
    return this.props.innerRef.current!;
  }


  // Lifecycle methods
  /**
   * Ensures that the element is focussed
   */
  private ensureFocus(): void {
    this.props.focus ?
      this.element.focus() :
      this.element.blur();
  }

  /**
   * Called if the component mounts
   */
  public componentDidMount(): void {
    this.ensureFocus();
  }

  /**
   * Called if the component mounts
   * @param prevProps The previous props
   */
  public componentDidUpdate(prevProps: Readonly<IProps>): void {
    this.ensureFocus();
  }


  // Render methods
  /**
   * Render the component
   */
  public render(): ReactNode {
    const {focus, innerRef, ...props} = this.props;

    return <div
      ref={innerRef}
      tabIndex={0}
      {...props}
    />;
  }
}

export default Focusable;