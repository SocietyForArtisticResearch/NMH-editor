// Research Catalogue - Text-based exposition model
// Copyright (2017) by Society for Artistic Research
// luc.doebereiner@researchcatalogue.net

// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// (at your option) any later version.


// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software Foundation,
// Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA

import * as MarkdownIt from "markdown-it";

const md = new MarkdownIt('commonmark');

let uniqueID = function () {
    var i = 1;

    return function () {
        return i++;
    };
}();


function stringToId(str) {
    return str.replace(/[^A-Z0-9]+/ig, "-");
}

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

/**

The new Exposition does not contain weaves but a single markdown text. It replaces 

*/


/** Class representing the exposition containing a list of weaves */
export class RCExposition {
    __className: string;
    style: string;
    title: string;
    authors: string[];
    weaves: RCWeave[];
    currentWeave: number;
    breakpoint: number;

    /**
     * Create an exposition
     * @param {string} title - The title of the exposition
     * @param {Array.<string>} authors - List of authors
     * @param {string} style - Optional CSS file
     * @param {Array.<RCWeave>} weaves - List of weaves
     * @param {Object} breakpoint - breakpoint width for linearization (may be a string)
     */
    constructor(title, authors, style, weaves, breakpoint = 1200) {
        this.__className = "RCExposition";
        this.style = style;
        this.title = title;
        this.authors = authors;
        this.weaves = weaves;
        this.currentWeave = 0;
        this.breakpoint = breakpoint;
    }

    /**
     * Render the exposition responsively
     */
    renderResponsive() {
        const mq = window.matchMedia("(min-width: " + this.breakpoint + "px)");
        var matcher = (query => (this.weaves[this.currentWeave]).render(!query.matches));
        mq.addListener(matcher);
        matcher(mq);
    }

    renderResponsiveOnce() {
        const mq = window.matchMedia("(min-width: " + this.breakpoint + "px)");
        var matcher = (query => (this.weaves[this.currentWeave]).render(!query.matches));
        matcher(mq);
    }

    /**
     * Sets the currently visible weave ("page turning");
     * @param {number} i - weave index to be made visible
     */
    setCurrentWeave(i) {
        this.currentWeave = i;
        this.renderResponsiveOnce();
    }


    /**
     * Returns a markdown string of the whole exposition
     * @returns {string} Markdown representation of the exposition 
     */
    asMarkdown() {
        let markdown = `% ${this.title}
    % ${this.authors.join(';')}
    `;
        return (markdown + this.weaves.map(w => w.asMarkdown()).join('\n\n'));
    }

    /** Returns the table of content of the exposition. The exposition
     * has to have been rendered before!
     * @example <caption>Data structure of the TOC objects/entries.</caption>
     * {
     *   level: number // the toc-leve, 1 for h1, 2 for h2 etc..
     *   id: string // the id of the entry, can be the id of an object or header
     *   weaveIdx: number // the index of the containing weave for jumping to that weave
     * }
     * @returns {Array.<Object>} an array of TOC entries
     */
    getTOC() {
        let toc = [];
        for (let i = 0; i < this.weaves.length; i++) {
            let wtoc = this.weaves[i].getTOC(i);
            if (wtoc.length > 0) {
                toc = toc.concat(wtoc);
            };
        }
        return toc;
    }

    /** Removes all weaves and renders the exposition
     * 
     */
    reset() {
        this.weaves = [];
        this.renderResponsiveOnce();
    }

    getObjectWithID(id: number) {
        return flatten(this.weaves.map(w => w.objects)).find(obj => obj.id == id);
    }

    /**
     * Finds an object and updates the content. Will throw an error if 
     * the object does not exist or is no text tool.
     * @param { number } id  The id of the object
     * @param { string } textContent  The new text content (html/md)
     */
    updateRCTextWithIdAndContent(id: number, textContent: string) {
        let tool = this.getObjectWithID(id);
        if ((tool !== undefined) && (tool.__className === "RCText")) {
            tool.updateText(textContent);
            this.renderResponsiveOnce();
        } else {
            throw "Object cannot be found or is not an RCText object";
        }
    }

