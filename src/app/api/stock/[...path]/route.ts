import { NextRequest, NextResponse } from "next/server";

const YAHOO_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path[0];
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    let url: string;
    if (path === 'quote') {
      url = `${YAHOO_BASE_URL}/${symbol}?interval=1d&range=1d`;
    } else if (path === 'history') {
      const range = searchParams.get('range') || '3mo';
      const interval = searchParams.get('interval') || '1d';
      url = `${YAHOO_BASE_URL}/${symbol}?interval=${interval}&range=${range}`;
    } else {
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (path === 'quote') {
      const quote = data.chart.result[0].meta;
      return NextResponse.json({
        regularMarketPrice: quote.regularMarketPrice,
        regularMarketChange: quote.regularMarketPrice - quote.previousClose,
        regularMarketChangePercent: ((quote.regularMarketPrice - quote.previousClose) / quote.previousClose) * 100,
        regularMarketDayHigh: quote.regularMarketDayHigh,
        regularMarketDayLow: quote.regularMarketDayLow,
        regularMarketOpen: quote.regularMarketOpen,
        regularMarketPreviousClose: quote.previousClose,
      });
    } else {
      const candles = data.chart.result[0];
      return NextResponse.json({
        timestamp: candles.timestamp,
        close: candles.indicators.quote[0].close,
        high: candles.indicators.quote[0].high,
        low: candles.indicators.quote[0].low,
        open: candles.indicators.quote[0].open,
        volume: candles.indicators.quote[0].volume,
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Yahoo Finance" },
      { status: 500 }
    );
  }
}