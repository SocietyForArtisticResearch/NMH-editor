/*
 * This is a class to centralize server settings.
 */

export class Backend {
    static baseAddress: string = "https://sar-announcements.com:3000/";
    static uploadAddress: string = "https://sar-announcements.com:3000/uploadAngular";
    // TODO remove "import" as variable name, it is a reserved keyword, prefix with "sar"
    static import: string = "https://sar-announcements.com:3000/import";
    static sarExport: string = "https://sar-announcements.com:3000/export";


    static rcMediaUpload: string = "//" + location.hostname + "/text-editor/simple-media-add";
    static rcMediaRemove: string = "//" + location.hostname + "/text-editor/simple-media-remove";
    static rcMediaEdit: string = "//" + location.hostname + "/text-editor/simple-media-edit";
    static rcBaseAddress: string = "//" + location.hostname;
    static rcMediaList: string = "//" + location.hostname + "/text-editor/simple-media-list";
    static rcImport: string = "//" + location.hostname + "/text-editor/import";
    static rcExport: string = "//" + location.hostname + "/text-editor/export";


    // set if RC is to be used as backend
    static useRC: boolean = false;
}
