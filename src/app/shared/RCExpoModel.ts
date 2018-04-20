import { RCExposition, RCExpositionDeserializer } from './rcexposition';
import { Backend } from "./Backend";
import { RCMDE } from './rcmde';


/** This is a class to provide MNH specific needs for RCExposition 
 * The class construct a fully specified RCExposition object 
 * (Because DI cannot call arguments on a constructor 
 * ,unless they are injected dependencies of the service module themselves).
 */
export class RCExpoModel {
    exposition: RCExposition;
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

        this.exposition = new RCExposition('', ['authors'], defaultStyle);
    }

    syncModelWithRC() {
        let id = this.exposition.id;
        var xhttp = new XMLHttpRequest();
        var that = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var mde = that.mde;
                let medialist = JSON.parse(xhttp.responseText);
                that.exposition.integrateRCMediaList(medialist);
                console.log(that.exposition.media);
            }
        };
        //        console.log(`${Backend.rcBaseAddress}text-editor/simple-media-list?research=${id}`);
        xhttp.open("GET", `${Backend.rcBaseAddress}text-editor/simple-media-list?research=${id}`, true);
        xhttp.send();
        //      console.log("sent request");
    }

    loadExpositionFromURL(expositionJSONUrl: string) {
        Backend.useRC = false;
        console.log('this will load the exposition from: ' + expositionJSONUrl);
        var xhttp = new XMLHttpRequest();
        var that = this; // the wonderfully messed up way scoping works
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var mde = that.mde;
                let expositionJSON = JSON.parse(xhttp.responseText);
                //  console.log(expositionJSON);
                let exposition = RCExpositionDeserializer.restoreObject(expositionJSON);
                //  console.log(exposition);
                exposition.media.forEach(m => m.html = undefined);
                that.exposition = exposition;
                mde.exposition = exposition;
                //          console.log(exposition.markdownInput);
                that.mde.value(exposition.markdownInput);
                that.mde.render();
            }
        };
        console.log("starting request, with url:", expositionJSONUrl);
        xhttp.open("GET", expositionJSONUrl, true);
        xhttp.send();
    }

    loadExpositionFromRC(id: number) {
        Backend.useRC = true;
        // TODO get json from RC!
        // get media-list
        let new_exposition = new RCExposition('', ['authors'], '');
        new_exposition.id = id;
        this.exposition = new_exposition;

        this.syncModelWithRC();

        //        this.mde.exposition = new_exposition;
        //      this.mde.value(new_exposition.markdownInput);
        //    this.mde.render();

    }
}
