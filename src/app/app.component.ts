import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';

import { RCExpoModel } from './shared/RCExpoModel';
import { RCBackendMediaUpload } from './shared/RCBackendMediaUpload';
import { RCMDE, insertMediaToken, insertMedia } from './shared/rcmde';
import { RCImage, RCAudio, RCSvg, RCPdf, RCVideo } from './shared/rcexposition';
import { ObjectListComponent } from './object-list/object-list.component';
import { MarkdownToolComponent } from './tools/markdown-tool/markdown-tool.component';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';





@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [RCExpoModel, RCBackendMediaUpload],
    host: { '(window:keydown)': 'hotkeys($event)' },
})
export class AppComponent implements OnInit {
    @HostListener('window:beforeunload', ['$event'])
    respondToUnload($event) {
        if (!this.rcExpoModel.mde.saved) {
            $event.returnValue = 'are you sure you want to leave';
        }
        // if no value is provided, event will pass silently
    }
    // rcExpoModel is injected into this compenent (and all its children through their constructors !)
    showMedia: boolean = false;
    showImport: boolean = false;
    editStyle: boolean = false;
    version: string = "1.0.8";
    loadedExpositionURL$: Observable<any>;
    styleButtonMessage: string = "Edit style";
    hostname: string = location.hostname;

    @ViewChild(ObjectListComponent) objectList: ObjectListComponent;
    @ViewChild(MarkdownToolComponent) markdownEditor: MarkdownToolComponent;

    constructor(
        public rcExpoModel: RCExpoModel,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    onMediaButton() {
        this.showMedia = !this.showMedia;
        if (this.objectList) {
            this.objectList.whenOpened();
        }
        if (this.showMedia) {
            var element = window.document.getElementById('mediaPanel');
            element.focus();
        }
    }

    toggleStyle() {
        this.editStyle = !this.editStyle;
        this.styleButtonMessage = this.editStyle ? "Edit style" : "Edit style";
        //	this.styleButtonMessage = this.editStyle ? "Edit text" : "Edit style";
    }

    onChangedObject(identity) {
        let rcobject = this.rcExpoModel.exposition.getObjectWithID(identity);
        let editor: RCMDE = this.rcExpoModel.mde;
        this.objectList.onChangedObject(identity); // to update selected tool to newest in the object list.
        insertMedia(editor, rcobject.name);
    }

    closeMedia() {
        this.showMedia = false;
        this.markdownEditor.refocus();
    }

    hotkeys(event) {
        // on escape key, close windows
        if (event.keyCode === 27) {
            if (this.showImport) {
                this.showImport = false;
            }
            if (this.showMedia) {
                this.showMedia = false;
            }
            if (this.editStyle) {
                this.editStyle = false;
            }
        }
    }

    getParam(param) {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var params = url[i].split("=");
            if (params[0] == param)
                return params[1];
        }
        return '';
    }

    ngOnInit() {
        /* this was an attempt to use the angular router to grab an ExpositionURL 
          this.loadedExpositionURL$ = this.route.params
          .pipe(switchMap((params: Params) =>
                {
                    console.log("these are the params :",params);
                    let url = params.get('expositionUrl')
                     rcExpoModel.loadExpositionFromURL(url)
                 })); */
        let url = this.getParam('expositionUrl');
        let rcId = this.getParam('research');
        let weave = this.getParam('weave');

        if (rcId) {
            let rcIdNumber = Number(decodeURIComponent(rcId));
            let weaveNumber = Number(decodeURIComponent(weave));
            this.rcExpoModel.loadExpositionFromRC(rcIdNumber, weaveNumber);
        } else if (url) {
            url = decodeURIComponent(url);
            this.rcExpoModel.loadExpositionFromURL(url);
        }
    }

    shouldHideBecauseModalIsVisible() {
        if (this.showMedia || this.showImport || this.editStyle) {
            return true;
        }
        return false;
    }

    forceRender() {
        this.rcExpoModel.mde.forceRender();
    }


}
