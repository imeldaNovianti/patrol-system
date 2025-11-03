import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReports } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
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

  const createReport = () => {
    navigate('/report-form');
  };

  const totalRankA = reports.reduce((sum, report) => sum + report.total_rank_a, 0);
  const totalRankB = reports.reduce((sum, report) => sum + report.total_rank_b, 0);
  const totalRankC = reports.reduce((sum, report) => sum + report.total_rank_c, 0);

  const rankData = {
    labels: ['Rank A', 'Rank B', 'Rank C'],
    datasets: [
      {
        label: 'Number of Items',
        data: [totalRankA, totalRankB, totalRankC],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
      },
    ],
  };

  const areaData = {};
  reports.forEach(report => {
    if (!areaData[report.area]) {
      areaData[report.area] = { rankA: 0, rankB: 0, rankC: 0 };
    }
    areaData[report.area].rankA += report.total_rank_a;
    areaData[report.area].rankB += report.total_rank_b;
    areaData[report.area].rankC += report.total_rank_c;
  });

  const areaChartData = {
    labels: Object.keys(areaData),
    datasets: [
      {
        label: 'Rank A',
        data: Object.values(areaData).map(area => area.rankA),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'Rank B',
        data: Object.values(areaData).map(area => area.rankB),
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(255, 206, 86, 1)',
      },
      {
        label: 'Rank C',
        data: Object.values(areaData).map(area => area.rankC),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif"
          }
        }
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
  };

  if (loading) return (
    <div className="loading-container">
      <div className="pulse-loader">
        <div className="pulse-dot"></div>
        <div className="pulse-dot"></div>
        <div className="pulse-dot"></div>
      </div>
      <p>Loading dashboard...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-animation">⚠️</div>
      <h2>{error}</h2>
      <button onClick={() => window.location.reload()} className="glow-button">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="animated-dashboard">
      {/* Animated Background Elements */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="title-glitch">Safety Patrol Dashboard</h1>
          <p className="subtitle-shine">Monitor and Manage Safety Reports</p>
        </div>
        <button 
          onClick={createReport} 
          className="create-btn magnetic-btn"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.querySelector('.btn-sparkle').style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.querySelector('.btn-sparkle').style.opacity = '0';
          }}
        >
          <span className="btn-sparkle">✨</span>
          Create New Report
          <span className="btn-arrow">→</span>
        </button>
      </div>
      
      <div className="stats-cards">
        <div 
          className={`stat-card card-1 ${hoveredCard === 1 ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="card-glow"></div>
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Total Reports</h3>
            <p className="stat-value count-up">{reports.length}</p>
          </div>
          <div className="card-ribbon"></div>
        </div>
        
        <div 
          className={`stat-card card-2 rank-a ${hoveredCard === 2 ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="card-glow"></div>
          <div className="card-icon">🔴</div>
          <div className="card-content">
            <h3>Total Rank A</h3>
            <p className="stat-value count-up" style={{ color: '#e74c3c' }}>{totalRankA}</p>
          </div>
          <div className="card-ribbon"></div>
        </div>
        
        <div 
          className={`stat-card card-3 rank-b ${hoveredCard === 3 ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="card-glow"></div>
          <div className="card-icon">🟡</div>
          <div className="card-content">
            <h3>Total Rank B</h3>
            <p className="stat-value count-up" style={{ color: '#f39c12' }}>{totalRankB}</p>
          </div>
          <div className="card-ribbon"></div>
        </div>
        
        <div 
          className={`stat-card card-4 rank-c ${hoveredCard === 4 ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredCard(4)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="card-glow"></div>
          <div className="card-icon">🟢</div>
          <div className="card-content">
            <h3>Total Rank C</h3>
            <p className="stat-value count-up" style={{ color: '#27ae60' }}>{totalRankC}</p>
          </div>
          <div className="card-ribbon"></div>
        </div>
      </div>
      
      <div className="charts-section">
        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Overall Rank Distribution</h2>
            <div className="chart-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="chart-wrapper">
            <Pie data={rankData} options={chartOptions} />
          </div>
        </div>
        
        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Ranks by Area</h2>
            <div className="chart-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="chart-wrapper">
            <Bar data={areaChartData} options={chartOptions} />
          </div>
        </div>
      </div>
      
      <div className="recent-reports glass-card">
        <div className="section-header">
          <h2>Recent Reports</h2>
          <div className="report-count-badge">
            {reports.length} reports
          </div>
        </div>
        
        {reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No reports found</h3>
            <p>Create your first report to get started!</p>
            <button onClick={createReport} className="create-first-btn">
              Create First Report
            </button>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="reports-table">
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
                  {reports.slice(0, 5).map((report, index) => (
                    <tr 
                      key={report.id} 
                      className="table-row"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td>
                        <span className="report-code">{report.report_code}</span>
                      </td>
                      <td>{report.tanggal_patrol}</td>
                      <td>
                        <span className="area-tag">{report.area}</span>
                      </td>
                      <td>{report.plant}</td>
                      <td>
                        <div className="pic-wrapper">
                          <div className="pic-avatar">
                            {report.pic.charAt(0).toUpperCase()}
                          </div>
                          {report.pic}
                        </div>
                      </td>
                      <td>
                        <span className="rank-badge rank-a">{report.total_rank_a}</span>
                      </td>
                      <td>
                        <span className="rank-badge rank-b">{report.total_rank_b}</span>
                      </td>
                      <td>
                        <span className="rank-badge rank-c">{report.total_rank_c}</span>
                      </td>
                      <td>
                        <button 
                          onClick={() => viewReport(report.id)} 
                          className="view-btn slide-hover"
                        >
                          <span>View Details</span>
                          <span className="btn-arrow">→</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {reports.length > 5 && (
              <div className="view-all-wrapper">
                <button 
                  onClick={() => navigate('/reports')} 
                  className="view-all-btn float-hover"
                >
                  View All Reports
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}