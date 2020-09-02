import React, {useRef} from 'react';
import "./css/style.css";

import ContentEditable from "./components/ContentEditable/ContentEditable";
import SelectionManager from "./utils/SelectionManager";


function Playground () {
  let editableRef = useRef<any>();

  let html = `Hallo dit is een test <br><br><span>Inner Span <b>Inner bold</b></span>`;

  return <section>
    {/* If you enter out of the last list item, you will go out of the ul and create a new div */}
    <ContentEditable
      innerRef={editableRef}
      defaultHTML={html}
      className={"content-editable"}
      onKeyUp={() => {
        let selectionManager = new SelectionManager(editableRef.current!);
        let selectionData = selectionManager.findSelection();

        selectionManager.setSelection(selectionData);
      }}
      onClick={() => {
        console.log("Click");
      }}
      onSelect={() => {
        console.log("Select");
        let selectionManager = new SelectionManager(editableRef.current!);
        let selectionData = selectionManager.findSelection();

        selectionManager.setSelection(selectionData);
      }}
    />

    <button
      onClick={() => {
        let selectionManager = new SelectionManager(editableRef.current!);
        selectionManager.setSelection([22, 15]);
      }}
      children="activate"
    />
  </section>;
}

export default Playground;
