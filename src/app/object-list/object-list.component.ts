import { Component, OnInit } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';

import { RCExpoModel } from '../shared/RCExpoModel';
import { RCText, RCExposition } from '../../../node_modules/rcexposition/src/rcexposition';


@Component({
  selector: 'app-object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.css'],
})
export class ObjectListComponent implements OnInit {
  eventOptions = {
    onUpdate: ( event ) => { 
      console.log(event.oldIndex);
      console.log(event.newIndex);
      console.log('event');
      this.rcExpoModel.exposition.renderResponsiveOnce();
    }
  }

  constructor( private rcExpoModel : RCExpoModel ) { }

  createTextTool() {
    //name, gridX, gridY, text, width = 1, height = 1, userClass, tocDepth
    let textObject = new RCText('myText', 0, 0, '' , 1, 1, 'myClass',1);
  	this.rcExpoModel.exposition.addObject(textObject, 0);
  }

  renderAll() {
    this.rcExpoModel.exposition.renderResponsiveOnce();
  }

  removeAll() {
    this.rcExpoModel.exposition.weaves[0].objects = [];
  }

  ngOnInit() {
    // here I assing the expositionObjects, but modifying it doesn't update the model ?
  }
}
