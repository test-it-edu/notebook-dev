import React, {Component, CSSProperties, HTMLAttributes, ReactNode} from "react";

type DropdownRenderOptions = {
  onToggle: () => void;
  style: CSSProperties;
  open: boolean;
};

type DropdownRenderCallback = (options: DropdownRenderOptions) => ReactNode;


interface Props extends HTMLAttributes<HTMLDivElement> {
  renderToggle: DropdownRenderCallback;
  renderMenu: DropdownRenderCallback;
}

interface State {
  open: boolean;
}


/**
 * Dropdown Component
 * @author Ingo Andelhofs
 */
class Dropdown extends Component<Props, State> {

  // State
  public state: State = {
    open: false,
  };

  // Helpers
  private getOptions(absolute: boolean = false): DropdownRenderOptions  {
    return {
      onToggle: this.onToggle,
      open: this.state.open,
      style: {
        zIndex: 10,
        position: absolute ? "absolute" : "relative",
      },
    };
  }

  // Listeners
  private onToggle = () => {
    this.setState((s: State) => {
      return {open: !s.open};
    });
  }

  // Close dropdown other way
  // private onDropdownClose = (event: MouseEvent) => {
  //   const isDescendant = (parent: any, child: any) => {
  //     let node = child;
  //     while (node != null) {
  //       if (node === parent) {
  //         return true;
  //       }
  //       node = node.parentNode;
  //     }
  //     return false;
  //   }
  //
  //   if (!isDescendant(this.buttonRef.current, event.target)) {
  //     this.setState(() => ({dropdownActive: false}));
  //   }
  // }

  // Rendering
  private renderOverlay(): ReactNode {
    return <div
      style={{
        // background: "rgba(1, 1, 1, 0.0)"
        position: "fixed",
        inset: 0,
      }}
      onClick={this.onToggle}
    />;
  }

  private renderChildren(): ReactNode {
    return <>
      {this.props.renderToggle(this.getOptions())}
      {this.state.open && this.props.renderMenu(this.getOptions(true))}
      {this.state.open && this.renderOverlay()}
    </>;
  }

  public render(): ReactNode {
    const {renderToggle, renderMenu, style, ...rest} = this.props;

    return <div
      children={this.renderChildren()}
      style={{position: "relative", ...style}}
      {...rest}
    />;
  }
}

export default Dropdown;