import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart as LineChartIcon, Brain, Award } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Layout } from '../../components/layout/Layout';
import { useMarketTrends } from '../../hooks/useAnalytics';

const PIE_COLORS = ['#5d768b', '#c8b39b', '#f59e0b', '#22c55e', '#8b5cf6'];

const PROPERTY_TYPE_DATA = [
  { name: 'Villa', value: 34 },
  { name: 'Land', value: 28 },
  { name: 'Apartment', value: 22 },
  { name: 'Comm. Private', value: 11 },
  { name: 'Comm. Govt', value: 5 },
];

const DISTRICT_TABLE = [
  { district: 'Jubilee Hills', avgSale: '₹1.12 Cr', avgRental: '₹38K/mo', transactions: 24, growth: '+7.4%', score: 92 },
  { district: 'Banjara Hills', avgSale: '₹95L', avgRental: '₹32K/mo', transactions: 18, growth: '+5.2%', score: 87 },
  { district: 'Madhapur', avgSale: '₹78L', avgRental: '₹28K/mo', transactions: 31, growth: '+9.1%', score: 89 },
  { district: 'Kondapur', avgSale: '₹62L', avgRental: '₹22K/mo', transactions: 27, growth: '+6.8%', score: 84 },
  { district: 'Gachibowli', avgSale: '₹71L', avgRental: '₹25K/mo', transactions: 22, growth: '+8.3%', score: 86 },
];

const ANALYST_INSIGHTS = [
  'Jubilee Hills demonstrates highest price-to-rental yield ratio in Hyderabad district at 3.8x — ideal for long-term investors.',
  'Dispute-to-transaction ratio in Khairtabad mandal is 0.12, significantly below city average of 0.31, indicating clear title quality.',
  'Development permit activity in the area signals upcoming supply expansion — recommending monitor for buy-side opportunities in Q2.',
  'Ownership transfer velocity has increased 23% QoQ — retail investor sentiment remains bullish for premium residential segments.',
  'Cross-referencing 5-year historical data: current prices are within 8% of algorithmic fair value — no bubble risk detected.',
];

export default function AnalysisHub() {
  const [selectedMonths, setSelectedMonths] = useState(6);
  const { data: trends } = useMarketTrends('Hyderabad', selectedMonths);

  const lineData = (trends ?? []).map(t => ({
    month: t.month,
    'Sale Price (₹L)': Math.round((t.avgSalePrice ?? 0) / 100000),
    'Rental Yield (₹K)': Math.round((t.avgRentalPrice ?? 0) / 1000),
  }));

  return (
    <Layout title="Analysis Hub" breadcrumbs={[{ label: 'Functions' }, { label: 'Analysis Hub' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#5d768b' }}>
            <LineChartIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis Hub</h2>
            <p className="text-gray-500">Professional market intelligence for real estate analysts</p>
          </div>
          <div className="ml-auto">
            <select className="form-input py-2 text-sm" value={selectedMonths} onChange={e => setSelectedMonths(Number(e.target.value))}>
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
            </select>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Market Health Score', value: '92/100', badge: 'Excellent', color: '#22c55e' },
            { label: 'Price Stability Index', value: '87/100', badge: 'Stable', color: '#5d768b' },
            { label: 'Liquidity Score', value: '78/100', badge: 'Good', color: '#f59e0b' },
            { label: 'Title Clarity Index', value: '95/100', badge: 'High', color: '#8b5cf6' },
          ].map((card, idx) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
              className="liquid-glass rounded-2xl p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: card.color }}>{card.badge}</span>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 liquid-glass rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Price Trend Analysis — Jubilee Hills</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Sale Price (₹L)" stroke="#5d768b" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Rental Yield (₹K)" stroke="#c8b39b" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="liquid-glass rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Property Type Mix</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={PROPERTY_TYPE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                  {PROPERTY_TYPE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* District Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="liquid-glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Neighbourhood Comparison — Hyderabad West</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Neighbourhood</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Avg Sale</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Avg Rental</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Transactions</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Growth</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Invest Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DISTRICT_TABLE.map((row, idx) => (
                  <motion.tr key={row.district} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + idx * 0.04 }} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.district}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.avgSale}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.avgRental}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.transactions}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">{row.growth}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${row.score}%`, backgroundColor: '#5d768b' }} />
                        </div>
                        <span className="text-sm font-bold text-gray-700">{row.score}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="liquid-glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">AI Analyst Insights</h3>
              <p className="text-sm text-gray-500">Machine-generated intelligence from Functions 1-5 data</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ANALYST_INSIGHTS.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-gray-100">
                <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
