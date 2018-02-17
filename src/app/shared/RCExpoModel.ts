import { RCExposition, RCGrid, RCWeave } from '../../../node_modules/rcexposition/src/rcexposition';

/** This is a class to provide MNH specific needs for RCExposition 
 * The class construct a fully specified RCExposition object 
 * (Because DI cannot call arguments on a constructor 
 * ,unless they are injected dependencies of the service module themselves).
 */
export class  RCExpoModel {
	exposition: RCExposition;

	constructor ( ) {
    	// number of Y cells should be updated by number of tools).
	    let grid = new RCGrid(1,1,true);
	    let weave = new RCWeave(grid,'default',[]);

	    this.exposition = new RCExposition('myExpo','authors',null,[weave],1200);
	}
}