import { AdaptiveCardInvokeResponse } from "botbuilder";

/**
 * Creates an Adaptive Card Invoke Response.
 * @param statusCode - The status code of the response.
 * @param body - The body of the response.
 * @returns The Adaptive Card Invoke Response.
 */
export const CreateAdaptiveCardInvokeResponse = (statusCode: number, body?: Record<string, unknown>): AdaptiveCardInvokeResponse => {
    return {
        statusCode: statusCode,
        type: 'application/vnd.microsoft.card.adaptive',
        value: body
    };
};

/**
 * Creates an Action Error Response.
 * @param statusCode - The status code of the response.
 * @param errorCode - The error code of the response. Default value is -1.
 * @param errorMessage - The error message of the response. Default value is 'Unknown error'.
 * @returns The Action Error Response.
 */
export const CreateActionErrorResponse = (statusCode: number, errorCode: number = -1, errorMessage: string = 'Unknown error') => {
    return {
        statusCode: statusCode,
        type: 'application/vnd.microsoft.error',
        value: {
            error: {
                code: errorCode,
                message: errorMessage,
            },
        },
    };
};