import React, { useState } from 'react';
import NavigationSidebar from '../components/admin/navigation/NavigationSidebar';

const AdminPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            <h2>Admin Dashboard</h2>
            <div className="row mt-4">
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">Total Users</h6>
                    <h3>1,234</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">Active Invoices</h6>
                    <h3>456</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">Pending Reconciliations</h6>
                    <h3>78</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">Filing Obligations</h6>
                    <h3>23</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <h2>User Management</h2>
            <div className="card mt-4">
              <div className="card-body">
                <p className="text-muted">User management interface will be displayed here</p>
              </div>
            </div>
          </div>
        );

      case 'reconciliations':
        return (
          <div>
            <h2>Reconciliations</h2>
            <div className="card mt-4">
              <div className="card-body">
                <p className="text-muted">Reconciliation management interface will be displayed here</p>
              </div>
            </div>
          </div>
        );

      case 'filing-obligations':
        return (
          <div>
            <h2>Filing Obligations</h2>
            <div className="card mt-4">
              <div className="card-body">
                <p className="text-muted">Filing obligations management interface will be displayed here</p>
              </div>
            </div>
          </div>
        );

      case 'bank-transactions':
        return (
          <div>
            <h2>Bank Transactions</h2>
            <div className="card mt-4">
              <div className="card-body">
                <p className="text-muted">Bank transaction management interface will be displayed here</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h2>Admin Panel</h2>
            <p className="text-muted">Select a section from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-page">
      <h1 className="mb-4">Admin Panel</h1>

      <div className="d-flex">
        <div className="me-4" style={{ width: '250px' }}>
          <NavigationSidebar onSectionChange={setActiveSection} activeSection={activeSection} />
        </div>

        <div className="flex-grow-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
