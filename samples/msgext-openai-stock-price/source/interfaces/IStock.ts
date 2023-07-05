import { IQuote } from ".";

export interface IStock {
    symbol: string;
    companyName: string;
    primaryExchange: string;
    quote: IQuote;
    summary: string;
}