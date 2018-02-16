import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RCExpoModel }  from '../../../node_modules/rcexposition/src/rcexposition';
import { tinymceDefaultSettings } from 'angular-tinymce';
import { TinyMceModule } from 'angular-tinymce';

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
  name: string;
  textContent:string = '';
  customTinyMCESettings = <any>{};
  collapsed = false;

  @Input() identifier: number;

  constructor(private rcExpoModel : RCExpoModel ) {

  }

  onTrash() {
    /*
     * Directly remove this on the model, model change will automatically result in view update.
     */
    this.rcExpoModel.exposition.removeObjectWithID(this.identifier);
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
    this.rcExpoModel.exposition.updateRCTextWithIdAndContent(this.identifier,this.textContent);
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
