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

// TODO
// from RC API media create media list
// mediaurl with RC url


// DONE
// constructors same paramters

import { Backend } from "./Backend"
import * as Utils from "./utils";


/**

The new Exposition does not contain weaves but a single markdown text. It replaces 

*/


/** Class representing the exposition containing a list of weaves */
export class RCExposition {
    __className: string;
    style: string;
    title: string;
    urlRenderRC: boolean;
    authors: string[];
    breakpoint: number;
    markdownInput: string;
    id: number
    //    markdownOutput: string;
    renderedHTML: string;
    toc: any;
    media: RCObject[];

    constructor(title: string, authors: string[], style) {
        this.__className = "RCExposition";
        this.style = style;
        this.title = title;
        this.authors = authors;
        this.urlRenderRC = false;
        this.renderedHTML = "";
        this.media = [];
    }

    replaceToolsWithImages(text) {
        console.log("inserting images");
        let self = this;
        let re = /!{(\w+)}/g;
        let insertedTools;
        if (Backend.useRC) {
            console.log("inserting images for backend");
            insertedTools = text.replace(re, function (m, p1) { return "![" + name + "](" + self.media.find(obj => obj.name == p1).rcURL(self.id) + ")"; });
        } else {
            insertedTools = text.replace(re, function (m, p1) { return "![" + name + "](" + self.media.find(obj => obj.name == p1).url + ")"; });
        }
        return insertedTools;
    }

    /**
     * Returns a markdown string of the whole exposition
     * @returns {string} Markdown representation of the exposition 
     */
    asMarkdown(replaceTools = true) {
        //     let markdown = `% ${this.title}
        // % ${this.authors.join(';')}
        // `;
        //    return (markdown + RCExposition.replaceToolsWithImages(this.markdownInput));
        return this.replaceToolsWithImages(this.markdownInput);
    }

    /**
     * Generates an array of TOC objects from the html content of 
     * exposition
     * @param {number} weave - weave index
     */
    getTOC() {
        let toc = [];
        let html = document.createElement('div');
        //        let html = new Element();
        html.innerHTML = this.renderedHTML;
        let headers = html.querySelectorAll("h1, h2, h3");
        for (let i = 0; i < headers.length; i++) {
            if (!headers[i].id) {
                headers[i].id = Utils.stringToId((<HTMLHeadingElement>headers[i]).innerText);
            };
            toc.push({
                level: Number(headers[i].nodeName[1]),
                id: headers[i].id,
            });
        }

        this.renderedHTML = html.innerHTML;
        this.toc = toc;
        return toc;
    }



    /** Removes all weaves and renders the exposition
     * 
     */

    getObjectWithID(id: number) {
        return this.media.find(obj => obj.id == id);
    }

    getObjectWithName(name: string) {
        return this.media.find(obj => obj.name == name);
    }

    removeObjectWithID(id: number) {
        this.media = this.media.filter(obj => obj.id !== id);
    }

    addObject(obj: RCObject) {
        // TODO check that there is no object with the same ID
        this.media.push(obj);
    }

    replaceObjectWithID(id: number, obj: RCObject) {
        obj.id = id; // also set the id to the old.
        let index = this.media.findIndex(obj => obj.id === id);
        if (index > -1) {
            this.media[index] = obj;
        } else {
            console.log('replace failed, no object for id: ' + id + ' found.');
        }
    }

    // used for doc import
    addImageList(list) {
        let self = this;
        let obj = list.map(spec => {
            if (Backend.useRC) {
                self.updateOrCreateObject(spec);
            } else {
                let id = Utils.uniqueID();
                let o = new RCImage(id, "image" + id);
                o.url = Backend.baseAddress + "/" + spec; // spec for non-RC is url of media/image
                self.addObject(o);
                return o;
            }
        });
        return obj.map(o => o.name);
    }

    // chek if exists then update otherwise create object
    private updateOrCreateObject(rcmedia) {
        let ob = this.getObjectWithID(rcmedia.id);
        if (ob == undefined) {
            if (rcmedia.media != undefined) {
                let objectType = rcmedia.media.type;
                console.log(objectType);
                switch (objectType) {
                    case "image": {
                        ob = new RCImage(rcmedia.id, rcmedia.name);
                        break;
                    }
                    case "audio": {
                        ob = new RCAudio(rcmedia.id, rcmedia.name);
                        break;
                    }
                    case "video": {
                        ob = new RCVideo(rcmedia.id, rcmedia.name);
                        break;
                    }
                    case "pdf": {
                        ob = new RCPdf(rcmedia.id, rcmedia.name);
                        break;
                    }
                }
                this.addObject(ob);
            }
        }
        ob.description = rcmedia.description;
        ob.copyright = rcmedia.copyright;
        ob.name = rcmedia.name;
        return ob;
    }


