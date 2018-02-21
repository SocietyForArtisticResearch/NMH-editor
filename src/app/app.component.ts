import { Component, OnInit } from '@angular/core';
import { RCExpoModel } from './shared/RCExpoModel';
import { RCText } from '../../node_modules/rcexposition/src/rcexposition';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [ RCExpoModel ]
})
export class AppComponent implements OnInit {
	// rcExpoModel is injected into this compenent (and all its children through their constructors !)
	constructor( private rcExpoModel : RCExpoModel ) {

	}

	ngOnInit() {
		//name, gridX, gridY, text, width = 1, height = 1, userClass, tocDepth
    	let textObject = new RCText('root', 0, this.rcExpoModel.exposition.weaves[0].objects.length, '' , 1, 1, 'myClass',1);
  		this.rcExpoModel.exposition.addObject(textObject, 0);
	}
}
