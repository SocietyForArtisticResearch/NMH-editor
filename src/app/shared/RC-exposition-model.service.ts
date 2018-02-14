import { TextToolData } from './tools/text-tooldata';

declare var RCText: any;
declare var RCExposition: any;
declare var RCGrid: any;
declare var RCWeave: any;
declare var RCImage: any;

export class RCExpositionModel {
	/**
	 * @prop objectCounter { integer }
	 */ 

    expositionObjects = [];
    objectCounter = 0;

	constructor ( ) {

	}

	reset( ) {
		this.expositionObjects = [];
		this.render();
	}
 
	render() {
		let list = [];
		for (let i = 0;i<this.expositionObjects.length;i++) {
			let object = this.expositionObjects[i];
			let rcObj = new RCText(object.identity,1,i+1,object.textContent);
			list.push( rcObj );
		}

		// define grid
		let grid = new RCGrid(1,list.length);

		// create a weave
		let weave1 = new RCWeave(grid, "w1", list);

		// create exposition
		let exposition = new RCExposition("This is JS !", ["David Bowie"], "", [weave1]);
		exposition.renderResponsive();

	}

	updateTextToolWithIdAndContent(id: string, textContent: string) {
		let tool = this.toolWithID(id);
		tool.textContent = textContent;
		this.render();
	}

	toolWithID(id: string) {
		/**
		 * finds a tool with a certain id in the object list.
		 * @param { string } id  HTML identifier as in <tag id="myIdentifier">
		 */
		let filtered = this.expositionObjects.filter( ( object ) => { return object.identity === id } );
		if (filtered.length > 0) {
			return filtered[0]; 
		}
		alert('found nothing');
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
    	 * Adds a tool, based on string. 
    	 */
    	this.objectCounter = this.objectCounter + 1;
 
		let tool = {};
		
		switch(type) {
    		case 'text':
    			let identity = 'text-tool-editbox-' + this.objectCounter;
    			tool = new TextToolData(this.objectCounter,identity,'');
    			break;
    		   // here will come other tools:

    		default:
    			tool = {};
    	}
    	
    	this.expositionObjects.push(tool);
    }	

	renderTest() {
		/*
		 * just to see if the library works, taken from RCLang examples.
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
}