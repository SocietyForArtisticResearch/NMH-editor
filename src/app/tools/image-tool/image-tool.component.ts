import { Component, OnInit, Input } from '@angular/core';
import { RCExpoModel } from '../../shared/RCExpoModel';
import { RCImage } from '../../shared/rcexposition';

// THIS OBJECT IS OBSOLETE (porbably)...

@Component({
    selector: 'app-image-tool',
    templateUrl: './image-tool.component.html',
    styleUrls: ['./image-tool.component.css']
})
export class ImageToolComponent implements OnInit {
    @Input() identifier: number;

    id: string;

    imageUrl: string = 'myUrl';
    pxWidth: number = 100;
    pxHeight: number = 100;

    constructor(private rcExpoModel: RCExpoModel) { }

    ngOnInit() {
        this.id = 'imageTool-' + this.identifier;
    }

    updateModel() {
        var object: RCImage = <RCImage>this.rcExpoModel.exposition.getObjectWithID(this.identifier);
        object.url = this.imageUrl;
        object.pxWidth = this.pxWidth;
        object.pxHeight = this.pxHeight;
    }

}
