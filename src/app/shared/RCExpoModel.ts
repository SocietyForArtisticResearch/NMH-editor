import { RCExposition, RCExpositionDeserializer } from './rcexposition';
import { Backend } from "./Backend";
import { RCMDE } from './rcmde';
import otText from 'ot-text';

//import richText from 'rich-text';


// experimental sharedb
import * as sharedb from "sharedb/lib/client";
sharedb.types.map['json0'].registerSubtype(otText.type);
//sharedb.types.register(richText.type);
//import StringBinding from "sharedb-string-binding";
import ShareDBCodeMirror from "sharedb-codemirror";

interface ExpositionRCLoadData {
    html: string;
    markdown: string;
    // toc
    // title
}


/** This is a class to provide MNH specific needs for RCExposition 
 * The class construct a fully specified RCExposition object 
 * (Because DI cannot call arguments on a constructor 
 * ,unless they are injected dependencies of the service module themselves).
 */
export class RCExpoModel {
    exposition: RCExposition;
    saveInterval: any;
    syncInterval: any;
    canBeSaved: boolean;
    markdownInput: string;
    markdownProcessed: string;
    mde: any;

    constructor() {
        // number of Y cells should be updated by number of tools).

        let defaultStyle = `.exposition {
        background - color: #FFFFFF;

        font-family: "Helvetica", sans-serif;
        font-size: 100 %; 
        line-height: 125 %; 
    } 

.exposition-content {
    margin: 40px;
}

.exposition h1 {
    display: block;
    line-height: 1.1;
    font-size: 3em;
    font-weight: bold;
}	

.rcimage {
    margin: 10px 0px;
}

.rcimage img {
    max-width: 100 %;
}

.exposition h2, h3, h4, h5, h6 {
    display: block;
    line-height: 1.1;
    font-size:1.5em;
    font-weight: bold;
}

.exposition code {
    padding: 2px 4px;
    font-size: 90 %;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
}

.exposition a {
    color: #337ab7;
    text-decoration: none;
}

.exposition li {
    display: list-item;
    text-align: -webkit-match-parent;
} 

.exposition ul {
    list-style-type: disc;
}

.exposition ol {
    list-style-type: decimal;
} `;

        this.exposition = new RCExposition('');
        this.exposition.style = defaultStyle;

    }

    syncModelWithRC(continueFunction?: () => void) {
        //console.log('sync started');
        try {
            let id = this.exposition.id;
            var xhttp = new XMLHttpRequest();
            var that = this;
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var mde = that.mde;
                    let medialist = JSON.parse(xhttp.responseText);
                    that.exposition.integrateRCMediaList(medialist);
                    //                 console.log(that.exposition.media);

                };
                that.loadSerializedMedia(continueFunction);
                //                console.log('exposition media after merge: ', that.exposition.media);
            };

