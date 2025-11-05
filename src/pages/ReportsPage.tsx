import React, { useState, useEffect } from 'react';
import ReportModule from '../components/reports/ReportModule';
import StatementOfAccountReport from '../components/reports/StatementOfAccountReport';

const ReportsPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<string>('overview');
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const reports = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'income', label: 'Income Report', icon: '💰' },
    { id: 'expenses', label: 'Expense Report', icon: '📉' },
    { id: 'tax', label: 'Tax Position', icon: '📝' },
    { id: 'statement', label: 'Statement of Account', icon: '📄' },
  ];

  useEffect(() => {
    fetchReportData();
  }, [activeReport, dateRange]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/reports/${activeReport}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="reports-page">
      <h1 className="mb-4">Reports</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateRangeChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateRangeChange}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-outline-primary w-100" onClick={fetchReportData}>
            Generate Report
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            {reports.map((report) => (
              <li key={report.id} className="nav-item">
                <button
                  className={`nav-link ${activeReport === report.id ? 'active' : ''}`}
                  onClick={() => setActiveReport(report.id)}
                >
                  <span className="me-2">{report.icon}</span>
                  {report.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {activeReport === 'overview' && (
                <div>
                  <h3>Financial Overview</h3>
                  <div className="row mt-4">
                    <div className="col-md-3">
                      <div className="card bg-success text-white">
                        <div className="card-body">
                          <h6>Total Income</h6>
                          <h3>${reportData?.totalIncome?.toFixed(2) || '0.00'}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-danger text-white">
                        <div className="card-body">
                          <h6>Total Expenses</h6>
                          <h3>${reportData?.totalExpenses?.toFixed(2) || '0.00'}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-primary text-white">
                        <div className="card-body">
                          <h6>Net Profit</h6>
                          <h3>${reportData?.netProfit?.toFixed(2) || '0.00'}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-warning text-white">
                        <div className="card-body">
                          <h6>Tax Estimate</h6>
                          <h3>${reportData?.taxEstimate?.toFixed(2) || '0.00'}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ReportModule data={reportData} />
                  </div>
                </div>
              )}

              {activeReport === 'statement' && (
                <StatementOfAccountReport />
              )}

              {activeReport !== 'overview' && activeReport !== 'statement' && (
                <div className="text-center py-5">
                  <p className="text-muted">Report data will be displayed here</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
