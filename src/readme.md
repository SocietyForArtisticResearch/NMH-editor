# TODO

# Important:

__I've updated *mnh-backend* with an extra uploadAngular option, that returns json instead of a string (angular http client doesn't like plain strings). So be sure to pull !__

## Issues
* variable "server" in rcexposition should be configurable and somewhere else
* bootstrap link should be to local file
* why do tables look different in previews
* deal with non-image media in convert/export.

# export to doc/pdf/epub
* you get the markdown from exposition.markdownInput, send it to the server to "/convert/pdf" with json { markdown: ... }


## Luc
5. JSON serialization loading and saving
6. Server.js /upload is too good of trust, it accepts anything from anybody and hosts it, this would be a collosal security risk !
	We should check:
	- the thing uploaded is really an image
	- the size is sane
	- the filename should be turned into unique identifier to avoid problems of different images with the same name.
	- check for types


TOC


## Casper
* name of objects should be editable
2. object list interface and binding 
4. is editor responsive?


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
7. Images from not imported using rcmarkdown media notation ![] instead of !{}, 
also embedded media does not show up in rcexposition.media array.

6. from convert json
