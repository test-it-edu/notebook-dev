import {config} from "./config/config";
import {Line, NotebookData} from "./types";


/**
 * Notebook Manager
 * @author Ingo Andelhofs
 */
class NotebookManager {

  // Members
  private cursor: any;
  private lines: Line[];
  private idManager: any;
  private selection: any;

  // Constructor
  public constructor() {
    this.lines = [];
    this.idManager = undefined;
    this.cursor = undefined;
    this.selection = undefined;
  }


  // Public
  public load(data: NotebookData) {
    this.lines = data.lines;
  }

  public export(): NotebookData {
    return {
      time: Date.now(),
      lines: this.lines,
      version: config.version,
    };
  }



}

export default NotebookManager;