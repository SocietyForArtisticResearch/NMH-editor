

import { Backend } from './Backend';
import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { RCExpoModel } from './RCExpoModel';

@Injectable()
export class RCBackendMediaUpload {
	// default arguments:
	copyrightholder: string = 'not defined';
	description: string = 'none';
	research: string = '266367'; // TODO remove this testvalue

	constructor(
		private http: HttpClient,
		private rcExpoModel: RCExpoModel
	) { }

	uploadFile(fileList, mediaType, onResult : ( httpEvent:  any ) => void, onProgress: ( progress: string  ) => void) {

		/*
		 * uploads a file to RC, and takes a callback to return the result.
		 * add media: https://dev.researchcatalogue.net/text-editor/simple-media-add?research=32350 
		 * (POST) mit {mediatype=video|image|audio|pdf, media=FILE, name=XXX, copyrightholder=XXX, description=XXX}
		 */ 

		if (fileList.length > 0) {
	        let selectedFile = fileList[0];

	        let uploadApiUrl = Backend.rcMediaUpload;
	        let expositionId = this.rcExpoModel.exposition.id;
	        let author = this.rcExpoModel.exposition.authors[0];


	        var fd = new FormData();
	        fd.append('mediatype', mediaType);
	        fd.append('name',selectedFile.name);
	        fd.append('media', selectedFile);
	        fd.append('copyrightholder', author );
	        fd.append('description','');

	        console.log('formdata',fd);


	        var req = new HttpRequest('POST', uploadApiUrl + '?research='+String(expositionId), fd, {
	            reportProgress: true
	        });

	        console.log('request',req);

	        this.http.request(req).subscribe(event => {
	            // Via this API, you get access to the raw event stream.
	            // Look for upload progress events.
	            if (event.type === HttpEventType.UploadProgress) {
	                // This is an upload progress event. Compute and show the % done:
	                onProgress('uploading ' + Math.round(100 * event.loaded / event.total) + '%');
	            } else if (event instanceof HttpResponse) {
	                onProgress('done');
	                window.setTimeout(() => { onProgress(''); }, 1000);
	                onResult(event.body);
	            }
	        });
	    }
    }
}
