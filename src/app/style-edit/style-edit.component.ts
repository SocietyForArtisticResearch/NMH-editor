import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { RCExpoModel } from "../shared/RCExpoModel";

declare var CodeMirror;

@Component({
  selector: 'app-style-edit',
  templateUrl: './style-edit.component.html',
  styleUrls: ['./style-edit.component.css']
})
export class StyleEditComponent implements AfterViewInit {
 	@ViewChild('styleEditBox') textarea: ElementRef;

 	stylesheet : string = '';

    constructor(private rcExpoModel: RCExpoModel) { }


    ngAfterViewInit() {
      	var editor = new CodeMirror.fromTextArea(this.textarea.nativeElement, {
        	mode: "text/css",
      	});
        editor.focus();
    }
}
