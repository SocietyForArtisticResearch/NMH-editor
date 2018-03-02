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
    mde :any;

    constructor() {
        // number of Y cells should be updated by number of tools).

        let defaultStyle = `.exposition {
    background-color: #FFFFFF;
    font-family: \"Georgia\", serif;
    font-size: 120%; 
    line-height: 150%; 
} 

.exposition-content {
    margin: 40px;
}

.rcimage {
    margin:10px;
}`;

        this.exposition = new RCExposition('My First Exposition', ['authors'], defaultStyle, 1200);
    }

}
