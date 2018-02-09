declare function NemoAPI(response: NemoAPI.Response): NemoAPI.Response;

declare namespace NemoAPI {
    interface ResponseObject {
        uri: string;
        hash: string;
        modelType: string;
        [param: string]: any;
    }

    interface Response {
        [modelURI: string]: ResponseObject;
    }
}

export = NemoAPI;