    /**
     *  Removes objects in any weave based on id
     *  @param { number } id - Id of the tool
     */
    removeObjectWithID(id: number) {
        this.weaves.forEach(w => w.objects = w.objects.filter(obj => obj.id !== id));
        this.renderResponsiveOnce();
    }

    /**
     *  Adds an object to a weave
     *  @param { RCObject } obj - The object
     *  @param { number } weaveId - The weave index
     */
    addObject(obj: RCObject, weaveIdx: number) {
        console.log("adding" + String(obj.id));
        this.weaves[weaveIdx].objects.push(obj);
        this.renderResponsiveOnce();
    }

    insertObject(obj: RCObject, objectIdx: number, weaveIdx: number) {
        this.weaves[weaveIdx].objects.splice(objectIdx, 0, obj);
        this.renderResponsiveOnce();
    }

    /**
     * Returns a JSON string representation of the exposition
     * @returns {string} - JSON string representation fo the exposition
     */
    serialize() {
        return JSON.stringify(this, null, 4);
    }
}

/** Class representing a weave (or page) */
export class RCWeave {
    __className: string;
    grid: RCGrid;
    name: string;
    objects: RCObject[];

    /**
     * Creates a weave
     * @param {RCGrid} grid - a RCGrid specifiying the grid CSS grid.
     * @param {string} name - the name/title of the weave
     * @param {Array.<RCObject>} objects - an array of RCObjects (tools)
     */
    constructor(grid, name, objects) {
        this.__className = "RCWeave";
        this.grid = grid; // RCGrid object
        this.name = name;
        this.objects = objects; // a list of tools (here called 'objects')
    }

    // if objects are in the same cell and have the same
    // width and height, their html will be fused


    /**
     * Write all objects to the page (and thereby replacing previous weave)
     * @param {boolean} linear - If true the weave will be linearized, i.e. displayed vertically
     */
    render(linear = false) {

        if ((this.objects !== undefined) && (this.objects.length > 0)) {
            this.grid.createHTML(linear);
            // create html for each object
            this.objects.forEach((object, i) => {
                object.html = undefined;
                object.createHTML(linear, i + 1);
            });


            let fusedObjects = [];
            let indexFused = 0;
            let toBeRemovedIds: number[] = [];
            this.objects.forEach(obj => {
                // is there already an object with same location and size?
                if (fusedObjects.some((fuseOb, i) => {
                    indexFused = i;
                    toBeRemovedIds.push(obj.id);
                    return ((fuseOb.gridX == obj.gridX) &&
                        (fuseOb.gridY == obj.gridY) &&
                        (fuseOb.gridXEnd == obj.gridXEnd) &&
                        (fuseOb.gridYEnd == obj.gridYEnd));
                })) {
                    // fuse and remove grid options of added element
                    obj.html.style.setProperty("grid-area", null);
                    //                    obj.html.style.gridArea = null;
                    fusedObjects[indexFused].html.appendChild(obj.html);
                } else {
                    fusedObjects.push(obj);
                }
            });

            // remove objects that have been fused with other objects
            // this.objects.forEach(obj => {
            //     if (toBeRemovedIds.some(x => x == obj.id)) {
            //         console.log("removing" + String(obj.id));
            //         obj.html = undefined;
            //     }
            // });


            // add all objects to the grid
            // still to be done for each, but for the filtered new ones
            fusedObjects.forEach(object => {
                this.grid.html.appendChild(object.html);
            });

            document.getElementById("weave").innerHTML = this.grid.html.outerHTML;


            console.log(this.objects)

        }
    }

    /**
     * Returns a markdown string of the weave
     * @returns {string} Markdown representation of the weave
     */
    asMarkdown() {
        return this.objects.map(o => o.asMarkdown()).join('\n\n');
    }

    getTOC(idx) {
        return flatten(this.objects.map(ob => ob.getTOC(idx))).filter(entry => entry !== undefined);
    }

}

/** Class specfiying CSS grid parameters for weaves */
export class RCGrid {
    __className: string;
    x: number;
    y: number;
    autoRows: boolean;
    html: HTMLElement;

