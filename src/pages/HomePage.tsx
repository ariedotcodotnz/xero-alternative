import React, { useEffect, useState } from 'react';
import OutstandingInvoices from '../components/dashboard/OutstandingInvoices';
import ExpensesModule from '../components/dashboard/ExpensesModule';
import RecentPayments from '../components/dashboard/RecentPayments';
import AuAccountDetailsModule from '../components/dashboard/account_details/AuAccountDetailsModule';
import NzAccountDetailsModule from '../components/dashboard/account_details/NzAccountDetailsModule';
import UkAccountDetailsModule from '../components/dashboard/account_details/UkAccountDetailsModule';

const HomePage: React.FC = () => {
  const [jurisdiction, setJurisdiction] = useState<'AU' | 'NZ' | 'UK'>('NZ');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dashboard/modules');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        // Set jurisdiction based on user data
        if (data.jurisdiction) {
          setJurisdiction(data.jurisdiction);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const renderAccountDetailsModule = () => {
    switch (jurisdiction) {
      case 'AU':
        return <AuAccountDetailsModule />;
      case 'NZ':
        return <NzAccountDetailsModule />;
      case 'UK':
        return <UkAccountDetailsModule />;
      default:
        return <NzAccountDetailsModule />;
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="mb-4">Dashboard</h1>

      <div className="row g-4">
        {/* Outstanding Invoices */}
        <div className="col-12 col-lg-6">
          <OutstandingInvoices />
        </div>

        {/* Account Details */}
        <div className="col-12 col-lg-6">
          {renderAccountDetailsModule()}
        </div>

        {/* Expenses Module */}
        <div className="col-12 col-lg-6">
          <ExpensesModule />
        </div>

        {/* Recent Payments */}
        <div className="col-12 col-lg-6">
          <RecentPayments />
        </div>

        {/* Active Card Module - Can be added later when needed */}
      </div>
    </div>
  );
};

export default HomePage;
