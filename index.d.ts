export interface NemoAPIResponseObject {
    uri: string;
    hash: string;
    modelType: string;
    [param: string]: any;
}

export interface NemoAPIResponse {
    [modelURI: string]: NemoAPIResponseObject;
}

type NemoAPIParser = (response: NemoAPIResponse) => NemoAPIResponse;

export default NemoAPIParser;
