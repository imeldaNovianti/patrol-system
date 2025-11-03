import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReport } from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getReport(id);
        if (result.success) {
          setReport(result.report);
          setItems(result.items);
        } else {
          setError('Failed to fetch report');
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading report...</div>;
  if (error) return <div className="text-center mt-5" style={{ color: 'red' }}>{error}</div>;
  if (!report) return <div className="text-center mt-5">Report not found</div>;

  const rankData = {
    labels: ['Rank A', 'Rank B', 'Rank C'],
    datasets: [
      {
        label: 'Number of Items',
        data: [report.total_rank_a, report.total_rank_b, report.total_rank_c],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const fourMData = {
    Man: 0,
    Machine: 0,
    Material: 0,
    Method: 0,
  };

  items.forEach(item => {
    const categories = item.kategori_4m.split(',');
    categories.forEach(category => {
      if (Object.hasOwn(fourMData, category)) {
        fourMData[category]++;
      }
    });
  });

  const fourMChartData = {
    labels: Object.keys(fourMData),
    datasets: [
      {
        data: Object.values(fourMData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const scoreData = {
    labels: items.map((_, index) => `Item ${index + 1}`),
    datasets: [
      {
        label: 'Score',
        data: items.map(item => item.score),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Report Details: {report.report_code}</h1>
        <button onClick={() => navigate('/reports')} style={{ backgroundColor: '#95a5a6' }}>
          Back to Reports
        </button>
      </div>
      
      <div className="card">
        <h2>Report Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Patrol Date:</span>
            <span style={{ marginLeft: '0.5rem' }}>{report.tanggal_patrol}</span>
          </div>
          <div>
            <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Area:</span>
            <span style={{ marginLeft: '0.5rem' }}>{report.area}</span>
          </div>
          <div>
            <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Plant:</span>
            <span style={{ marginLeft: '0.5rem' }}>{report.plant}</span>
          </div>
          <div>
            <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Document No.:</span>
            <span style={{ marginLeft: '0.5rem' }}>{report.no_dokumen || '-'}</span>
          </div>
          <div>
            <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Revision No.:</span>
            <span style={{ marginLeft: '0.5rem' }}>{report.no_revisi || '-'}</span>
          </div>
          <div>
            <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Release Date:</span>
            <span style={{ marginLeft: '0.5rem' }}>{report.tanggal_rilis || '-'}</span>
          </div>
          <div>
            <span style={{ fontWeight: 600, color: '#7f8c8d' }}>PIC:</span>
            <span style={{ marginLeft: '0.5rem' }}>{report.pic}</span>
          </div>
          <div>
            <span style={{ fontWeight: 600, color: '#7f8c8d' }}>Created By:</span>
            <span style={{ marginLeft: '0.5rem' }}>{report.fullname}</span>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2>Analysis Charts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 className="text-center">Items by Rank</h3>
            <Bar data={rankData} />
          </div>
          <div>
            <h3 className="text-center">4M Category Distribution</h3>
            <Pie data={fourMChartData} />
          </div>
          <div>
            <h3 className="text-center">Score Trend</h3>
            <Line data={scoreData} />
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2>Patrol Items</h2>
        {items.length === 0 ? (
          <p>No items found for this report.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {items.map((item, index) => (
              <div key={item.id} className="card" style={{ backgroundColor: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3>Item {index + 1}: {item.problem}</h3>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: item.rank === 'A' ? '#e74c3c' : item.rank === 'B' ? '#f39c12' : '#27ae60'
                  }}>
                    Rank {item.rank}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>4M Category</h4>
                      <p>{item.kategori_4m}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Control Point</h4>
                      <p>{item.control_point}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Actual</h4>
                      <p>{item.actual}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Standard</h4>
                      <p>{item.standard}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Root Cause</h4>
                      <p>{item.root_cause}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Kaizen</h4>
                      <p>{item.kaizen}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Kaizen Category</h4>
                      <p>{item.kaizen_category}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Progress</h4>
                      <p>{item.progress}</p>
                    </div>
                  </div>
                  
                  {item.after_desc && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      <div>
                        <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>After Description</h4>
                        <p>{item.after_desc}</p>
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Severity</h4>
                      <p>{item.tingkat_keparahan}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Frequency</h4>
                      <p>{item.frekuensi}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Likelihood</h4>
                      <p>{item.kemungkinan}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Score</h4>
                      <p>{item.score}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Action Taken</h4>
                      <p>{item.action_taken}</p>
                    </div>
                    <div>
                      <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Repair Date</h4>
                      <p>{item.tanggal_perbaikan || '-'}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    {item.attachments && item.attachments.before && (
                      <div>
                        <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>Before</h4>
                        <img 
                          src={`http://localhost:8000/${item.attachments.before.filepath}`} 
                          alt="Before" 
                          style={{ maxWidth: '100%', borderRadius: '4px', border: '1px solid #ddd' }} 
                        />
                      </div>
                    )}
                    {item.attachments && item.attachments.after && (
                      <div>
                        <h4 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>After</h4>
                        <img 
                          src={`http://localhost:8000/${item.attachments.after.filepath}`} 
                          alt="After" 
                          style={{ maxWidth: '100%', borderRadius: '4px', border: '1px solid #ddd' }} 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}