            xhttp.open("GET", `${Backend.rcBaseAddress}text-editor/simple-media-list?research=${id}`, true);
            xhttp.send();
        } catch (err) {
            console.log('an error occured trying to sync media: ', err);
        }
    }


    loadSerializedMedia(continueFunction?: () => void) {
        let id = this.exposition.id;
        let weave = this.exposition.currentWeave;
        var xhttp = new XMLHttpRequest();
        var self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let expositionJSON = JSON.parse(xhttp.responseText);
                // console.log("Load media:");
                // console.log(expositionJSON.media);
                self.exposition.integrateSerializedMediaInfo(JSON.parse(expositionJSON.media));
                //                self.mde.value(self.exposition.markdownInput);
                //             self.mde.render();
                //                console.log(self.exposition.media);

                if (continueFunction != undefined) {
                    continueFunction();
                }
            }
        };
        xhttp.open("GET", `${Backend.rcBaseAddress}text-editor/load?research=${id}&weave=${weave}`, true);
        xhttp.send();
    }

    loadExpositionData() {
        let id = this.exposition.id;
        let weave = this.exposition.currentWeave;
        var xhttp = new XMLHttpRequest();
        var self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let expositionJSON = JSON.parse(xhttp.responseText);
                self.exposition.title = expositionJSON.title;
                self.exposition.markdownInput = expositionJSON.markdown;
                self.exposition.style = expositionJSON.style;
                self.mde.exposition = self.exposition;
                // it is safe to save, because loading was successful
                self.canBeSaved = true;
            }
        };
        xhttp.open("GET", `${Backend.rcBaseAddress}text-editor/load?research=${id}&weave=${weave}`, true);
        xhttp.send();
    }



    saveToRC() {

        // Only save if it can be saved and markdown input is neither null nor undefined
        if (this.canBeSaved && (this.exposition.markdownInput !== null) && (this.exposition.markdownInput !== undefined)) {
            let id = this.exposition.id;
            let weave = this.exposition.currentWeave;
            let fd = new FormData();
            let self = this;
            fd.append("html", this.exposition.renderedHTML);
            fd.append("markdown", this.exposition.markdownInput);
            fd.append("media", this.exposition.serializeMedia()); // TODO send media list/see if necessary
            fd.append("style", this.exposition.style);
            fd.append("title", this.exposition.title);
            fd.append("toc", JSON.stringify(this.exposition.getTOC()));
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                self.mde.saved = true;
                self.mde.displaySaveStatus();

            };
            xhttp.open("POST", `${Backend.rcBaseAddress}text-editor/save?research=${id}&weave=${weave}`, true);
            xhttp.send(fd);
        }
    }

    loadExpositionFromURL(expositionJSONUrl: string) {
        // This is the older (local) backend (not using RC)
        Backend.useRC = false;
        //        console.log('this will load the exposition from: ' + expositionJSONUrl);
        var xhttp = new XMLHttpRequest();
        var that = this; // the wonderfully messed up way scoping works
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var mde = that.mde;
                let expositionJSON = JSON.parse(xhttp.responseText);
                let exposition = RCExpositionDeserializer.restoreObject(expositionJSON);
                exposition.media.forEach(m => m.html = undefined);
                that.exposition = exposition;
                mde.exposition = exposition;
                mde.saved = true;
                that.mde.value(exposition.markdownInput);
                that.mde.render();
            }
        };
        //console.log("starting request, with url:", expositionJSONUrl);
        xhttp.open("GET", expositionJSONUrl, true);
        xhttp.send();
    }

    shareDBConnect() {
        let self = this;
        let socket = new WebSocket('wss://' + 'doebereiner.org:8999');
        let connection = new sharedb.Connection(socket);

        let doc = connection.get('examples', 'richtext');

        let cm = this.mde.codemirror;

        // doc.subscribe(function (err) {
        //     if (err) throw err;
        //     //self.mde.value(doc.data)

        //     console.log(doc.data);

        //     cm.on('change', function (cmObject, change) {
        //         //            if (source != 'user') return;
        //         console.log("sending change");
        //         console.log(change);
        //         doc.submitOp(self.mde.value(), { source: 'editor' });
        //     });

        //     // doc.on('op', function (op, source) {
        //     //     console.log("getting change:")
        //     //     console.log(op);
        //     //     if (source == 'editor') return;
        //     //     //  self.mde.value(op);
        //     // });
        // });

        ShareDBCodeMirror.attachDocToCodeMirror(doc, cm, {
            key: 'content',
            verbose: true
        });

        // doc.subscribe(function (err) {
        //     if (err) throw err;
        //     var element = self.mde.element;
        //     var binding = new StringBinding(element, doc);
        //     binding.setup();
        // });


    }

    loadExpositionFromRC(id: number, weave: number) {
        Backend.useRC = true;

        let self = this;

        // initially false
        self.canBeSaved = false;
        // create exposition object
        let new_exposition = new RCExposition('');
        new_exposition.id = id;
        new_exposition.currentWeave = weave;
        this.exposition = new_exposition;

        // load data
        this.loadExpositionData();

        // sync media model with rc
        this.syncModelWithRC(() => {
            // render again
            self.mde.value(self.exposition.markdownInput);
            self.mde.render();
        });

        // save every 12 seconds if needs to be saved
        this.saveInterval = setInterval(() => {
            if (document.hasFocus() && !self.mde.saved) {
                self.saveToRC();
                self.mde.displaySaveStatus();
            }
        }, 12000);

        // synchronize media every 40 seconds due to transcoding status
        this.syncInterval = setInterval(() => {
            if (document.hasFocus()) {
                //console.log("synced");
                self.syncModelWithRC()
            }
        }, 40000);

        // tab/browser visbility and reload
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                self.loadExpositionData();
                self.syncModelWithRC();
            } else {
                self.saveToRC();
                self.mde.displaySaveStatus();
            }
        })


        // Open WebSocket connection to ShareDB server
        // experimental
        setTimeout(() => self.shareDBConnect(), 2000);
    }
}
