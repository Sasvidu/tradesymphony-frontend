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

export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  const response = await fetch(`/api/stock/quote?symbol=${symbol}`);
  if (!response.ok) {
    throw new Error("Failed to fetch stock quote");
  }
  return response.json();
};

export const getStockCandles = async (
  symbol: string,
  timeframe: "week" | "month" | "year"
): Promise<StockCandles> => {
  const range =
    timeframe === "week" ? "7d" : timeframe === "month" ? "3mo" : "1y";
  const response = await fetch(
    `/api/stock/history?symbol=${symbol}&range=${range}&interval=1d`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stock candles");
  }
  return response.json();
};
