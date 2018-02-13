import { TextToolData } from './tools/text-tooldata';

export class RCExpositionModel {
	/**
	 * 
	 */ 

    expositionObjects = [];
    objectCounter = 0;

	constructor ( ) {

	}

	renderTest() {
		/*
		 * taken from RCLang examples.
		 */
		// define objects
		let ob1 = new RCText("text tool 1", 1, 1, "hello world");
		let ob2 = new RCImage("leonardo", 1, 2, "assets/rclang/tests/media/leonardo.jpg");
		let ob3 = new RCText("text tool 2", 2, 2, "some more *stuff*");

		// an object in the same cell as ob3 (will be fused)
		let ob4 = new RCText("text tool 3", 2, 2, "and even more **stuff**");

		// define grid
		let grid = new RCGrid(2,2);

		// create a weave
		let weave1 = new RCWeave(grid, "w1", [ob1, ob2, ob3, ob4]);

		// create exposition
		let exposition = new RCExposition("title of expo", ["Jane Doe"], "", [weave1]);

		// render
		exposition.renderResponsive();
	}

	updateTextToolWithIdAndContent(id: string, textContent: string) {
		let tool = toolWithID(id);
		tool.textContent = textContent;
	}

	toolWithID(id: string) {
		let filtered = this.expositionObjects.filter( ( object ) => { object.identity === id } );
		if (filtered.length > 0) {
			return filtered[0]; 
		}
		return false;
	}

	trashToolWithID(id: string) {
		/**
		 *  Drops objects based on 
		 *  @param {string} id - HTML identifier as in <tag id="myIdentifier">
		 */

		this.expositionObjects = this.expositionObjects.filter( (object) => { 
			return object.identity !== id } ); 
	}

	//
    addTool ( type: string ) {
    	/**
    	 * Adds an 
    	 */
    	this.objectCounter = this.objectCounter + 1;
 
		let tool = {};
		
		switch(type) {
    		case 'text':
    			let identity = 'text-tool-editbox-' + this.objectCounter;
    			tool = new TextToolData(this.objectCounter,identity,'');
    			break;
    		default:
    			tool = {};
    	}
    	
    	this.expositionObjects.push(tool);
    }	
}