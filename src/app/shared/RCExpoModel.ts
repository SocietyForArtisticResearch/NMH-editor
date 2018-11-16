import { RCExposition, RCExpositionDeserializer } from './rcexposition';
import { Backend } from "./Backend";
import { RCMDE } from './rcmde';
import otText from 'ot-text';
import * as Utils from "./utils";

//import richText from 'rich-text';


// experimental sharedb
import * as sharedb from "sharedb/lib/client";
//sharedb.types.map['json0'].registerSubtype(otText.type);
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
    rtConnection: boolean = false;
    saveInterval: any;
    syncInterval: any;
    editorVersion: string = "1.0.15";
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

                    try {
                        let medialist = JSON.parse(xhttp.responseText);
                        that.exposition.integrateRCMediaList(medialist);
                        //                 console.log(that.exposition.media);
                        that.loadSerializedMedia(continueFunction);
                    } catch (err) {
                        alert('JSON.parse failed, please contact RC support\n\n' + err);
                    }



                };
                // OLD LOCATION WRONG PLACE ? that.loadSerializedMedia(continueFunction);
                //                console.log('exposition media after merge: ', that.exposition.media);
            };

            xhttp.open("GET", `${Backend.rcBaseAddress}text-editor/simple-media-list?research=${id}`, true);
            xhttp.send();
        } catch (err) {
            alert('an error occured trying to sync media, please contact RC support \n\n err' + err + 'http result\n' + xhttp.responseText);
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

    getRemoteContentVersion(callback?: (number) => void) {
        let id = this.exposition.id;
        let weave = this.exposition.currentWeave;
        var xhttp = new XMLHttpRequest();
        var self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    let expositionJSON = JSON.parse(xhttp.responseText);

                    //DEBUG
                    // console.log(expositionJSON);

                    //                    if (expositionJSON.editor     != undefined) {
                    try {
                        let metadataObj = JSON.parse(expositionJSON.metadata);
                        //
                        //                      console.log("Calling save callback");
                        // DEBUG
                        //console.log(metadataObj);
                        callback(metadataObj.contentVersion);
                    } catch (err) {
                        callback(0);
                        //                        console.log("Could not parse editor metadata: " + err);
                        //                    }
                    }
                }
                catch (err) {
                    alert("JSON parse failed, please contact RC support\n error message: \n" + err + "\nhttp response:\n" + xhttp.responseText);
                }
            }
        };
        xhttp.open("GET", `${Backend.rcBaseAddress}text-editor/load?research=${id}&weave=${weave}`, true);
        xhttp.send();

    }


    // used when RC is the backend : 
    loadExpositionData(continueFunction?: () => void) {
        let id = this.exposition.id;
        let weave = this.exposition.currentWeave;
        var xhttp = new XMLHttpRequest();
        var self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    let expositionJSON = JSON.parse(xhttp.responseText);
                    self.exposition.title = expositionJSON.title;
                    self.exposition.markdownInput = expositionJSON.markdown;
                    self.exposition.style = expositionJSON.style;
                    self.mde.exposition = self.exposition;

                    // DEBUG
                    console.log(expositionJSON);

                    if (expositionJSON.metadata != undefined) {
                        try {
                            let metadataObj = JSON.parse(expositionJSON.metadata);
                            self.exposition.contentVersion = metadataObj.contentVersion;
                        } catch (err) {
                            alert("Could not parse editor metadata: " + err);
                        }
                    } else {
                        self.exposition.contentVersion = 0;
                    }

                    // DEBUG
                    console.log(self.exposition);

                    // it is safe to save, because loading was successful
                    self.canBeSaved = true;

                    if (continueFunction != undefined) {
                        continueFunction();
                    }
                }
                catch (err) {
                    alert("JSON parse failed, please contact RC support\n error message: \n" + err + "\nhttp response:\n" + xhttp.responseText);
                }
            }
        };
        xhttp.open("GET", `${Backend.rcBaseAddress}text-editor/load?research=${id}&weave=${weave}`, true);
        xhttp.send();
    }


    // continue function is only being called after successfully saving
    saveToRC(displayStatus: boolean = true, continueFunction?: () => void) {
        this.getRemoteContentVersion(remoteVersion => {
            // DEBUG
            console.log("save callback starting");

            let upcomingVersion = this.exposition.contentVersion + (this.mde.saved ? 0 : 1); // Saved will be false if there has been a change to the content
            let confirmedSave = true;

            // DEBUG
            console.log(`remote version: ${remoteVersion}`);
            console.log(`upcoming version: ${upcomingVersion}`);

            if ((remoteVersion >= upcomingVersion) && !this.rtConnection) {
                if (!window.confirm("The exposition is about to be saved. However, it has been changed somewhere else. Do you still whish to save your version and overwrite the remote version?")) {
                    confirmedSave = false
                }
            }

            // Only save if it can be saved and markdown input is neither null nor undefined
            if (confirmedSave && this.canBeSaved && (this.exposition.markdownInput !== null) && (this.exposition.markdownInput !== undefined) && (this.exposition.markdownInput !== "")) {
                let id = this.exposition.id;
                let weave = this.exposition.currentWeave;
                let fd = new FormData();
                let self = this;
                fd.append("html", this.exposition.renderedHTML);
                fd.append("markdown", this.exposition.markdownInput);
                fd.append("media", this.exposition.serializeMedia()); // TODO send media list/see if necessary
                fd.append("style", this.exposition.style);
                fd.append("title", this.exposition.title);
                fd.append("metadata", JSON.stringify({
                    "editorversion": this.editorVersion,
                    "contentVersion": upcomingVersion
                }));

                // console.log(fd);

                try {
                    fd.append("toc", JSON.stringify(this.exposition.getTOC()));
                }
                catch (err) {
                    alert("please contact rc support, error is:\n" + err);
                }

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        self.mde.saved = true;
                        self.exposition.contentVersion = upcomingVersion;
                        if (displayStatus) {
                            self.mde.displaySaveStatus();
                        }
                        if (continueFunction != undefined) {
                            continueFunction();
                        }
                    } else {
                        //console.log("xhttp state:", xhttp);
                    }
                };
                xhttp.open("POST", `${Backend.rcBaseAddress}text-editor/save?research=${id}&weave=${weave}`, true);
                // DEBUG
                // console.log(fd);
                xhttp.send(fd);
            }
            // DEBUG
            else {
                console.log(`confirmed: ${confirmedSave} canbeSaved: ${this.canBeSaved} null:${this.exposition.markdownInput !== null} undefined:${this.exposition.markdownInput !== undefined}  empty:${this.exposition.markdownInput !== ""}`);
            }
        })

    }


    // Not used when RC is backend:
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


    //////// Real-time editing

    shareDBConnect() {
        let self = this;
        let socket = new WebSocket('wss://' + 'doebereiner.org:8999');

        // initial message
        socket.onopen = function (event) {
            let msg = {
                message: "open exposition",
                id: String(self.exposition.id),
                markdown: self.exposition.markdownInput
            };
            socket.send(JSON.stringify(msg));
        };

        socket.onmessage = function (event) {
            if (event.data == "exposition created") {
                let connection = new sharedb.Connection(socket);

                let doc = connection.get('expositions', String(self.exposition.id));

                let cm = self.mde.codemirror;

                var shareDBCodeMirror = new ShareDBCodeMirror(cm, { verbose: true, key: 'content' });
                shareDBCodeMirror.attachDoc(doc, (error) => {
                    if (error) {
                        console.log("attachdocerror");
                        console.error(error);
                    } else {
                        self.rtConnection = true;
                    }
                });
            } else {
                console.log("got the following data");
                console.log(event.data);
            }
        }

        socket.onclose = function (event) {
            self.rtConnection = false;
        };
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


        // LOAD EXPOSITION DATA and afterwards call SYNCMODEL which afterwards RENDERS
        // load data
        this.loadExpositionData(() => {
            // sync media model with rc
            this.syncModelWithRC(() => {
                // render again
                self.mde.value(self.exposition.markdownInput);
                self.mde.render();
            })
        });

        // save every 12 seconds if needs to be saved
        this.saveInterval = setInterval(() => {
            if (document.hasFocus() && !self.mde.saved) {
                console.log("save - " + Utils.dateAndTimeString())
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
        }, 30000);

        // tab/browser visbility and reload
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                console.log('document is coming into visibility')

                self.getRemoteContentVersion(remoteVersion => {
                    if (remoteVersion > self.exposition.contentVersion) {
                        if (window.confirm("The exposition has been changed somewhere else. Do you whish to reload the content and possibly lose your changes?")) {

                            // LOAD EXPOSITION DATA and afterwards call SYNCMODEL which afterwards RENDERS
                            // load data
                            self.loadExpositionData(() => {
                                // sync media model with rc
                                self.syncModelWithRC(() => {
                                    // render again
                                    self.mde.value(self.exposition.markdownInput);
                                    self.mde.render();
                                    self.mde.saved = true;
                                    self.mde.displaySaveStatus();
                                })

                            });

                        }
                    }
                });

                // self.syncModelWithRC(() => {
                //     // render again
                //     self.mde.value(self.exposition.markdownInput);
                //     self.mde.render();
                // });

            } else {
                console.log('document is going into hidden visibility')
                if (!self.mde.saved) {
                    self.saveToRC();
                    self.mde.displaySaveStatus();
                } else {
                    console.log("not saving hding expo because there have been no changes.")
                }
            }
        })


        // Open WebSocket connection to ShareDB server
        // experimental
        setTimeout(() => self.shareDBConnect(), 1000);
    }
}
