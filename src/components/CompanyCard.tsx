'use client';

import { Company } from '@/lib/types/company.types';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const recommendationColor = {
    Buy: 'text-green-400',
    Hold: 'text-yellow-400',
    Sell: 'text-red-400',
  }[company.investmentThesis.recommendation];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white">{company.name}</h2>
          <p className="text-gray-400">{company.ticker}</p>
        </div>
        <span className={`${recommendationColor} font-semibold`}>
          {company.investmentThesis.recommendation}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-300">
          Sector: {company.industry.sector}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">Risk Level:</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            company.investmentThesis.riskAssessment.level === 'High' 
              ? 'bg-red-500/20 text-red-300'
              : company.investmentThesis.riskAssessment.level === 'Moderate'
              ? 'bg-yellow-500/20 text-yellow-300'
              : 'bg-green-500/20 text-green-300'
          }`}>
            {company.investmentThesis.riskAssessment.level}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Expected Return</h3>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">
            {company.investmentThesis.expectedReturn.value}%
          </span>
          <span className="text-sm text-gray-400">
            in {company.investmentThesis.expectedReturn.timeframe}
          </span>
        </div>
      </div>

      {/* Stock Chart placeholder - To be implemented with real data */}
      <div className="h-32 bg-gray-700/30 rounded-lg mt-4">
        {/* Chart will go here */}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Key Drivers</h3>
        <div className="flex flex-wrap gap-2">
          {company.investmentThesis.keyDrivers.map((driver, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-700/30 rounded-full text-xs text-gray-300"
            >
              {driver}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}