    integrateRCMediaList(RCMediaList: Array<any>) {
        /* gets the list from the RC Server json list */
        let self = this;
        RCMediaList.filter(m => m.media != null).forEach(m => self.updateOrCreateObject(m));
    }



    /**
     * Returns a JSON string representation of the exposition
     * @returns {string} - JSON string representation fo the exposition
     */
    serialize() {
        return JSON.stringify(this, null, 4);
    }
}



// Object prototype class
/** Abstract class specfiying basic functionality of all RCObjects, which are subclasses of RCObject. */
export class RCObject {
    __className: string;
    name: string;
    description: string;
    copyright: string;
    objectClass: string;
    userClass: string;
    tocDepth: number;
    id: number;
    htmlId: string;
    url: string;
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
    constructor(id: number, name: string) {
        this.__className = "RCObject";
        this.name = name;
        this.id = id;
        this.htmlId = Utils.stringToId(name + "-" + String(this.id));
        if (new.target === RCObject) {
            throw new TypeError("Cannot create an instance of an abstract class");
        }
    }

    //     constructor(name, objectClass, userClass) {
    //     this.__className = "RCObject";
    //     this.name = name;
    //     this.objectClass = objectClass;
    //     this.userClass = userClass;
    //     this.id = uniqueID();
    //     this.htmlId = stringToId(name + "-" + String(this.id));
    //     if (new.target === RCObject) {
    //         throw new TypeError("Cannot create an instance of an abstract class");
    //     }
    // }

    /** Cannot be called directly, if defined only updates grid style
     * option */
    createBasicHTML() {
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

    }

    createHTML() {
        this.createBasicHTML;
    }

    addTOC(depth: number) {
        this.tocDepth = depth;
    }

    removeTOC() {
        this.tocDepth = undefined;
    }

    asMarkdown() {
        return "";
    }

    rcURL(expositionId: number) {
        console.log(`${Backend.rcBaseAddress}text-editor/simple-media-resource?research=${expositionId}&simple-media=${this.id}`);
        return `${Backend.rcBaseAddress}text-editor/simple-media-resource?research=${expositionId}&simple-media=${this.id}`;
    }


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

// generic prototype media class for image, svg, pdf, video, audio
/** Abstract class for media subclasses for image, svg, pdf, video, audio */
export class RCMedia extends RCObject {
    pxWidth: number;
    pxHeight: number;

    constructor(id: number, name: string, objectClass: string) {
        super(id, name);
        // this.url = url;
        // this.pxWidth = pxWidth;
        // this.pxHeight = pxHeight;
        this.__className = "RCMedia";
        this.objectClass = objectClass;
        if (new.target === RCMedia) {
            throw new TypeError("Cannot create an instance of an abstract class")
        }
    }



    // constructor(name: string, url: string, rcClass, userClass, pxWidth?: number, pxHeight?: number) {
    //     super(name, rcClass, userClass);
    //     this.url = url;
    //     this.pxWidth = pxWidth;
    //     this.pxHeight = pxHeight;
    //     this.__className = "RCMedia";
    //     if (new.target === RCMedia) {
    //         throw new TypeError("Cannot create an instance of an abstract class")
    //     }
    // }


}

/** Class representing an image */
export class RCImage extends RCMedia {

    constructor(id: number, name: string) {
        super(id, name, "rcimage");
        this.__className = "RCImage";
    }

    // constructor(name: string, url: string, userClass, pxWidth?: number, pxHeight?: number) {
    //     super(name, url, "rcimage", userClass, pxWidth, pxHeight);
    //     this.__className = "RCImage";
    // }

    createHTML() {
        if (this.html === undefined) {
            let img = document.createElement("img");
            img.setAttribute("src", this.url);
            if ((this.pxHeight !== undefined) && (this.pxHeight)) {
                img.setAttribute("height", String(this.pxHeight));
            };
            if ((this.pxWidth !== undefined) && (this.pxWidth)) {
                img.setAttribute("width", String(this.pxWidth));
            };
            img.setAttribute("alt", this.name);
            this.createBasicHTML();
            this.html.appendChild(img);
        } else {
            this.createBasicHTML();
        }
    }

    asMarkdown() {
        return `![${this.name}](${this.url})`;
    }

}

/** Class representing a PDF, which will be displayed as an object */
export class RCPdf extends RCMedia {

    constructor(id: number, name: string) {
        super(id, name, "rcpdf");
        this.__className = "RCPdf";
    }

    // constructor(name: string, url: string, userClass, pxWidth?: number, pxHeight?: number) {
    //     super(name, url, "rcpdf", userClass, pxWidth, pxHeight);
    //     this.__className = "RCPdf";
    // }

