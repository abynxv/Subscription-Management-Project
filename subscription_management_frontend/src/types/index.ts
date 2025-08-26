export interface User {
  id: number;
  email: string;
  username?: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
}

export interface Subscription {
  id: number;
  service_name: string;
  cost: string;
  billing_cycle: 'monthly' | 'yearly' | 'weekly';
  renewal_date: string;
  notes?: string;
  is_shared: boolean;
  user?: number;
  user_email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSubscriptionData {
  service_name: string;
  cost: string;
  billing_cycle: 'monthly' | 'yearly' | 'weekly';
  renewal_date: string;
  notes?: string;
}

export interface UpdateSubscriptionData extends CreateSubscriptionData {
  is_shared?: boolean;
}

export interface UpcomingRenewal {
  id: number;
  service_name: string;
  cost: string;
  renewal_date: string;
  days_until_renewal: number;
}

export interface SubscriptionSummary {
  total_subscriptions: number;
  monthly_total: string;
  yearly_total: string;
  average_cost: string;
}

export interface AIInsight {
  type: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}