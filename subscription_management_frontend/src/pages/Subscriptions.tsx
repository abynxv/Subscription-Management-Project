import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscriptionsApi } from '../api/subscriptions';
import { Subscription, CreateSubscriptionData, UpdateSubscriptionData } from '../types';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  Share,
  X
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Subscriptions: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    fetchSubscriptions();
    
    // Check if we should show create form from URL params
    if (searchParams.get('action') === 'create') {
      setShowForm(true);
      setSearchParams({}); // Clear the param
    }
  }, [searchParams, setSearchParams]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionsApi.getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError('Failed to fetch subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = async (data: CreateSubscriptionData) => {
    try {
      await subscriptionsApi.createSubscription(data);
      setSuccess('Subscription created successfully!');
      setShowForm(false);
      fetchSubscriptions();
    } catch (err: any) {
      const message = err.response?.data?.detail ||
                    err.response?.data?.message ||
                    'Failed to create subscription';
      setError(message);
    }
  };

  const handleUpdateSubscription = async (id: number, data: UpdateSubscriptionData) => {
    try {
      await subscriptionsApi.updateSubscription(id, data);
      setSuccess('Subscription updated successfully!');
      setEditingSubscription(null);
      fetchSubscriptions();
    } catch (err: any) {
      const message = err.response?.data?.detail ||
                    err.response?.data?.message ||
                    'Failed to update subscription';
      setError(message);
    }
  };

  const handleDeleteSubscription = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      await subscriptionsApi.deleteSubscription(id);
      setSuccess('Subscription deleted successfully!');
      fetchSubscriptions();
    } catch (err: any) {
      const message = err.response?.data?.detail ||
                    err.response?.data?.message ||
                    'Failed to delete subscription';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const userSubscriptions = subscriptions.filter(sub => !sub.is_shared);
  const sharedSubscriptions = subscriptions.filter(sub => sub.is_shared);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'All Subscriptions' : 'My Subscriptions'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {user?.role === 'admin' 
              ? 'Manage all system subscriptions' 
              : 'Manage your personal and shared subscriptions'
            }
          </p>
        </div>
        
        {user?.role === 'user' && !showForm && !editingSubscription && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 lg:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
            <button
              onClick={() => setSuccess('')}
              className="ml-auto text-green-400 hover:text-green-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Form */}
      {(showForm || editingSubscription) && (
        <SubscriptionForm
          subscription={editingSubscription}
          onSubmit={editingSubscription ? 
            (data) => handleUpdateSubscription(editingSubscription.id, data) :
            handleCreateSubscription
          }
          onCancel={() => {
            setShowForm(false);
            setEditingSubscription(null);
          }}
          isAdmin={user?.role === 'admin'}
        />
      )}

      {/* Subscriptions List */}
      {!showForm && !editingSubscription && (
        <>
          {user?.role === 'user' && (
            <>
              {/* User's Own Subscriptions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">My Subscriptions</h3>
                  {userSubscriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating your first subscription.
                      </p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subscription
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userSubscriptions.map((subscription) => (
                        <SubscriptionCard
                          key={subscription.id}
                          subscription={subscription}
                          canEdit={true}
                          canDelete={true}
                          onEdit={() => setEditingSubscription(subscription)}
                          onDelete={() => handleDeleteSubscription(subscription.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Shared Subscriptions */}
              {sharedSubscriptions.length > 0 && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shared Subscriptions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sharedSubscriptions.map((subscription) => (
                        <SubscriptionCard
                          key={subscription.id}
                          subscription={subscription}
                          canEdit={false}
                          canDelete={false}
                          onEdit={() => {}}
                          onDelete={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {user?.role === 'admin' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">All System Subscriptions</h3>
                {subscriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Users haven't created any subscriptions yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subscriptions.map((subscription) => (
                      <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                        canEdit={true}
                        canDelete={true}
                        onEdit={() => setEditingSubscription(subscription)}
                        onDelete={() => handleDeleteSubscription(subscription.id)}
                        showUserInfo={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SubscriptionCard: React.FC<{
  subscription: Subscription;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  showUserInfo?: boolean;
}> = ({ subscription, canEdit, canDelete, onEdit, onDelete, showUserInfo = false }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center">
            <h4 className="text-lg font-semibold text-gray-900">{subscription.service_name}</h4>
            {subscription.is_shared && (
              <Share className="ml-2 h-4 w-4 text-blue-500" />
            )}
          </div>
          {showUserInfo && (
            <p className="text-sm text-gray-500">User: {subscription.username}</p>
          )}
        </div>
        <div className="flex space-x-1">
          {canEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Cost:</span>
          <span className="font-medium">${subscription.cost}/{subscription.billing_cycle}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Next renewal:</span>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            {new Date(subscription.renewal_date).toLocaleDateString()}
          </div>
        </div>

        {subscription.notes && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">{subscription.notes}</p>
          </div>
        )}

        {subscription.is_shared && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Share className="h-3 w-3 mr-1" />
              Shared by Admin
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const SubscriptionForm: React.FC<{
  subscription?: Subscription | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isAdmin: boolean;
}> = ({ subscription, onSubmit, onCancel, isAdmin }) => {
  const [formData, setFormData] = useState({
    service_name: subscription?.service_name || '',
    cost: subscription?.cost || '',
    billing_cycle: subscription?.billing_cycle || 'monthly',
    renewal_date: subscription?.renewal_date || '',
    notes: subscription?.notes || '',
    is_shared: subscription?.is_shared || false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {subscription ? 'Edit Subscription' : 'Create New Subscription'}
          </h3>
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="service_name" className="block text-sm font-medium text-gray-700 mb-1">
                Service Name
              </label>
              <input
                type="text"
                id="service_name"
                name="service_name"
                required
                maxLength={100}
                value={formData.service_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Netflix, Spotify"
              />
            </div>

            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                Cost
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                required
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="billing_cycle" className="block text-sm font-medium text-gray-700 mb-1">
                Billing Cycle
              </label>
              <select
                id="billing_cycle"
                name="billing_cycle"
                required
                value={formData.billing_cycle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label htmlFor="renewal_date" className="block text-sm font-medium text-gray-700 mb-1">
                Renewal Date
              </label>
              <input
                type="date"
                id="renewal_date"
                name="renewal_date"
                required
                value={formData.renewal_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes..."
            />
          </div>

          {isAdmin && subscription && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_shared"
                name="is_shared"
                checked={formData.is_shared}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_shared" className="ml-2 block text-sm text-gray-900">
                Share this subscription with all users
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {subscription ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                subscription ? 'Update Subscription' : 'Create Subscription'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};