import { Component, OnInit } from '@angular/core';
import { RCExpoModel, RCExposition, RCGrid, RCWeave } from '../../node_modules/rcexposition/src/rcexposition';



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
		// number of Y cells should be updated by number of tools).
        let grid = new RCGrid(1,1,true);
        let weave = new RCWeave(grid,'default',[]);

        this.rcExpoModel.exposition = new RCExposition('myExpo','authors',null,[weave],1200);
	}
}
