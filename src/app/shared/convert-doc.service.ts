import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { Backend } from '../shared/Backend';

// Trying a proper module this time.

@Injectable()
export class ConvertDocService {

    constructor(private http: HttpClient) {

    }

    convert(markdownString: string, fileType: string, statusCallback : (status: string) => void ) { //get file from service
        //        let url = "https://sar-announcements.com:3000/export/" + fileType;
        //        console.log("CONVERTING");
        //      console.log(markdownString);
        let url :string = null;
        if (Backend.useRC) {
            url = Backend.rcExport + '?type=' + fileType;
        }

        var data = { markdown: markdownString };
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.responseType = "blob";
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function() {
             if (xhr.readyState === 4) {
                 let file = xhr.response; //Outputs a DOMString by default
                 FileSaver.saveAs(file, "convert." + fileType); 
                 statusCallback("complete");    
             }
        };
    }

        /*
        let url;
        const fd = new FormData();
        
        fd.append('markdown',encodeURIComponent(markdownString));

        if (Backend.useRC) {
            url = Backend.rcExport '?type=' + fileType;
        } else {
            url = Backend.sarExport + fileType;
        };

        //let expositionJson = { markdown: markdownString };
        let headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });


        const options = {
            headers,
            responseType: 'blob' as 'text'
        };

        this.http.post(url, fd, options).subscribe(
            (response: any) => { // download file
                console.log(response);
                let filename = 'file.' + fileType;
                FileSaver.saveAs(response, filename);
            });
    }
    */



}
