import React, {Component, ReactNode} from 'react';


/**
 * class Focusable
 * @author Ingo Andelhofs
 */
class Focusable extends Component<any, any> {
  public render(): ReactNode {
    return <div tabIndex={0} {...this.props}/>;
  }
}

export default Focusable;