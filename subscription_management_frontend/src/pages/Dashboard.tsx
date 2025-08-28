import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscriptionsApi } from '../api/subscriptions';
import { UpcomingRenewal, SubscriptionSummary, Subscription } from '../types';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [upcomingRenewals, setUpcomingRenewals] = useState<UpcomingRenewal[]>([]);
  const [summary, setSummary] = useState<SubscriptionSummary | null>(null);
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [renewalsData, summaryData, subscriptionsData] = await Promise.all([
        subscriptionsApi.getUpcomingRenewals(),
        subscriptionsApi.getSubscriptionSummary(),
        subscriptionsApi.getSubscriptions(),
        subscriptionsApi.getUsers(),
      ]);
      
      setUpcomingRenewals(renewalsData);
      setSummary(summaryData);
      setAllSubscriptions(subscriptionsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.role === 'admin') {
    return <AdminDashboard subscriptions={allSubscriptions} />;
  }

  return (
    <UserDashboard 
      upcomingRenewals={upcomingRenewals}
      summary={summary}
      subscriptions={allSubscriptions}
    />
  );
};

const AdminDashboard: React.FC<{ subscriptions: Subscription[] }> = ({ subscriptions }) => {
  const navigate = useNavigate();
  
  // Calculate admin metrics
  const totalSubscriptions = subscriptions.length;
  // const totalUsers = new Set(subscriptions.map(sub => sub.user)).size;
  const totalUsers = users.filter(u => u.role === "user").length;
  const totalSpending = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.cost || '0'), 0);
  
  // Get upcoming renewals for all users
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const systemUpcomingRenewals = subscriptions
    .filter(sub => {
      const renewalDate = new Date(sub.renewal_date);
      return renewalDate >= today && renewalDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.renewal_date).getTime() - new Date(b.renewal_date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            System overview and management
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex space-x-3">
          <button
            onClick={() => navigate('/users')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New User
          </button>
          <button
            onClick={() => navigate('/subscriptions')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            View All Subscriptions
          </button>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Subscriptions</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalSubscriptions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">System Spending</dt>
                  <dd className="text-lg font-medium text-gray-900">${totalSpending.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Upcoming Renewals */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">System Upcoming Renewals</h3>
            <span className="text-sm text-gray-500">Next 7 days</span>
          </div>
          
          {systemUpcomingRenewals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming renewals in the next 7 days</p>
          ) : (
            <div className="space-y-3">
              {systemUpcomingRenewals.slice(0, 5).map((renewal) => (
                <div key={renewal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-amber-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{renewal.service_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(renewal.renewal_date).toLocaleDateString()} 
                        ({renewal.days_until_renewal} days)
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">${renewal.cost}</span>
                </div>
              ))}
              
              {systemUpcomingRenewals.length > 5 && (
                <button
                  onClick={() => navigate('/subscriptions')}
                  className="w-full text-center py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all {systemUpcomingRenewals.length} upcoming renewals
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserDashboard: React.FC<{
  upcomingRenewals: UpcomingRenewal[];
  summary: SubscriptionSummary | null;
  subscriptions: Subscription[];
}> = ({ upcomingRenewals, summary, subscriptions }) => {
  const navigate = useNavigate();
  
  const sharedSubscriptions = subscriptions.filter(sub => sub.is_shared);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your subscriptions and spending
          </p>
        </div>
        <button
          onClick={() => navigate('/subscriptions?action=create')}
          className="mt-4 lg:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Subscription
        </button>
      </div>

      {/* Personal Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Subscriptions</dt>
                    <dd className="text-lg font-medium text-gray-900">{summary.total_subscriptions}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Monthly Total</dt>
                    <dd className="text-lg font-medium text-gray-900">${summary.monthly_total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Yearly Total</dt>
                    <dd className="text-lg font-medium text-gray-900">${summary.yearly_total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Cost</dt>
                    <dd className="text-lg font-medium text-gray-900">${summary.average_cost}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Upcoming Renewals */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Renewals</h3>
              <span className="text-sm text-gray-500">Next 7 days</span>
            </div>
            
            {upcomingRenewals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No upcoming renewals</p>
            ) : (
              <div className="space-y-3">
                {upcomingRenewals.map((renewal) => (
                  <div key={renewal.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{renewal.service_name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(renewal.renewal_date).toLocaleDateString()} 
                          ({renewal.days_until_renewal} days)
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">${renewal.cost}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Shared Subscriptions Preview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Shared Subscriptions</h3>
              <button
                onClick={() => navigate('/subscriptions')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all
              </button>
            </div>
            
            {sharedSubscriptions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No shared subscriptions available</p>
            ) : (
              <div className="space-y-3">
                {sharedSubscriptions.slice(0, 3).map((subscription) => (
                  <div key={subscription.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{subscription.service_name}</p>
                      <p className="text-sm text-gray-500">Shared by admin</p>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      ${subscription.cost}/{subscription.billing_cycle}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
