import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Shield, Star, Brain, Eye, ArrowUpRight, Bookmark } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Layout } from '../../components/layout/Layout';
import { useDashboardStats, useMarketTrends } from '../../hooks/useAnalytics';

const WATCHLIST = [
  { id: 'JH-001', label: 'Plot 12, Road No. 12, Jubilee Hills', type: 'Land', area: '450 sqyd', price: '₹1.35 Cr', change: '+4.2%', trend: 'up', roi: '12.3%', risk: 'Low' },
  { id: 'JH-002', label: 'Villa 5A, Jubilee Hills Phase II', type: 'Villa', area: '3,200 sqft', price: '₹4.8 Cr', change: '+6.7%', trend: 'up', roi: '8.9%', risk: 'Low' },
  { id: 'JH-003', label: 'Apt 302, Jubilee Towers', type: 'Apartment', area: '1,850 sqft', price: '₹92L', change: '+3.1%', trend: 'up', roi: '9.4%', risk: 'Very Low' },
  { id: 'JH-004', label: 'Commercial Unit B, Road No. 8', type: 'Commercial', area: '2,400 sqft', price: '₹1.8 Cr', change: '-1.2%', trend: 'down', roi: '11.2%', risk: 'Medium' },
  { id: 'JH-005', label: 'Plot 45, Jubilee Hills Extension', type: 'Land', area: '600 sqyd', price: '₹1.92 Cr', change: '+5.8%', trend: 'up', roi: '14.1%', risk: 'Low' },
];

const AI_INVESTOR_INSIGHTS = [
  'Jubilee Hills prime plots showing 12-14% annual appreciation — outperforming Hyderabad market by 3.2%.',
  'Zero dispute records in JH-PLOT-001 to JH-PLOT-005 range — clear title, safe for immediate investment.',
  'Rental yield in Jubilee Hills: 4.1% gross, 3.3% net — competitive with fixed income alternatives.',
  'Administrative transparency (5-level approval chain) ensures no ghost transactions or fraudulent ownership.',
];

const RISK_COLOR: Record<string, string> = {
  'Very Low': 'text-green-700 bg-green-100',
  'Low': 'text-emerald-700 bg-emerald-100',
  'Medium': 'text-amber-700 bg-amber-100',
  'High': 'text-red-700 bg-red-100',
};

export default function InvestorPortal() {
  const [selectedMonths, setSelectedMonths] = useState(6);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const { data: stats } = useDashboardStats();
  const { data: trends } = useMarketTrends('Hyderabad', selectedMonths);

  const areaData = (trends ?? []).map(t => ({
    month: t.month,
    value: Math.round((t.avgSalePrice ?? 0) / 100000),
  }));

  const totalPortfolioValue = '₹8.92 Cr';
  const totalGain = '+₹1.24 Cr';
  const gainPercent = '+16.1%';

  return (
    <Layout title="Investor Portal" breadcrumbs={[{ label: 'Functions' }, { label: 'Investor Portal' }]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#5d768b' }}>
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Investor Portal</h2>
            <p className="text-gray-500">Real estate investment intelligence — powered by verified government data</p>
          </div>
        </div>

        {/* Portfolio Summary — Zerodha/Groww style */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Portfolio Value</p>
              <p className="text-4xl font-bold text-gray-900">{totalPortfolioValue}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-semibold text-green-600">{totalGain}</span>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">{gainPercent}</span>
                <span className="text-sm text-gray-400">all time</span>
              </div>
            </div>
            <select className="form-input py-2 text-sm" value={selectedMonths} onChange={e => setSelectedMonths(Number(e.target.value))}>
              <option value={3}>3M</option>
              <option value={6}>6M</option>
              <option value={12}>1Y</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5d768b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5d768b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}L`} />
              <Tooltip formatter={v => [`₹${v}L avg sale`, 'Market Price']} />
              <Area type="monotone" dataKey="value" stroke="#5d768b" strokeWidth={2.5} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active RE Records', value: stats?.totalReRecords ?? 0, icon: <Eye className="w-4 h-4" />, color: '#5d768b' },
            { label: 'Approved Sales', value: stats?.approvedSaleTransactions ?? 0, icon: <TrendingUp className="w-4 h-4" />, color: '#22c55e' },
            { label: 'Clear Titles', value: Math.max(0, (stats?.totalReRecords ?? 0) - (stats?.pendingDisputes ?? 0)), icon: <Shield className="w-4 h-4" />, color: '#3b82f6' },
            { label: 'Avg ROI (1Y)', value: '11.4%', icon: <Star className="w-4 h-4" />, color: '#f59e0b' },
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
              className="liquid-glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: stat.color }}>
                  {stat.icon}
                </div>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Watchlist — stock-style */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="liquid-glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Investment Watchlist — Jubilee Hills</h3>
            <span className="text-xs text-gray-400">RENEXT verified properties</span>
          </div>
          <div className="divide-y divide-gray-50">
            {WATCHLIST.map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + idx * 0.04 }}
                className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">{item.id}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">{item.type}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate mt-0.5">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.area}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">{item.price}</p>
                    <p className={`text-sm font-medium flex items-center gap-1 justify-end ${item.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                      {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {item.change}
                    </p>
                  </div>
                  <div className="text-right w-20">
                    <p className="text-xs text-gray-500">ROI (est.)</p>
                    <p className="text-sm font-bold text-green-700">{item.roi}</p>
                  </div>
                  <div className="w-20 text-right">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RISK_COLOR[item.risk] ?? ''}`}>{item.risk}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => setBookmarked(prev => { const n = new Set(prev); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; })}
                      className={`p-1.5 rounded-lg transition-colors ${bookmarked.has(item.id) ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}>
                      <Bookmark className="w-4 h-4" fill={bookmarked.has(item.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Investor Protection + AI Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="liquid-glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#3b82f6' }}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Investor Protection — How RENEXT Safeguards You</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-gray-700">
              {[
                '5-level administrative approval chain ensures every property has clear, verified title before listing.',
                'Zero Trust Architecture cryptographically seals all ownership records — retroactive tampering is impossible.',
                'Dispute records surface automatically — any contested property is flagged before your investment.',
                'Brokerage price caps enforced by system — no hidden agent fees above registered rates.',
                'All transaction pricing is auditable by Revenue Department — no dark market pricing.',
                'Real-time alerts for properties entering dispute or encumbrance status.',
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="liquid-glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5d768b' }}>
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">AI Investment Engine</h3>
            </div>
            <div className="space-y-3">
              {AI_INVESTOR_INSIGHTS.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/70 border border-gray-100">
                  <div className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#5d768b' }}>
                    {idx + 1}
                  </div>
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
