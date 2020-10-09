# Notebook | TestIt Edu
Ingo Andelhofs  
Student at Hasselt University

## Implemented
- [ ] Actions
    - [ ] Import
    - [ ] Export
    - [ ] Copy / Paste
    
    
- [ ] Textual Line
    - [x] Paragraph
    - [x] Headings
    - [ ] Textual decoration
        - [ ] Bold, Italic, Marked, ...
        - [ ] Math
    
-[ ] List Line
    -[ ] Ordered list
    -[ ] Unordered list
    -[ ] Change list type (1. -> a.)

- [ ] Image Line
    - [ ] Drag and Drop Image
    - [ ] Paste Image
    - [ ] Upload Image
    - [ ] Options
        - [ ] Sizing
        - [ ] Alignment
        - [ ] Border

- [ ] Grid Line
    - [ ] Lines
    - [ ] Grid
    - [ ] Options 
        - [ ] Size / Spacing

- [ ] Table Line



## Suggested Features
- Block Limitations
- Tooltip (line type options)
- Moving Lines (up/down)
- Extra Line wrapper actions



## Structure
- Notebook
    - NotebookLine
        - TextLine
        - ImageLine
        - ...

### Notebook - NotebookLine (communication)
- position
- first
- last
- optional
    - setCaretOptions
    - resetCaretOptions
    - caretOptions
- shared 
    - createLine
    - removeLine
    - selectLine
    - moveToNextLine
    - moveToPreviousLine
    - updateData
    - selected
   
### NotebookLine - *Line (communication)
- shared actions (Notebook - NotebookLine)
- changeLineType
- ...