    /**
     * Creates a RCGrid
     * @param {number} x - number of horizontal columns
     * @param {number} y - number of vertical rows
     * @param {boolean} autoRows - automatically generate number of rows
     */
    constructor(x, y, autoRows = false) {
        this.__className = "RCGrid";
        this.x = x;
        this.y = y;
        this.autoRows = autoRows;
    }

    /**
     * Create the HTML of the grid
     * @param {boolean} linear - If true the cells will be linearized, i.e. displayed vertically
     */
    createHTML(linear = false) {
        let div = document.createElement("div");
        this.autoRows = linear;
        div.id = "grid";
        div.style.display = "grid";
        if (this.autoRows) {
            div.style.setProperty("grid-template-rows", "none");
            div.style.setProperty("grid-template-columns", "1fr");
            //            div.style.gridTemplateRows = "none";
            //          div.style.gridTemplateColumns = "1fr";
        } else {
            //	    div.style.gridTemplateRows = "repeat(" + this.y + ", 1fr)";
            div.style.setProperty("grid-template-columns", "repeat(" + this.x + ", 1fr)");
            //            div.style.gridTemplateColumns = "repeat(" + this.x + ", 1fr)";
        }

        this.html = div;
    }



}


// Object prototype class
/** Abstract class specfiying basic functionality of all RCObjects, which are subclasses of RCObject. */
class RCObject {
    __className: string;
    gridX: number;
    gridY: number;
    gridXEnd: number;
    gridYEnd: number;
    name: string;
    objectClass: string;
    userClass: string;
    tocDepth: number;
    id: number;
    htmlId: string;
    html: HTMLElement;

    /** Creates an RCObject. Cannot be called directly, but only by
     * constructors of subclasses.
     * @param {string} name - the name of the tool
     * @param {number} gridX - horizontal position
     * @param {number} gridY - vertical position
     * @param {number} width - number of cells it spans horizontally
     * @param {number} height - number of cells it spans vertically
     * @param {string} objectClass - CSS class for object
     * @param {string} userClass - CSS class specified by user
     * @param {number} tocDepth - depth for table of content entry
     */
    constructor(name, gridX, gridY, width = 1, height = 1, objectClass, userClass, tocDepth) {
        this.__className = "RCObject";
        this.gridX = gridX;
        this.gridY = gridY;
        this.gridXEnd = width + gridX;
        this.gridYEnd = height + gridY;
        this.name = name;
        this.objectClass = objectClass;
        this.userClass = userClass;
        this.tocDepth = tocDepth;
        this.id = uniqueID();
        this.htmlId = stringToId(name + "-" + String(this.id));
        if (new.target === RCObject) {
            throw new TypeError("Cannot create an instance of an abstract class");
        }
    }

    /** Cannot be called directly, if defined only updates grid style
     * option */
    createBasicHTML(linear = false, i = 0) {
        if (this.html === undefined) {
            let div = document.createElement("div");
            div.id = this.htmlId;
            div.classList.add("rcobject");
            div.classList.add(this.objectClass);
            if (this.userClass !== undefined) {
                div.classList.add(this.userClass);
            };
            this.html = div;
        };

        if (linear) {
            this.html.style.setProperty("grid-column-start", "1");
            this.html.style.setProperty("grid-row-start", String(i));
            this.html.style.setProperty("grid-column-end", "2");
            this.html.style.setProperty("grid-row-end", String(i + 1));
            // this.html.style.gridColumnStart = 1;
            // this.html.style.gridRowStart = i;
            // this.html.style.gridColumnEnd = 2;
            // this.html.style.gridRowEnd = i + 1;
        } else {
            this.html.style.setProperty("grid-column-start", String(this.gridX));
            this.html.style.setProperty("grid-row-start", String(this.gridY));
            this.html.style.setProperty("grid-column-end", String(this.gridXEnd));
            this.html.style.setProperty("grid-row-end", String(this.gridYEnd));
            // this.html.style.gridColumnStart = this.gridX;
            // this.html.style.gridRowStart = this.gridY;
            // this.html.style.gridColumnEnd = this.gridXEnd;
            // this.html.style.gridRowEnd = this.gridYEnd;
        }
    }

    createHTML(linear = false, i = 0) {
        this.createBasicHTML(linear, i)
    }

    asMarkdown() {
        return "";
    }