    createHTML() {
        if (this.html === undefined) {
            let pdf = document.createElement("object");
            pdf.setAttribute("data", this.url);
            pdf.setAttribute("type", "application/pdf");
            if ((this.pxHeight !== undefined) && (this.pxHeight)) {
                pdf.setAttribute("height", String(this.pxHeight));
            };
            if ((this.pxWidth !== undefined) && (this.pxWidth)) {
                pdf.setAttribute("width", String(this.pxWidth));
            };
            pdf.setAttribute("title", this.name);
            this.createBasicHTML();
            this.html.appendChild(pdf);
        } else {
            this.createBasicHTML();
        }
    }


    asMarkdown() {
        // simple link
        return `[${this.name}](${this.url})`;
    }

}

/** Class representing a SVG, which will be displayed as an object */
export class RCSvg extends RCMedia {

    constructor(id: number, name: string) {
        super(id, name, "rcsvg");
        this.__className = "RCSvg";
    }

    // constructor(name: string, url: string, userClass, pxWidth?: number, pxHeight?: number) {
    //     super(name, url, "rcsvg", userClass, pxWidth, pxHeight);
    //     this.__className = "RCSvg";
    // }

    createHTML() {
        if (this.html === undefined) {
            let svg = document.createElement("object");
            svg.setAttribute("data", this.url);
            svg.setAttribute("type", "image/svg+xml");
            if ((this.pxHeight !== undefined) && (this.pxHeight)) {
                svg.setAttribute("height", String(this.pxHeight));
            };
            if ((this.pxWidth !== undefined) && (this.pxWidth)) {
                svg.setAttribute("width", String(this.pxWidth));
            };
            svg.setAttribute("title", this.name);
            this.createBasicHTML();
            this.html.appendChild(svg);
        } else {
            this.createBasicHTML();
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

    constructor(id: number, name: string) {
        super(id, name, "rcaudio");
        this.__className = "RCAudio";
    }

    // constructor(name: string, url: string, autoplay, loop, userClass, pxWidth?: number, pxHeight?: number) {
    //     super(name, url, "rcaudio", userClass, pxWidth, pxHeight);
    //     this.autoplay = autoplay;
    //     this.loop = loop;
    //     this.__className = "RCAudio";
    // }

    createHTML() {
        if (this.html === undefined) {
            let audio = document.createElement("audio");
            audio.setAttribute("controls", "true");
            if (this.autoplay == true) {
                audio.setAttribute("autoplay", "true");
            };
            if (this.loop == true) {
                audio.setAttribute("loop", "true");
            };
            if ((this.pxHeight !== undefined) && (this.pxHeight)) {
                audio.setAttribute("height", String(this.pxHeight));
            };
            if ((this.pxWidth !== undefined) && (this.pxWidth)) {
                audio.setAttribute("width", String(this.pxWidth));
            };
            let source = document.createElement("source");
            source.setAttribute("src", this.url);
            audio.appendChild(source);
            this.createBasicHTML();
            this.html.appendChild(audio);
        } else {
            this.createBasicHTML();
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

    constructor(id: number, name: string) {
        super(id, name, "rcvideo");
        this.__className = "RCVideo";
    }


    // constructor(name, url, autoplay, loop, userClass, pxWidth?: number, pxHeight?: number) {
    //     super(name, url, "rcvideo", userClass, pxWidth, pxHeight);
    //     this.autoplay = autoplay;
    //     this.loop = loop;
    //     this.__className = "RCVideo";
    // }

    createHTML() {
        if (this.html === undefined) {
            let video = document.createElement("video");
            video.setAttribute("controls", "true");
            if (this.autoplay) {
                video.setAttribute("autplay", "true");
            };
            if (this.loop) {
                video.setAttribute("loop", "true");
            };
            if ((this.pxHeight !== undefined) && (this.pxHeight)) {
                video.setAttribute("height", String(this.pxHeight));
            };
            if ((this.pxWidth !== undefined) && (this.pxWidth)) {
                video.setAttribute("width", String(this.pxWidth));
            };
            let source = document.createElement("source");
            source.setAttribute("src", this.url);
            video.appendChild(source);
            this.createBasicHTML();
            this.html.appendChild(video);
        } else {
            this.createBasicHTML();
        }
    }

    asMarkdown() {
        return `[${this.name}](${this.url})`;
    }

}



// Deserialization
/**
 * This class allows the import of serialized RC objects. {@link RCExposition} objects that
 * have been exported using the serialize method can be imported and cast back into
 * {@link RCExposition} objects.
 */
export class RCExpositionDeserializer {

    static classList() {
        return {
            RCExposition: RCExposition,
            RCObject: RCObject,
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
