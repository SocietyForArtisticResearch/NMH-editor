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

        let defaultStyle = '';

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
