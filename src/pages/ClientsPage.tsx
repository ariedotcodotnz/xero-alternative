import React, { useState, useEffect } from 'react';
import ClientsTableFilters from '../components/client/ClientsTableFilters';
import SelectClientForInvoiceQuote from '../components/client/SelectClientForInvoiceQuote';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClient = () => {
    setSelectedClient(null);
    setShowCreateModal(true);
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedClient(null);
    fetchClients();
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
    <div className="clients-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Clients</h1>
        <button className="btn btn-primary" onClick={handleCreateClient}>
          Add Client
        </button>
      </div>

      <ClientsTableFilters />

      <div className="card mt-4">
        <div className="card-body">
          {clients.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No clients found</p>
              <button className="btn btn-primary" onClick={handleCreateClient}>
                Add Your First Client
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Outstanding</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.name}</td>
                      <td>{client.email || 'N/A'}</td>
                      <td>{client.phone || 'N/A'}</td>
                      <td>${client.outstanding?.toFixed(2) || '0.00'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditClient(client)}
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

      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedClient ? 'Edit Client' : 'Add Client'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <SelectClientForInvoiceQuote onClientSelect={handleCloseModal} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
