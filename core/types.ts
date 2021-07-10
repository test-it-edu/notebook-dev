

export type Line = {
  id: string;
  type: string;
  data: any;
};

export type NotebookData = {
  time: number;
  lines: Line[];
  version: string;
};

