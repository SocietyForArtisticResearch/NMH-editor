import { Component } from '@angular/core';
import { RCExpoModel } from '../../node_modules/rcexposition/src/rcexposition';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [ RCExpoModel ]
})
export class AppComponent {
	// rcExpoModel is injected into this compenent (and all its children through their constructors !)
	constructor( private rcExpoModel : RCExpoModel ) {

	}
}
