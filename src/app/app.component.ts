import { Component } from '@angular/core';
import { RCExpositionModel } from './shared/RC-exposition-model.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [RCExpositionModel]
})
export class AppComponent {
	// rcExpoModel is injected into this compenent (and all its children through their constructors !)
	constructor( private rcExpoModel : RCExpositionModel) {

	}

	exposition = {};
}
