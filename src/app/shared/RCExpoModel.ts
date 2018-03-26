import { RCExposition } from './rcexposition';
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
    background-color: #FFFFFF;
    font-family: \"Helvetica\", sans-serif;
    font-size: 100%; 
    line-height: 125%; 
} 

.exposition-content {
    margin: 40px;
}

.rcimage {
    margin:10px 0px;
}

.rcimage img {
	max-width: 100%;
}

h2, h3, h4 ,h5 ,h6 {
    font-size:14px;
    font-weight: bold;
}
`;
 
        this.exposition = new RCExposition('How to use this editor', ['authors'], defaultStyle, 1200);
    }

    loadExpositionFromURL = function (expositionJSONUrl: string) {
        console.log('this will load the exposition from: '+ expositionJSONUrl);
        var xhttp = new XMLHttpRequest();
        var that = this;
        xhttp.onreadystatechange = function ( ) {
        if (this.readyState == 4 && this.status == 200) {
                console.log(that,'that');
            // Typical action to be performed when the document is ready:
                console.log("response has arrived!",xhttp.responseText);
                var mde = that.rcExpoModel.mde;
                mde.importDocJSON(xhttp.responseText);
                console.log(that.rcExpoModel);
            }
        };
        console.log("starting request, with url:", expositionJSONUrl);
        xhttp.open("GET", expositionJSONUrl, true);
        xhttp.send();    

    }

}
