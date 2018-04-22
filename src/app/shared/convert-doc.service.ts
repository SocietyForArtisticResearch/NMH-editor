import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { Backend } from '../shared/Backend';

// Trying a proper module this time.

@Injectable()
export class ConvertDocService {

    constructor(private http: HttpClient) {

    }

    convert(markdownString: string, fileType: string) { //get file from service
        //        let url = "https://sar-announcements.com:3000/export/" + fileType;
        console.log(markdownString);

        let url;
        if (Backend.useRC) {
            url = Backend.rcExport + "?type=" + fileType + "&markdown=" + encodeURIComponent(markdownString);
        } else {
            url = Backend.sarExport + fileType;
        };
        let expositionJson = { markdown: markdownString };
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });


        const options = {
            headers,
            responseType: 'blob' as 'text'
        };

        this.http.post(url, expositionJson, options).subscribe(
            (response: any) => { // download file
                console.log(response);
                let filename = 'file.' + fileType;
                FileSaver.saveAs(response, filename);
            });
    }
}
