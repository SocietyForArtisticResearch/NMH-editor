import { RCExposition, RCExpositionDeserializer } from './rcexposition';
import { Backend } from "./Backend"
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

        let defaultStyle = '';

        this.exposition = new RCExposition('', ['authors'], defaultStyle);
    }

    // Luc: why not simply method?
    loadExpositionFromURL = function (expositionJSONUrl: string) {
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
        console.log("getting rc media");
        // TODO get json from RC!
        // get media-list
        var xhttp = new XMLHttpRequest();
        var that = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var mde = that.mde;
                console.log("response: " + xhttp.response);
                let medialist = JSON.parse(xhttp.responseText);
                that.exposition.id = id;
                that.exposition.integrateRCMediaList(medialist);
                console.log(that.exposition.media);
            } else {
                console.log("fail response: " + xhttp.response);
            }
        };
        console.log(`${Backend.rcBaseAddress}text-editor/simple-media-list?research=${id}`);
        xhttp.open("GET", `${Backend.rcBaseAddress}text-editor/simple-media-list?research=${id}`, true);
        xhttp.send();
        console.log("sent request");
    }

}
