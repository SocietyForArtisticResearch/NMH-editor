import { Component, OnInit } from '@angular/core';
import { RCExpositionModel } from '../shared/RC-exposition-model.service';

/*
 * This is the actual exposition, just by creating a <div id='weave'> in .html file
 */

@Component({
  selector: 'app-expo-preview',
  templateUrl: './expo-preview.component.html',
  styleUrls: ['./expo-preview.component.css']
})
export class ExpoPreviewComponent implements OnInit {

  constructor( private rcExpoModel : RCExpositionModel ) { }


  ngOnInit() {

  }

}
