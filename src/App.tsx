import React, {useRef} from 'react';
import Notebook from "./components/Notebook/Notebook";
import "./css/style.css";


function App () {
  const notebookRef = useRef<any>();

  const onExportToConsole = () => {
    let exportData = notebookRef!.current!.export();
    console.log(JSON.stringify(exportData, null, 2));
  }

  return <section>
    <section className="notebook-option-bar">
      <button onClick={onExportToConsole}>Export to console</button>

    </section>


    <Notebook ref={notebookRef}/>
  </section>;
}

export default App;
