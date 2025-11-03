import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReports } from '../services/api';

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const result = await getReports();
        if (result.success) {
          setReports(result.reports);
        } else {
          setError('Failed to fetch reports');
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const viewReport = (id) => {
    navigate(`/report/${id}`);
  };

  if (loading) return <div className="text-center mt-5">Loading reports...</div>;
  if (error) return <div className="text-center mt-5" style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Safety Patrol Reports</h1>
        <button onClick={() => navigate('/report-form')} style={{ backgroundColor: '#27ae60' }}>
          Create New Report
        </button>
      </div>
      
      <div className="card">
        {reports.length === 0 ? (
          <p>No reports found. Create your first report!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Report Code</th>
                <th>Date</th>
                <th>Area</th>
                <th>Plant</th>
                <th>PIC</th>
                <th>Rank A</th>
                <th>Rank B</th>
                <th>Rank C</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.report_code}</td>
                  <td>{report.tanggal_patrol}</td>
                  <td>{report.area}</td>
                  <td>{report.plant}</td>
                  <td>{report.pic}</td>
                  <td>{report.total_rank_a}</td>
                  <td>{report.total_rank_b}</td>
                  <td>{report.total_rank_c}</td>
                  <td>
                    <button onClick={() => viewReport(report.id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}