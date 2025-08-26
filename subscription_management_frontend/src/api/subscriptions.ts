import axios from 'axios';
import { Subscription, CreateSubscriptionData, UpdateSubscriptionData, UpcomingRenewal, SubscriptionSummary, AIInsight } from '../types';

export const subscriptionsApi = {
  // Subscription CRUD
  getSubscriptions: async (): Promise<Subscription[]> => {
    const response = await axios.get('/api/subscriptions/');
    return response.data;
  },

  getSubscription: async (id: number): Promise<Subscription> => {
    const response = await axios.get(`/api/subscriptions/${id}/`);
    return response.data;
  },

  createSubscription: async (data: CreateSubscriptionData): Promise<Subscription> => {
    const response = await axios.post('/api/subscriptions/', data);
    return response.data;
  },

  updateSubscription: async (id: number, data: UpdateSubscriptionData): Promise<Subscription> => {
    const response = await axios.put(`/api/subscriptions/${id}/`, data);
    return response.data;
  },

  deleteSubscription: async (id: number): Promise<void> => {
    await axios.delete(`/api/subscriptions/${id}/`);
  },

  // Analytics endpoints with error handling for backend issues
  getUpcomingRenewals: async (): Promise<UpcomingRenewal[]> => {
    try {
      const response = await axios.get('/analytics/upcoming-renewals/');
      return response.data;
    } catch (error) {
      console.error('Upcoming renewals API error (expected due to backend field name mismatch):', error);
      // Fallback: get subscriptions and filter client-side
      const subscriptions = await subscriptionsApi.getSubscriptions();
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      return subscriptions
        .filter(sub => {
          const renewalDate = new Date(sub.renewal_date);
          return renewalDate >= today && renewalDate <= nextWeek;
        })
        .map(sub => ({
          id: sub.id,
          service_name: sub.service_name,
          cost: sub.cost,
          renewal_date: sub.renewal_date,
          days_until_renewal: Math.ceil((new Date(sub.renewal_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        }));
    }
  },

  getSubscriptionSummary: async (): Promise<SubscriptionSummary> => {
    try {
      const response = await axios.get('/analytics/summary/');
      return response.data;
    } catch (error) {
      console.error('Subscription summary API error (expected due to backend field name mismatch):', error);
      // Fallback: calculate from subscriptions
      const subscriptions = await subscriptionsApi.getSubscriptions();
      const totalSubscriptions = subscriptions.length;
      const monthlyTotal = subscriptions
        .filter(sub => sub.billing_cycle === 'monthly')
        .reduce((sum, sub) => sum + parseFloat(sub.cost), 0);
      const yearlyTotal = subscriptions
        .filter(sub => sub.billing_cycle === 'yearly')
        .reduce((sum, sub) => sum + parseFloat(sub.cost), 0);
      const averageCost = subscriptions.length > 0 
        ? subscriptions.reduce((sum, sub) => sum + parseFloat(sub.cost), 0) / subscriptions.length 
        : 0;

      return {
        total_subscriptions: totalSubscriptions,
        monthly_total: monthlyTotal.toFixed(2),
        yearly_total: yearlyTotal.toFixed(2),
        average_cost: averageCost.toFixed(2)
      };
    }
  },

  getAIInsights: async (): Promise<AIInsight[]> => {
    try {
      const response = await axios.get('/analytics/ai-suggestions/');
      return response.data;
    } catch (error) {
      console.error('AI insights API error:', error);
      // Fallback: provide generic insights
      return [
        {
          type: 'cost_optimization',
          message: 'Consider reviewing your subscription costs regularly to optimize spending.',
          priority: 'medium' as const
        }
      ];
    }
  }
};