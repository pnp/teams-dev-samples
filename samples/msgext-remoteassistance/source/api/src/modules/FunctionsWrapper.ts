// This was created to convert Azure Functions v4 Model Responses and Requests to Bot Builder's. 
// This based on Garry Trinder's code:
// https://raw.githubusercontent.com/garrytrinder/msteams-base-bot-azfunc/main/bot/src/internal/responseWrapper.ts
import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { WebRequest, WebResponse } from "botbuilder";

// A wrapper to convert Azure Functions Response to Bot Builder's WebResponse.
export class ResponseWrapper implements WebResponse {
    socket: any;
    originalResponse: HttpResponseInit;
    body?: any;

    constructor(functionResponse?: HttpResponseInit) {
        this.socket = undefined;
        this.originalResponse = functionResponse;
    }

    header(name: string, value: string | string[]) {
        // call Azure Functions' res.header().
        return this.originalResponse.headers = {
            ...this.originalResponse.headers,
            [name]: value
        };
    }

    end(...args: any[]) {
        // do nothing since res.end() is deprecated in Azure Functions.
    }

    send(body: any) {
        // record the body to be returned later.
        this.body = body;
        this.originalResponse.jsonBody = body;
    }

    status(status: number) {
        // call Azure Functions' res.status().
        return this.originalResponse.status = status;
    }

}

// A wrapper to convert Azure Functions Request to Bot Builder's WebRequest.
export class RequestWrapper implements WebRequest {

    body?: any;
    headers: any;
    method?: any;
    query?: any;
    params?: any;
    url?: any;
    originalRequest: HttpRequest;

    constructor(functionRequest: HttpRequest) {
        this.originalRequest = functionRequest;

        this.headers = {};
        for (const header of functionRequest.headers.entries()) {
            this.headers = {
                ...this.headers,
                [header[0]]: header[1]
            };
        }
        this.method = functionRequest.method;
        this.query = {};
        for (const query of functionRequest.query.entries()) {
            this.query = {
                ...this.query,
                [query[0]]: query[1]
            };
        }
        this.params = functionRequest.params;
        this.url = functionRequest.url;
    }

    async readBodyAsync(): Promise<void> {
        this.body = await this.originalRequest.json();
    }

}