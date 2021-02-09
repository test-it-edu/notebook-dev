import React, {createRef, Component} from 'react';
import notebookJSON from "./data/notebook.json";
import Notebook from "./components/Notebook/Notebook";
import "./css/style.css";


/**
 * App Component
 * Entry point of the application
 * @author Ingo Andelhofs
 */
class App extends Component<{}, {}> {

  // Members
  private notebookRef = createRef<Notebook>();


  // Listeners
  private onExportToConsole = () => {
    const notebookElement = this.notebookRef.current!;
    const exportData = notebookElement.export();
    const dataAsString = JSON.stringify(exportData, null, 2);

    console.log(dataAsString);
  }

  private onLoadNotebook = () => {
    const notebookElement = this.notebookRef.current!;
    notebookElement.load(notebookJSON);
  }


  // Rendering
  public render() {

    return <section>
      <section className="notebook-option-bar">
        <button onClick={this.onExportToConsole}>Export to console</button>
        <button onClick={this.onLoadNotebook}>Load notebook.json</button>
      </section>

      <Notebook ref={this.notebookRef}/>
    </section>;
  }
}

export default App;
