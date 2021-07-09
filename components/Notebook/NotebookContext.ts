import React, {Context} from "react";


export type NotebookContextValue = {
  selectLine: (position: number) => void;
  selectNextLine: (cursor: number) => void;
  selectPrevLine: (cursor: number) => void;
  createLine: () => void;
  deleteLine: (cursor: number) => void;
  exportLine: (position: number, type: string, data: any) => void;

  defaultKeyDown: (event: React.KeyboardEvent) => void;
};


/**
 * Notebook Context
 * @author Ingo Andelhofs
 */
export const NotebookContext = React.createContext<NotebookContextValue | {}>({});
export const NotebookProvider = NotebookContext.Provider;

export type NotebookContextType = Context<NotebookContextValue | {}>;