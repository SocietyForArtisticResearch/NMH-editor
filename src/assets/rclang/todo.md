TODO

For TOC 
* how many pages, names of pages etc getters (Luc)
* add toc to syntax definition (Luc)
* adjust toc generator to use objects and take out img (casper)
* add to exposition class (casper)

* cell options (alignment, padding)
* id generation as rc object class var
* don't allow duplicate names
* modules
* move markdown conversion from rcobject to calling context
* Serialize (JSON) export 
* integrate TOC generation by going to text tools
* syntax and other exception handling
* video tool
* svg and pdf tools ("object" tag)
* embed tool (use actual rc code?)
* slideshow
* play tool
* footnotes 
* relative positioning of objects on the grid.

IDEAS
* definition of pages 
* error detection (for example, when a cell overlaps with another cell).
* drag and drop editor with grid mode (showing the grid layout)
* more grid options (padding, irregular patterns, complete auto etc..)

* in syntax have generic "media" element (image, video, audio, pdf, svg)

* change syntax to: name x y cellwidth? cellheight? url/text options
options can be e.g. "width:200px" or "autoplay"


Done
* markdown export for pandoc
* change file name of gridgen (done)
* Exposi tion class (luc) (done)
* weaves (done)
* title (done)
* author (done)
* rendering for weaves (done)
* extend syntax (done)
* add toc depth (1-6) property to object (Luc)

CHANGES
13/11/2017
* * User CSS

12/11/2017
* * Markdown for text input in rc input format

9/11/2017
* parser working

8/11/2017
* non-destructive linearization
* full responsiveness (with listener), changes layout when resizing window

6/11/2017
* Linearize layout
* Display width dependency (responsive)
not yet fully reponsive, done by order in array not by location on page


