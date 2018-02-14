import { Component, OnInit } from '@angular/core';
import { RCExpositionModel } from '../shared/RC-exposition-model.service';
import { TextToolData } from '../shared/tools/text-tooldata';
import { SortablejsModule } from 'angular-sortablejs';

@Component({
  selector: 'app-object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.css'],
})
export class ObjectListComponent implements OnInit {
  /*
   * This expositionObjects should be a reference to the model object, but that somehow doesn't work, see ngOnInit() 
   */
  expositionObjects = [];

  constructor( private rcExpoModel : RCExpositionModel ) { }

  createTextTool($event) {
  	this.rcExpoModel.addTool( 'text' );
  }

  renderAll() {
    this.rcExpoModel.render();
  }

  removeAll() {
    this.rcExpoModel.reset();
  }

  ngOnInit() {
    // here I assing the expositionObjects, but modifying it doesn't update the model ?
    this.expositionObjects = this.rcExpoModel.expositionObjects;
  }
}
