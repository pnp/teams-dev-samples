// This was created to convert Azure Functions Response to Bot Builder's WebResponse using Garry Trinder's code from:
// https://raw.githubusercontent.com/garrytrinder/msteams-base-bot-azfunc/main/bot/src/internal/responseWrapper.ts

import { WebResponse } from "botbuilder";

// A wrapper to convert Azure Functions Response to Bot Builder's WebResponse.
export class ResponseWrapper implements WebResponse {
    socket: any;
    originalResponse?: any;
    body?: any;

    constructor(functionResponse?: { [key: string]: any }) {
        this.socket = undefined;
        this.originalResponse = functionResponse;
    }

    header(name: string, value: string | string[]) {
        // call Azure Functions' res.header().
        return this.originalResponse?.header(name, value);
    }

    end(...args: any[]) {
        // do nothing since res.end() is deprecated in Azure Functions.
    }

    send(body: any) {
        // record the body to be returned later.
        this.body = body;
        this.originalResponse.body = body;
    }

    status(status: number) {
        // call Azure Functions' res.status().
        return this.originalResponse?.status(status);
    }

}