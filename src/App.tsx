import React, {useRef} from 'react';
import "./css/style.css";
import notebookJSON from "./data/notebook.json";

import Notebook from "./components/Notebook/Notebook";


function App () {
  const notebookRef = useRef<any>();

  const onExportToConsole = () => {
    let exportData = notebookRef!.current!.export();
    console.log(JSON.stringify(exportData, null, 2));
  }

  const onLoadNotebook = () => {
    notebookRef.current!.load(notebookJSON);
  }

  return <section>
    <section className="notebook-option-bar">
      <button onClick={onExportToConsole}>Export to console</button>
      <button onClick={onLoadNotebook}>Load notebook.json</button>
    </section>

    <Notebook ref={notebookRef}/>
  </section>;
}

export default App;
