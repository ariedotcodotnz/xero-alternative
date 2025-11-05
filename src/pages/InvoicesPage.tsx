import React, { useState, useEffect } from 'react';
import InvoiceForm from '../components/invoices/invoice_form';
import InvoicePreviewModal from '../components/invoices/InvoicePreviewModal';
import InvoiceTabFilters from '../components/_organisms/invoice_tab_filters/InvoiceTabFilters';

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [activeTab]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/invoices?status=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setShowForm(true);
  };

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedInvoice(null);
    fetchInvoices();
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

  return (
    <div className="invoices-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Invoices</h1>
        <button className="btn btn-primary" onClick={handleCreateInvoice}>
          Create Invoice
        </button>
      </div>

      <InvoiceTabFilters onTabChange={setActiveTab} activeTab={activeTab} />

      <div className="card mt-4">
        <div className="card-body">
          {invoices.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No invoices found</p>
              <button className="btn btn-primary" onClick={handleCreateInvoice}>
                Create Your First Invoice
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.number}</td>
                      <td>{invoice.client?.name || 'N/A'}</td>
                      <td>{new Date(invoice.date).toLocaleDateString()}</td>
                      <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                      <td>${invoice.total?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={`badge bg-${invoice.status === 'paid' ? 'success' : 'warning'}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditInvoice(invoice)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedInvoice ? 'Edit Invoice' : 'Create Invoice'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseForm}></button>
              </div>
              <div className="modal-body">
                <InvoiceForm
                  invoice={selectedInvoice}
                  onClose={handleCloseForm}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
