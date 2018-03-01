import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConvertDocServiceService {

	constructor(private http: HttpClient) {
	
	}

    download(markdown: string) { //get file from service
	        this.http.post("http://localhost:3000/convert", JSON.stringify(model), {
	        method: RequestMethod.Post,
	        responseType: ResponseContentType.Blob,
	        headers: new Headers({'Content-Type', 'application/x-www-form-urlencoded'})
	    }).subscribe(
	        (response) => { // download file
	            var blob = new Blob([response.blob()], {type: 'application/pdf'});
	            var filename = 'file.pdf';
	            saveAs(blob, filename);
	    });
	}
}
