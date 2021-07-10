import React, {Component} from 'react';
import notebookJSON from "../data/notebook.json";
import Notebook from "./Notebook/Notebook";
import RefManager from "../utils/Ref/RefManager";


/**
 * App Component
 * Entry point of the application
 * @author Ingo Andelhofs
 */
class App extends Component<never, never> {

  // Members
  private notebook = new RefManager<Notebook>();


  // Listeners
  private onExportToConsole = () => {
    const notebookElement = this.notebook.get();
    const exportData = notebookElement.export();
    const dataAsString = JSON.stringify(exportData, null, 2);

    console.log(dataAsString);
  }

  private onLoadNotebook = () => {
    const notebookElement = this.notebook.get();
    notebookElement.load(notebookJSON);
  }


  // Rendering
  public render() {

    return <section>
      <section className="notebook-option-bar">
        <button onClick={this.onExportToConsole}>Export to console</button>
        <button onClick={this.onLoadNotebook}>Load notebook.json</button>
      </section>

      <Notebook
        ref={this.notebook.createRef}
      />
    </section>;
  }
}

export default App;
