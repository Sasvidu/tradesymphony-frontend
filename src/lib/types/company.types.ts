export interface Company {
    name: string;
    ticker: string;
    industry: {
      sector: string;
      subIndustry: string;
    };
    metadata: {
      founded: string | null;
      headquarters: string | null;
    };
    investmentThesis: {
      recommendation: 'Buy' | 'Hold' | 'Sell';
      conviction: 'High' | 'Medium-High' | 'Medium' | 'Low';
      keyDrivers: string[];
      expectedReturn: {
        value: number;
        timeframe: string;
      };
      riskAssessment: {
        level: string;
        factors: string[];
      };
      monitoringTriggers: string[];
    };
    quantitativeData: {
      valuationMetrics: {
        marketCap: number | null;
        peRatio: number | null;
        pbRatio: number | null;
      };
      growthRates: {
        revenueGrowth: {
          value: number | null;
          timeframe: string | null;
        };
      };
      financialRatios: {
        profitMargin: {
          value: number | null;
          unit: string;
        };
      };
      riskMetrics: {
        probability: number | null;
        impact: number | null;
      };
    };
  }