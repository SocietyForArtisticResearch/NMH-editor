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
6. Server.js /upload is probably too good of trust, it accepts anything from anybody and hosts it, I suspect it is to dangerous to put it in the wild (we may end up hosting DDOS networks, porn, nazi stuff and cryptocoin miners in minutes ;-) )
Some checks:
	- the thing uploaded is really an image (and an image type we like: jpg, png, tiff, gif)
	- the size is sane
	- the filename should be turned into unique identifier to avoid problems of different images with the same name.
	- perhaps only allow calls from certain addresses.
7. mde double click media insertion: if I insert twice, the current code inserts one media 'into' the other: !{!{image2}image1}.
* TOC

8. When trying to export pdf, I get an error, try for example: /Users/casperschipper/Documents/Developer/MNH-Editor/test/Lucia with cat.docx
9. Style of exposition should be properly namespaced, currently editor styling also affected.



## Casper
4. is editor responsive?
5. add export as other types of documents
7. make media list more responsive (perhaps should be full screen on small screens ?).

## Changes in rcexpostion.ts 23/02/2018

2. added a method for replacing an object by id (I needed it because of the way Angular updates models from 'reactive' forms). 
__This replace method introduces some change in behavior of the automatic id generation: it copies the old id into a new object. This may result in gaps in the id counting, maybe this is ok ?__

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
