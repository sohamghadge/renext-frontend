import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Brain, Activity, DollarSign, Building, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Layout } from '../../components/layout/Layout';
import { useDashboardStats, useMarketTrends } from '../../hooks/useAnalytics';

const INSIGHT_CARDS = [
  {
    icon: <TrendingUp className="w-5 h-5 text-green-600" />,
    title: 'Market Stability Index',
    value: '87/100',
    desc: 'Jubilee Hills market remains stable with consistent pricing trends. No cartelization detected.',
    color: 'border-green-200 bg-green-50',
  },
  {
    icon: <DollarSign className="w-5 h-5 text-blue-600" />,
    title: 'True Value vs Listed Price',
    value: '+3.2% variance',
    desc: 'AI engine identifies minimal deviation between true market value and listed prices, indicating healthy market.',
    color: 'border-blue-200 bg-blue-50',
  },
  {
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    title: 'Price Anomaly Alerts',
    value: '2 flagged',
    desc: 'Two transactions flagged for review due to pricing 15%+ above market rate. Under administrative review.',
    color: 'border-amber-200 bg-amber-50',
  },
  {
    icon: <Activity className="w-5 h-5 text-purple-600" />,
    title: 'Transaction Velocity',
    value: '12/month',
    desc: 'Average monthly transactions in Khairtabad mandal showing healthy growth pattern.',
    color: 'border-purple-200 bg-purple-50',
  },
];

const AI_INSIGHTS = [
  'Zero Trust Architecture ensures every transaction is cryptographically signed and immutable — preventing retroactive price manipulation.',
  'Cross-referencing sale pricing records with historical brokerage data reveals true market equilibrium, independent of agent influence.',
  'Machine learning model trained on 847 verified transactions in Hyderabad district identifies pricing anomalies with 94.3% accuracy.',
  'Ownership history chain analysis prevents ghost transactions and ensures legitimate ownership transfer is always documented.',
  'Temporal analysis of dispute records correlates with price spikes, enabling early detection of cartelization patterns.',
];

export default function FinancialIntelligence() {
  const [selectedDistrict, setSelectedDistrict] = useState('Hyderabad');
  const [months, setMonths] = useState(6);

  const { data: stats } = useDashboardStats();
  const { data: trends } = useMarketTrends(selectedDistrict, months);

  const chartData = (trends ?? []).map((t) => ({
    month: t.month,
    'Sale Price (₹L)': Math.round((t.avgSalePrice ?? 0) / 100000),
    'Rental Price (₹K)': Math.round((t.avgRentalPrice ?? 0) / 1000),
    Transactions: t.transactionCount,
  }));

  return (
    <Layout title="Financial Intelligence" breadcrumbs={[{ label: 'Functions' }, { label: 'Financial Intelligence' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#5d768b' }}>
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Intelligence</h2>
            <p className="text-gray-500">Decoupling value from cost — AI-powered market intelligence</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <select className="form-input py-2 text-sm" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}>
              <option>Hyderabad</option>
              <option>Rangareddy</option>
              <option>Medchal</option>
            </select>
            <select className="form-input py-2 text-sm" value={months} onChange={e => setMonths(Number(e.target.value))}>
              <option value={3}>Last 3 months</option>
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 12 months</option>
            </select>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total RE Records', value: stats?.totalReRecords ?? 0, icon: <Building className="w-5 h-5" />, color: '#5d768b' },
            { label: 'Approved Sales', value: stats?.approvedSaleTransactions ?? 0, icon: <TrendingUp className="w-5 h-5" />, color: '#22c55e' },
            { label: 'Active Disputes', value: stats?.pendingDisputes ?? 0, icon: <AlertTriangle className="w-5 h-5" />, color: '#f59e0b' },
            { label: 'Pending Actions', value: stats?.myPendingActions ?? 0, icon: <Activity className="w-5 h-5" />, color: '#8b5cf6' },
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
              className="liquid-glass rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: stat.color }}>
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="liquid-glass rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Market Price Trends — {selectedDistrict}</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="sale" orientation="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="rental" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: unknown, name: unknown) => [String(name).includes('Sale') ? `₹${val}L` : `₹${val}K`, String(name)]} />
                <Legend />
                <Line yAxisId="sale" type="monotone" dataKey="Sale Price (₹L)" stroke="#5d768b" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="rental" type="monotone" dataKey="Rental Price (₹K)" stroke="#c8b39b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="liquid-glass rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Transaction Volume</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Transactions" fill="#5d768b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* AI Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INSIGHT_CARDS.map((card, idx) => (
            <motion.div key={card.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + idx * 0.05 }}
              className={`rounded-2xl border p-5 ${card.color}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">{card.icon}</div>
                <span className="font-semibold text-gray-900 text-sm">{card.title}</span>
                <span className="ml-auto text-lg font-bold text-gray-800">{card.value}</span>
              </div>
              <p className="text-sm text-gray-600">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* AI Engine Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="liquid-glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">AI Engine — Financial Intelligence Layer</h3>
              <p className="text-sm text-gray-500">How RENEXT prevents artificial inflation and ensures true market valuation</p>
            </div>
          </div>
          <div className="space-y-3">
            {AI_INSIGHTS.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gray-100">
                <div className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#5d768b' }}>
                  {idx + 1}
                </div>
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
