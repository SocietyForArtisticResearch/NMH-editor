/*

import { Backend } from './Backend';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';


@Injectable()
export class RCBackend {
	// default arguments:
	copyrightholder: string = 'not defined';
	description: string = 'none';
	research: string = '266367'; // TODO remove this testvalue

	constructor(private http: HttpClient) { }

	uploadFile(fileList, mediaType, onResult : ( httpEvent:  any ) => void, onProgress: ( ) => string) {

		/*
		 * uploads a file to RC, and takes a callback to return the result.
		 * add media: https://dev.researchcatalogue.net/text-editor/simple-media-add?research=32350 
		 * (POST) mit {mediatype=video|image|audio|pdf, media=FILE, name=XXX, copyrightholder=XXX, description=XXX}
		 */ 
/*
		if (fileList.length > 0) {
	        let selectedFile = fileList[0];

	        const fd = new FormData();
	        fd.append('research','266367');
	        fd.append('mediatype', mediaType);
	        fd.append('media', selectedFile);
	        fd.append('copyrightholder', 'author name');
	        fd.append('description','');

	        let uploadApiUrl = Backend.rcBaseAddress + 'text-editor/simple-media-add';

	        const req = new HttpRequest('POST', uploadApiUrl, fd, {
	            reportProgress: true,
	        });

	        this.http.request(req).subscribe(event => {
	            // Via this API, you get access to the raw event stream.
	            // Look for upload progress events.
	            if (event.type === HttpEventType.UploadProgress) {
	                // This is an upload progress event. Compute and show the % done:
	                onProgress('uploading ' + Math.round(100 * event.loaded / event.total) + '%');
	            } else if (event instanceof HttpResponse) {
	                this.fileUploadStatus = 'done';
	                window.setTimeout(() => { onProgress(''); }, 1000);
	                onResult(event.body);
	            }
	        });
	    }
    }
}
*/