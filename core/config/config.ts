import TextLine from "../../components/NotebookLine/TextLine";
import ImageLine from "../../components/NotebookLine/ImageLine";
import LinesLine from "../../components/NotebookLine/LinesLine";

/**
 * Notebook Configuration
 * @author Ingo Andelhofs
 */

export const defaultLines = [
  {
    id: 0,
    data: {
      subType: "h1",
      html: "Hallo",
      selection: [1, 1],
    },
    type: "txt"
  }
];

export const notebookConfig = {
  defaultID: 1,
  defaultLines: defaultLines,
};


export const config = {
  version: "0.0.0",
  elements: {
    txt: TextLine,
    img: ImageLine,
    line: LinesLine,
  }
};