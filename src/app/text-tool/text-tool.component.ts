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
  // This is bound with [(ngModel)]
  textContent:string = '';
  customTinyMCESettings = <any>{};
  name:string = '';
  collapsed = false;

  @Input() identity: string;

  constructor(private rcExpoModel : RCExpositionModel ) {

  }

  onTrash() {
    /*
     * Directly remove this on the model, model change will automatically result in view update.
     */
    this.rcExpoModel.trashToolWithID(this.identity);
  }

  onChange($event) {  
    /* 
     * On change, is only after finished element in editor (pressing enter)
     */ 
    //this.rcExpoModel.updateTextToolWithIdAndContent(this.identity,this.textContent);
  }

  onKeyUp() {
    /* 
     *
     */
    this.rcExpoModel.updateTextToolWithIdAndContent(this.identity,this.textContent);
  }

  ngOnInit() {
    // customize the tinymce plugin, only assign once, otherwise goes nuts!
    let settings = tinymceDefaultSettings(); // <- contains important path instructions
    settings.height = '300px';
    settings.branding = false;
    settings.statusbar = false;    
    this.customTinyMCESettings = settings;
  }
}
