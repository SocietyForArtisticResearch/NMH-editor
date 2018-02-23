# TODO

## Issues
* Compile error  (basic-tool.component.ts(50,24): error TS2304: Cannot find name 'SimpleChanges'.)
* Media List should not be in tab but sidebar
* When changing from media list to editor, content in editor is gone
* We need proportional image resizing

## Luc
5. JSON serialization loading and saving
6. backend input/export

## Casper
1. fix CSS of editor, status bar, resizing, scrollbars, fullscreen, get rid of tab, wider editor
2. object list interface and binding 
3. code editor for user css (where should that be)?
4. is editor responsive?
5. buttons for import/export

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
