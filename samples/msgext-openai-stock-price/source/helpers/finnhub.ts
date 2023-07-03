import axios from 'axios';
import { IQuote } from '../interfaces';

const callFinnhub = async (symbol: string) => {
    try {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getQuote = async (symbol: string): Promise<IQuote> => {
    const data = await callFinnhub(symbol);
    return {
        open: data.o,
        high: data.h,
        low: data.l,
        current: data.c,
        latestUpdate: data.t,
        change: data.d,
        changePercent: data.dp
    }
}

export { getQuote };