    // remove() {
    //     if (this.html !== undefined) {
    //         this.html = undefined;
    //         let el = document.getElementById(this.htmlId);
    //         if (el != null) {
    //             el.parentNode.removeChild(el);
    //         }
    //     }
    // }

    getTOC(weave) {
        if (this.tocDepth !== undefined) {
            return [{
                level: this.tocDepth,
                id: this.name,
                weaveIdx: weave
            }];
        } else {
            return undefined;
        }
    }
}

/** Class that represents a text object, which contains markdown/HTML. */
export class RCText extends RCObject {

    text: string;

    /** Creates an RCText object. 
     * @param {string} name - the name of the tool
     * @param {number} gridX - horizontal position
     * @param {number} gridY - vertical position
     * @param {string} text - the markdown/HTML content
     * @param {number} width - number of cells it spans horizontally
     * @param {number} height - number of cells it spans vertically
     * @param {string} userClass - optional user CSS class
     */
    constructor(name, gridX, gridY, text, width = 1, height = 1, userClass, tocDepth) {
        super(name, gridX, gridY, width, height, "rctext", userClass, tocDepth);
        this.__className = "RCText";
        this.text = text;
        this.createHTML();
    }

    /** Create HTML of the object */
    createHTML(linear = false, i = 0) {
        if (this.html === undefined) {
            let content = document.createElement("div");
            this.createBasicHTML(linear, i);
            // convert md to html TODO
            content.innerHTML = md.render(this.text); // this.text
            // add ids to headers
            for (let i = 1; i < 7; i++) {
                let headers: HTMLElement[] = (<HTMLElement[]><any>content.getElementsByTagName('h' + i));
                for (let j = 0; j < headers.length; j++) {
                    if (headers[j].id.length < 1) {
                        // assign unique id to header
                        headers[j].id = stringToId(headers[j].innerText);
                        //this.name + "_h" + i + "_" + uniqueID();
                    };
                };
            }
            this.html.appendChild(content);
        } else {
            // if defined it only updates responsive issues
            this.createBasicHTML(linear, i);
        }
    }

    /** Update text content and update HTML including header ids */
    updateText(text: string) {
        console.log("updating" + String(this.id));
        // let el = document.getElementById(this.htmlId);
        // if (el != null) {
        //     el.innerHTML = "";
        // }
        this.text = text;
        this.html = undefined;
        this.createHTML();
    }

    /**
     * Returns a markdown string of text object
     * @returns {string} Markdown representation of the text object
     */
    asMarkdown() {
        return this.text;
    }


    /**
     * Generates an array of TOC objects from the html content of the
     * text object
     * @param {number} weave - weave index
     */
    getTOC(weave) {
        let toc = [];
        for (let i = 1; i < 7; i++) {
            let headers = this.html.getElementsByTagName('h' + i);
            for (let j = 0; j < headers.length; j++) {
                toc.push({
                    level: i,
                    id: headers[j].id,
                    weaveIdx: weave
                });
            }
        }
        return toc;
    }

}

// generic prototype media class for image, svg, pdf, video, audio
/** Abstract class for media subclasses for image, svg, pdf, video, audio */
class RCMedia extends RCObject {
    url: string;
    pxWidth: number;
    pxHeight: number;

    /** Creates an RCMedia object. Cannot be called directly, only by
     * the constructors of subclasses.
     * @param {string} name - the name of the tool
     * @param {number} gridX - horizontal position
     * @param {number} gridY - vertical position
     * @param {string} url - the file to be displayed
     * @param {number} pxWidth - the width in pixels
     * @param {number} pxHeight - the height in pixels
     * @param {number} width - number of cells it spans horizontally
     * @param {number} height - number of cells it spans vertically
     */
    constructor(name, gridX, gridY, url, pxWidth, pxHeight, width = 1, height = 1, rcClass, userClass, tocDepth) {
        super(name, gridX, gridY, width, height, rcClass, userClass, tocDepth);
        this.url = url;
        this.pxWidth = pxWidth;
        this.pxHeight = pxHeight;
        this.__className = "RCMedia";
        if (new.target === RCMedia) {
            throw new TypeError("Cannot create an instance of an abstract class")
        }
    }

}

