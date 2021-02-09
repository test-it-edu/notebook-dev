import React, {Component, ReactNode} from 'react';


/**
 * Props Interface
 * @author Ingo Andelhofs
 */
interface Props extends React.HTMLAttributes<HTMLElement> {
  innerRef: React.RefObject<HTMLDivElement>;
  focus: boolean;
}


/**
 * State Interface
 * @author Ingo Andelhofs
 */
interface State {}



/**
 * Focusable Component
 * @author Ingo Andelhofs
 */
class Focusable extends Component<Props, State> {

  // Properties
  public static defaultProps: Props = {
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
  public componentDidUpdate(prevProps: Readonly<Props>): void {
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