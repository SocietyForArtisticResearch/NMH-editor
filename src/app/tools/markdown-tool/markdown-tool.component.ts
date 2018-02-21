import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { RCExpoModel } from '../../shared/RCExpoModel';

declare var SimpleMDE : any;

@Component({
	selector: 'app-markdown-tool',
	templateUrl: './markdown-tool.component.html',
 	styleUrls: ['./markdown-tool.component.css']
})
export class MarkdownToolComponent implements AfterViewInit {
	@ViewChild('simplemde') textarea : ElementRef;

	@Input() text: string;
	@Input() identifier: number;

	content: string;
	mde: any;

	constructor(private rcExpoModel: RCExpoModel) { }

	onKeyup() {
		this.rcExpoModel.exposition.updateRCTextWithIdAndContent(
			this.identifier,
			this.mde.value()
			);
	}

	ngAfterViewInit() {
		this.mde = new SimpleMDE({
			element: this.textarea.nativeElement,
			showIcons: ["code", "table"],
			spellChecker: false
		});
		this.mde.codemirror.on("keyHandled",( ) => { console.log('hallo')});
	};
}