/** Class representing an image */
export class RCImage extends RCMedia {

    /** Creates an RCImage object.  
     * @param {string} name - the name of the tool
     * @param {number} gridX - horizontal position
     * @param {number} gridY - vertical position
     * @param {string} url - the file to be displayed
     * @param {number} pxWidth - the width in pixels
     * @param {number} pxHeight - the height in pixels
     * @param {number} width - number of cells it spans horizontally
     * @param {number} height - number of cells it spans vertically
     * @param {string} userClass - optional user CSS class
     */
    constructor(name, gridX, gridY, url, pxWidth, pxHeight, width = 1, height = 1, userClass, tocDepth) {
        super(name, gridX, gridY, url, pxWidth, pxHeight, width = 1, height = 1, "rcimage", userClass, tocDepth);
        this.__className = "RCImage";
    }

    createHTML(linear = false, i = 0) {
        if (this.html === undefined) {
            let img = document.createElement("img");
            img.setAttribute("src", this.url);
            if (this.pxHeight !== undefined) {
                img.setAttribute("height", String(this.pxHeight));
            };
            if (this.pxWidth !== undefined) {
                img.setAttribute("width", String(this.pxWidth));
            };
            img.setAttribute("alt", this.name);
            this.createBasicHTML(linear, i);
            this.html.appendChild(img);
        } else {
            this.createBasicHTML(linear, i);
        }
    }

    asMarkdown() {
        return `![${this.name}](${this.url})`;
    }

}

/** Class representing a PDF, which will be displayed as an object */
export class RCPdf extends RCMedia {

    /** Creates a RCPdf object.  
     * @param {string} name - the name of the tool
     * @param {number} gridX - horizontal position
     * @param {number} gridY - vertical position
     * @param {string} url - the file to be displayed
     * @param {number} pxWidth - the width in pixels
     * @param {number} pxHeight - the height in pixels
     * @param {number} width - number of cells it spans horizontally
     * @param {number} height - number of cells it spans vertically
     * @param {string} userClass - optional user CSS class
     */
    constructor(name, gridX, gridY, url, pxWidth, pxHeight, width = 1, height = 1, userClass, tocDepth) {
        super(name, gridX, gridY, url, pxWidth, pxHeight, width = 1, height = 1, "rcpdf", userClass, tocDepth);
        this.__className = "RCPdf";
    }

    createHTML(linear = false, i = 0) {
        if (this.html === undefined) {
            let pdf = document.createElement("object");
            pdf.setAttribute("data", this.url);
            pdf.setAttribute("type", "application/pdf");
            if (this.pxHeight !== undefined) {
                pdf.setAttribute("height", String(this.pxHeight));
            };
            if (this.pxWidth !== undefined) {
                pdf.setAttribute("width", String(this.pxWidth));
            };
            pdf.setAttribute("title", this.name);
            this.createBasicHTML(linear, i);
            this.html.appendChild(pdf);
        } else {
            this.createBasicHTML(linear, i);
        }
    }


    asMarkdown() {
        // simple link
        return `[${this.name}](${this.url})`;
    }

}

/** Class representing a SVG, which will be displayed as an object */
export class RCSvg extends RCMedia {

    /** Creates a RCSvg object.  
     * @param {string} name - the name of the tool
     * @param {number} gridX - horizontal position
     * @param {number} gridY - vertical position
     * @param {string} url - the file to be displayed
     * @param {number} pxWidth - the width in pixels
     * @param {number} pxHeight - the height in pixels
     * @param {number} width - number of cells it spans horizontally
     * @param {number} height - number of cells it spans vertically
     * @param {string} userClass - optional user CSS class
     */
    constructor(name, gridX, gridY, url, pxWidth, pxHeight, width = 1, height = 1, userClass, tocDepth) {
        super(name, gridX, gridY, url, pxWidth, pxHeight, width = 1, height = 1, "rcsvg", userClass, tocDepth);
        this.__className = "RCSvg";
    }

