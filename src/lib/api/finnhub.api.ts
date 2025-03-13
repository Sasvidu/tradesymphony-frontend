export interface StockQuote {
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketOpen: number;
  regularMarketPreviousClose: number;
}

export interface StockCandles {
  timestamp: number[];
  close: number[];
  high: number[];
  low: number[];
  open: number[];
  volume: number[];
}

const YAHOO_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  const response = await fetch(
    `/api/stock/quote?symbol=${symbol}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch stock quote");
  }
  return response.json();
};

export const getStockCandles = async (symbol: string): Promise<StockCandles> => {
  const response = await fetch(
    `/api/stock/history?symbol=${symbol}&range=3mo&interval=1d`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch stock candles");
  }
  return response.json();
};