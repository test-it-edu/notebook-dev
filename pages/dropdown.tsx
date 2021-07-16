import React, {Component, ReactNode} from "react";
import Dropdown from "../components/Dropdown/Dropdown";


interface Props {}

interface State {}


/**
 * Dropdown Component
 * @author Ingo Andelhofs
 */
class DropdownPage extends Component<Props, State> {

  // Rendering
  private renderToggle = ({onToggle, style}: any) => {
    return <div
      style={style}
      onClick={onToggle}
      children="Toggle"
    />
  }

  private renderMenu= ({style}: any) => {
    return <div
      style={style}
      children="Menu"
    />
  }

  public render(): ReactNode {
    return <div>

      <h1>Lorem ipsum</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis culpa dignissimos dolore, eaque esse exercitationem expedita fuga illo ipsum minima nam provident quia quibusdam recusandae rem sunt tenetur vero voluptatibus?</p>

      <Dropdown
        renderToggle={this.renderToggle}
        renderMenu={this.renderMenu}
      />

      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias fugit libero modi non, perspiciatis repellat tempore unde. Blanditiis deleniti dignissimos dolorem iste iusto, labore, maxime quae repellendus, sit suscipit voluptatum.</p>

    </div>
  }
}

export default DropdownPage;