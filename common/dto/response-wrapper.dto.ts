export class ResponseWrapperDto < T > {
    messagge: string;
    result: T;
    constructor(result: T, messagge: string) {
        this.messagge = messagge;
        this.result = result;
    }
}