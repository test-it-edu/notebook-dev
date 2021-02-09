# Notebook | TestIt Edu
Ingo Andelhofs  
Student at Hasselt University


## About
Notebook is a simple Markdown and LaTeX Math editor build in React. The goal of this project is to create a modular / extensible editor for the web. Notebook also supports a user-friendly interface so that beginners or non-technical users can use this editor with ease, while advanced users can type really fast. 


# Features
## Notebook features
- [ ] Export (Notebook)
- [ ] Import (Notebook)
    - [ ] Using a property
    - [ ] Using a method

- [ ] Actions
    - [ ] Undo
    - [ ] Redo
    - [ ] Copy
    - [ ] Paste

- [ ] Restrictions
    - [ ] Allow specific line types only


## Notebookline features
### Textual lines
- [ ] Actions
    - [x] Copy (one line)
    - [ ] Paste (one line)

- [ ] Cursor Behaviour
    - [ ] Keys
        - [ ] `Arrow right` at end of line: moves cursor to position 0 in next container
        - [ ] `Arrow left` at beginning of line: moves cursor to position Infinity in next container
        - [ ] `Arrow down` at position of line: moves cursor to the same position in the next container
        - [ ] `Arrow up` at position of line: moves cursor to the same position in the previous container

        - [ ] `Delete` at end of line: moves the previous line upward or deletes the content of a non-text component
        - [ ] `Backspace` at front of (empty) line: removes the current line
        - [ ] `Backspace` at front of (non-empty) line: moves content (text) to the upward component or deletes the upward non-text component 
              (both remove the current line)

        - [ ] `Enter` in middle or front of line: splits line into two parts
        - [ ] `Enter` at end of line: 

    - [ ] Selection
        - [ ] Select (one line)
        - [ ] Set cursor correctly
    
- [ ] Textual Line
    - [x] Paragraph
    - [x] Headings
        - [x] Header 1
        - [x] Header 2
        - [x] Header 3

    - [ ] Textual decoration
        - [ ] Bold, Italic, Marked, ...
        - [x] Math
    
- [ ] List Line
    - [ ] `?` Move to textual line
    - [ ] Ordered list
    - [ ] Unordered list
    - [ ] Change list type (1. -> a.)


### Non-textual lines
- [ ] Actions
    - [ ] Remove line to textual line (if only one line is left)
    - [ ] Add line in front (check how to handle enters???)

- [ ] Image Line
    - [ ] Drag and Drop Image
    - [x] Paste Image
    - [x] Upload Image
    - [ ] From Notebook storage (If files are saved different from the Notebook itself)
    - [ ] Options
        - [ ] Sizing
        - [x] Alignment
        - [ ] Border

- [ ] Grid Line
    - [x] Lines
    - [x] Grid
    - [ ] Options 
        - [ ] Size (Spacing)

- [ ] Table Line
    - [ ] Add
        - [ ] Column
        - [ ] Row
    - [ ] Remove
        - [ ] Column
        - [ ] Row



# Suggested Features
- Block Limitations
- Tooltip (line type options)
- Moving Lines (up/down)
- Extra Line wrapper actions

# Structure
- Notebook
    - NotebookLine
        - TextLine
        - ImageLine
        - ...

## Notebook - NotebookLine (communication)
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
   
## NotebookLine - *Line (communication)
- shared actions (Notebook - NotebookLine)
- changeLineType
- ...