    createHTML(linear = false, i = 0) {
        if (this.html === undefined) {
            let svg = document.createElement("object");
            svg.setAttribute("data", this.url);
            svg.setAttribute("type", "image/svg+xml");
            if (this.pxHeight !== undefined) {
                svg.setAttribute("height", String(this.pxHeight));
            };
            if (this.pxWidth !== undefined) {
                svg.setAttribute("width", String(this.pxWidth));
            };
            svg.setAttribute("title", this.name);
            this.createBasicHTML(linear, i);
            this.html.appendChild(svg);
        } else {
            this.createBasicHTML(linear, i);
        }
    }

    asMarkdown() {
        return `![${this.name}](${this.url})`;
    }

}


/** Class representing an audio file/player */
export class RCAudio extends RCMedia {
    autoplay: boolean;
    loop: boolean;

    /** Creates a RCAudio object.  
     * @param {string} name - the name of the tool
     * @param {number} gridX - horizontal position
     * @param {number} gridY - vertical position
     * @param {string} url - the file to be displayed
     * @param {boolean} autoplay - start playing automatically (deprecated)
     * @param {boolean} loop - loop the file
     * @param {number} width - number of cells it spans horizontally
     * @param {number} height - number of cells it spans vertically
     * @param {string} userClass - optional user CSS class
     * @param {number} pxWidth - the width in pixels
     * @param {number} pxHeight - the height in pixels
     */
    constructor(name, gridX, gridY, url, autoplay, loop, width = 1, height = 1, userClass, pxWidth, pxHeight, tocDepth) {
        super(name, gridX, gridY, url, pxWidth, pxHeight, width = 1, height = 1, "rcaudio", userClass, tocDepth);
        this.autoplay = autoplay;
        this.loop = loop;
        this.__className = "RCAudio";
    }

    createHTML(linear = false, i = 0) {
        if (this.html === undefined) {
            let audio = document.createElement("audio");
            audio.setAttribute("controls", "true");
            if (this.autoplay == true) {
                audio.setAttribute("autoplay", "true");
            };
            if (this.loop == true) {
                audio.setAttribute("loop", "true");
            };
            if (this.pxHeight !== undefined) {
                audio.setAttribute("height", String(this.pxHeight));
            };
            if (this.pxWidth !== undefined) {
                audio.setAttribute("width", String(this.pxWidth));
            };
            let source = document.createElement("source");
            source.setAttribute("src", this.url);
            audio.appendChild(source);
            this.createBasicHTML(linear, i);
            this.html.appendChild(audio);
        } else {
            this.createBasicHTML(linear, i);
        }
    }

    asMarkdown() {
        return `[${this.name}](${this.url})`;
    }

}


/** Class representing a RCVideo object */
export class RCVideo extends RCMedia {
    autoplay: boolean;
    loop: boolean;

    /** Creates a RCVideo object.  
     * @param {string} name - the name of the tool
     * @param {number} gridX - horizontal position
     * @param {number} gridY - vertical position
     * @param {string} url - the file to be displayed
     * @param {boolean} autoplay - start playing automatically (deprecated)
     * @param {boolean} loop - loop the file
     * @param {number} width - number of cells it spans horizontally
     * @param {number} height - number of cells it spans vertically
     * @param {string} userClass - optional user CSS class
     * @param {number} pxWidth - the width in pixels
     * @param {number} pxHeight - the height in pixels
     */
    constructor(name, gridX, gridY, url, autoplay = false, loop = false, width = 1, height = 1, userClass, pxWidth, pxHeight, tocDepth) {
        super(name, gridX, gridY, url, pxWidth, pxHeight, width = 1, height = 1, "rcvideo", userClass, tocDepth);
        this.autoplay = autoplay;
        this.loop = loop;
        this.__className = "RCVideo";
    }

    createHTML(linear = false, i = 0) {
        if (this.html === undefined) {
            let video = document.createElement("video");
            video.setAttribute("controls", "true");
            if (this.autoplay) {
                video.setAttribute("autplay", "true");
            };
            if (this.loop) {
                video.setAttribute("loop", "true");
            };
            if (this.pxHeight !== undefined) {
                video.setAttribute("height", String(this.pxHeight));
            };
            if (this.pxWidth !== undefined) {
                video.setAttribute("width", String(this.pxWidth));
            };
            let source = document.createElement("source");
            source.setAttribute("src", this.url);
            video.appendChild(source);
            this.createBasicHTML(linear, i);
            this.html.appendChild(video);
        } else {
            this.createBasicHTML(linear, i);
        }
    }

