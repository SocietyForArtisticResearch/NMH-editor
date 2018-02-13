import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RCExpositionModel } from '../shared/RC-exposition-model.service';
import { tinymceDefaultSettings } from 'angular-tinymce';
import { TinyMceModule } from 'angular-tinymce';

import { TextToolData } from '../shared/tools/text-tooldata';

/*
 * Text tool editor (using tinymce) component
 */

@Component({
  selector: 'app-text-tool',
  templateUrl: './text-tool.component.html',
  styleUrls: ['./text-tool.component.css']
})
export class TextToolComponent implements OnInit {
  response:string = '';
  static count:number = 0;
  textContent:string = '';
  
  customTinyMCESettings = <any>{};

  @Input() identity: string;

  constructor(private rcExpoModel : RCExpositionModel ) {

  }

  onTrash() {
    /*
     * Directly remove this on the model, model will result in object list view update.
     */
    this.rcExpoModel.trashToolWithID(this.identity);
  }

  onChange($event) {  
    this.rcExpoModel.updateTextToolWithIdAndContent(this.identity,this.textContent)
  }

  ngOnInit() {
    // customize the tinymce plugin:
    let settings = tinymceDefaultSettings();
    settings.height = '300px';
    settings.branding = false;
    settings.statusbar = false;    
    this.customTinyMCESettings = settings;
  }
}
