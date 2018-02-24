# TODO

## Issues
* We need proportional image resizing
* variable "server" in rcexposition should be configurable and somewhere else

# export to doc/pdf/epub
* you get the markdown from exposition.markdownInput, send it to the server to "/convert/pdf" with json { markdown: ... }


## Luc
5. JSON serialization loading and saving
6. from convert json

7. Images from not imported using rcmarkdown media notation ![] instead of !{}, 
also embedded media does not show up in rcexposition.media array.

TOC


## Casper
1. fix CSS of editor, status bar, resizing, scrollbars, fullscreen, get rid of tab, wider editor
2. object list interface and binding 
3. code editor for user css (where should that be)?
4. is editor responsive?
5. buttons for import/export (buttons for JSON download/upload)


## Changes in rcexpostion.ts 23/02/2018

1. fixed a bug with removing object by Id.
2. added a method for replacing an object by id (I needed it because of the way Angular updates models from 'reactive' forms).

# OLD/DONE
If RCExposition were a typescript class Angular would be really happy.
I could remove a lot of "adapter" code.

It would be good if a RCText constructs a unique identity (<tag id="">) when created.

RCText - have a method for setting HTML directly (because of tinymce output).

1. make ts class from editor and adapt to rc (tools, preview, media insert etc) (done)
2. Simplify rcexposition and adapt RCExpoModel (done)
3. Rendering with markdown-it and replacement with tools (done)
4. User CSS import
6. backend input/export
7. Table support is broken, we should remove button if we do not support.
* Media List should not be in tab but sidebar
* When changing from media list to editor, content in editor is gone
