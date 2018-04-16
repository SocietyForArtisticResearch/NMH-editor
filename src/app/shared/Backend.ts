/*
 * This is a class to centralize server settings.
 */

export class Backend {
    static baseAddress: string = "https://sar-announcements.com:3000/";
    static uploadAddress: string = "https://sar-announcements.com:3000/uploadAngular";
    static import: string = "https://sar-announcements.com:3000/import";

    static rcMediaUpload: string = "https://dev.researchcatalogue.net/text-editor/simple-media-add";
    static rcBaseAddress: string = "https://dev.researchcatalogue.net/";


    // set if RC is to be used as backend
    static useRC: boolean = false;
}
