import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, ShoppingCart, Users, Mail, MousePointerClick } from "lucide-react";
import { CartAbandonmentTracker } from "../lib/cartAbandonment";
import { AffiliateTracker } from "../lib/affiliateTracking";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  averageOrderValue: number;
  abandonedCarts: number;
  recoveredCarts: number;
  emailsSent: number;
  affiliateClicks: number;
  affiliateConversions: number;
  affiliateCommissions: number;
}

export function ReportingDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    abandonedCarts: 0,
    recoveredCarts: 0,
    emailsSent: 0,
    affiliateClicks: 0,
    affiliateConversions: 0,
    affiliateCommissions: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Get abandoned cart stats
    const abandonedCarts = CartAbandonmentTracker.getAbandonedCarts();
    const recoveredCarts = abandonedCarts.filter((c) => c.recovered).length;
    const emailsSent = abandonedCarts.reduce((sum, c) => sum + c.emailsSent, 0);

    // Get affiliate stats
    const affiliates = AffiliateTracker.getAffiliates();
    const totalClicks = affiliates.reduce((sum, a) => sum + a.clicks, 0);
    const totalConversions = affiliates.reduce((sum, a) => sum + a.conversions, 0);
    const totalCommissions = affiliates.reduce((sum, a) => sum + a.totalCommission, 0);

    // Mock order data (in production, this would come from Shopify)
    const mockOrders = 47;
    const mockRevenue = 12847.50;

    setStats({
      totalRevenue: mockRevenue,
      totalOrders: mockOrders,
      conversionRate: mockOrders > 0 ? ((mockOrders / (mockOrders + abandonedCarts.length)) * 100) : 0,
      averageOrderValue: mockOrders > 0 ? mockRevenue / mockOrders : 0,
      abandonedCarts: abandonedCarts.length,
      recoveredCarts,
      emailsSent,
      affiliateClicks: totalClicks,
      affiliateConversions: totalConversions,
      affiliateCommissions: totalCommissions,
    });
  };

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    trend 
  }: { 
    icon: any; 
    title: string; 
    value: string; 
    subtitle?: string; 
    trend?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-purple-100 rounded-lg p-3">
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
        {trend && (
          <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your store's performance and growth metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            trend="+12.5%"
          />
          <StatCard
            icon={ShoppingCart}
            title="Total Orders"
            value={stats.totalOrders.toString()}
            subtitle={`$${stats.averageOrderValue.toFixed(2)} avg order value`}
          />
          <StatCard
            icon={TrendingUp}
            title="Conversion Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            trend="+3.2%"
          />
          <StatCard
            icon={Users}
            title="Active Customers"
            value="234"
            trend="+8.1%"
          />
        </div>

        {/* Cart Abandonment Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Mail className="w-6 h-6 text-purple-600" />
            Cart Abandonment Recovery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Abandoned Carts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.abandonedCarts}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Recovered Carts</p>
              <p className="text-3xl font-bold text-green-600">{stats.recoveredCarts}</p>
              <p className="text-sm text-gray-500">
                {stats.abandonedCarts > 0 
                  ? `${((stats.recoveredCarts / stats.abandonedCarts) * 100).toFixed(1)}% recovery rate`
                  : "0% recovery rate"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Emails Sent</p>
              <p className="text-3xl font-bold text-purple-600">{stats.emailsSent}</p>
            </div>
          </div>
        </div>

        {/* Affiliate Program Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MousePointerClick className="w-6 h-6 text-purple-600" />
            Affiliate Program
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.affiliateClicks}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Conversions</p>
              <p className="text-3xl font-bold text-green-600">{stats.affiliateConversions}</p>
              <p className="text-sm text-gray-500">
                {stats.affiliateClicks > 0
                  ? `${((stats.affiliateConversions / stats.affiliateClicks) * 100).toFixed(1)}% conversion rate`
                  : "0% conversion rate"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Commissions</p>
              <p className="text-3xl font-bold text-purple-600">
                ${stats.affiliateCommissions.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Top Affiliates Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Affiliates</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Code</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Clicks</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Conversions</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Commission</th>
                </tr>
              </thead>
              <tbody>
                {AffiliateTracker.getAffiliates().slice(0, 5).map((affiliate) => (
                  <tr key={affiliate.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{affiliate.name}</td>
                    <td className="py-3 px-4 text-sm font-mono text-purple-600">{affiliate.code}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{affiliate.clicks}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{affiliate.conversions}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                      ${affiliate.totalCommission.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
