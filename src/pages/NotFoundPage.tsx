import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <h1 className="display-1 fw-bold text-primary">404</h1>
                <h2 className="h3 mb-3">Page Not Found</h2>
                <p className="text-muted mb-4">
                  Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>

                <div className="d-flex gap-3 justify-content-center">
                  <Link to="/" className="btn btn-primary">
                    Go to Dashboard
                  </Link>
                  <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    Go Back
                  </button>
                </div>

                <hr className="my-4" />

                <div className="text-start">
                  <h5 className="mb-3">Quick Links:</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <Link to="/invoices" className="text-decoration-none">Invoices</Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/clients" className="text-decoration-none">Clients</Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/expenses" className="text-decoration-none">Expenses</Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/settings" className="text-decoration-none">Settings</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
