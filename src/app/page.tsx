'use client';

import { motion } from 'framer-motion';
import { Company } from '@/lib/types/company.types';
import investmentData from '@/lib/investment.json';
import CompanyCard from '@/components/CompanyCard';

const companies = investmentData.companies as Company[];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            TradeSymphony Dashboard
          </motion.h1>
          <p className="text-gray-400">AI-Powered Investment Analysis</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company: Company, index) => (
            <motion.div
              key={company.ticker}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <CompanyCard company={company} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}