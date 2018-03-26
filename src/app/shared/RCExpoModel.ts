import { RCExposition, RCExpositionDeserializer } from './rcexposition';
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
 
        this.exposition = new RCExposition('', ['authors'], defaultStyle, 1200);
    }

    loadExpositionFromURL = function (expositionJSONUrl: string) {
        console.log('this will load the exposition from: '+ expositionJSONUrl);
        var xhttp = new XMLHttpRequest();
        var that = this; // the wonderfully messed up way scoping works
        xhttp.onreadystatechange = function ( ) {
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

}
