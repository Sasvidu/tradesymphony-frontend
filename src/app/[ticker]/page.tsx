"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useInvestmentStore } from "@/store/insights-store";
import { useThesisStore } from "@/store/thesis-store";
import CompanyCard from "@/components/CompanyCard";
import { Company } from "@/lib/types/company.types";
import { Thesis } from "@/lib/types/thesis.types";

export default function CompanyPage() {
  const { ticker } = useParams();
  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
    fetchInvestmentData,
  } = useInvestmentStore();
  const {
    theses,
    loading: thesesLoading,
    error: thesesError,
    fetchThesisData,
  } = useThesisStore();

  useEffect(() => {
    if (companies.length === 0 && !companiesLoading && !companiesError) {
      fetchInvestmentData();
    }
    if (theses.length === 0 && !thesesLoading && !thesesError) {
      fetchThesisData();
    }
  }, [
    companies,
    companiesLoading,
    companiesError,
    fetchInvestmentData,
    theses,
    thesesLoading,
    thesesError,
    fetchThesisData,
  ]);

  const company: Company | undefined = companies.find(
    (c) => c.ticker === ticker
  );
  const thesis: Thesis | undefined = theses.find((t) => t.ticker === ticker);

  if (companiesLoading || thesesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (companiesError || thesesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500">{companiesError || thesesError}</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Company not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            {company.name} ({company.ticker})
          </motion.h1>
          <p className="text-gray-400">Detailed Company Analysis</p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CompanyCard company={company} />
        </motion.div>

        {thesis && (
          <motion.div
            className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-4">
              Investment Thesis
            </h2>
            <p className="text-gray-300">{thesis.thesis}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