    asMarkdown() {
        return `[${this.name}](${this.url})`;
    }

}

// /** Convert parsed object specification array into an array of RCObjects
//  *  @param {Array.<Object>} array - object specification array
//  *
// */
// function objectFromArray(array) {
//     var options;
//     switch (array[0]) {
//         case "text":
//             options = array[7];
//             return new RCText(array[1], array[2], array[3], array[6], array[4], array[5], options.class);
//             break;
//         case "image":
//             options = array[7];
//             return new RCImage(array[1], array[2], array[3], array[6], options.width, options.height,
//                 array[4], array[5], options.class);
//             break;
//         case "pdf":
//             options = array[7];
//             return new RCPdf(array[1], array[2], array[3], array[6], options.width, options.height,
//                 array[4], array[5], options.class);
//             break;
//         case "svg":
//             options = array[7];
//             return new RCSvg(array[1], array[2], array[3], array[6], options.width, options.height,
//                 array[4], array[5], options.class);
//             break;
//         case "audio":
//             options = array[7];
//             return new RCAudio(array[1], array[2], array[3], array[6], options.autoplay, options.loop,
//                 array[4], array[5], options.class, options.width, options.height);
//             break;
//         case "video":
//             options = array[7];
//             return new RCVideo(array[1], array[2], array[3], array[6], options.autoplay, options.loop,
//                 array[4], array[5], options.class, options.width, options.height);
//             break;
//         default:
//             throw new Error("Unknown type of object: " + array[0]);
//     }
// }


// /** Create weave from specification
//  *  @param {Array.<Object>} array - grid and object specification array
//  *
// */
// function weaveFromArray(array) {
//     let grid = new RCGrid(array[0][1], array[0][2]);
//     let objects = array[2].map(objectFromArray);
//     return new RCWeave(grid, array[1], objects);
// }

// /** Create exposition from specification (output by parses)
//  *  @param {Array.<Object>} array - exposition specification array
//  *
// */
// function expositionFromArray(array) {
//     return new RCExposition(array[0], array[1], array[2].style, array[3].map(weaveFromArray), array[2].breakpoint);
// }


// Deserialization
/**
 * This class allows the import of serialized RC objects. {@link RCExposition} objects that
 * have been exported using the serialize method can be imported and cast back into
 * {@link RCExposition} objects.
 */
class RCExpositionDeserializer {

    static classList() {
        return {
            RCExposition: RCExposition,
            RCWeave: RCWeave,
            RCGrid: RCGrid,
            RCObject: RCObject,
            RCText: RCText,
            RCImage: RCImage,
            RCAudio: RCAudio,
            RCVideo: RCVideo,
            RCPdf: RCPdf,
            RCSvg: RCSvg,
            RCMedia: RCMedia
        };
    }

    static isObject(varOrObj) {
        return varOrObj !== null && typeof varOrObj === 'object';
    }

    static restoreObject(obj) {
        let newObj = obj;

        // At this point we have regular javascript object
        // which we got from JSON.parse. First, check if it
        // has "__className" property which we defined in the
        // constructor of each class
        if (obj.hasOwnProperty("__className")) {
            let list = RCExpositionDeserializer.classList();

            // Instantiate object of the correct class
            newObj = new (list[obj["__className"]]);

            // Copy all of current object's properties
            // to the newly instantiated object
            newObj = Object.assign(newObj, obj);

            // Run the makeshift constructor, if the
            // new object has one
            //            if (newObj.__initialize === 'function') {
            //              newObj.__initialize();
            //        }
        }

        // Iterate over all of the properties of the new
        // object, and if some of them are objects (or arrays!) 
        // constructed by JSON.parse, run them through ObjectRebuilder
        for (let prop of Object.keys(newObj)) {
            if (RCExpositionDeserializer.isObject(newObj[prop])) {
                newObj[prop] = RCExpositionDeserializer.restoreObject(newObj[prop]);
            }
        }

        return newObj;
    }

}


// TODO
// - test html input for text tool
// - output as rclang
// - modularize
