import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport } from '../services/api';
import FileUpload from '../components/FileUpload';

export default function ReportForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [focusField, setFocusField] = useState('');
  const [activeItem, setActiveItem] = useState(0);
  const [reportData, setReportData] = useState({
    tanggal_patrol: new Date().toISOString().split('T')[0],
    area: '',
    plant: '',
    no_dokumen: '',
    no_revisi: '',
    tanggal_rilis: '',
    pic: '',
  });
  const [items, setItems] = useState([
    {
      problem: '',
      before_desc: '',
      actual: '',
      standard: '',
      control_point: '',
      kategori_4m: [],
      root_cause: '',
      kaizen: '',
      kaizen_category: 'Eliminasi',
      progress: 'Before',
      after_desc: '',
      tingkat_keparahan: 1,
      frekuensi: 1,
      kemungkinan: 1,
      score: 1,
      rank: 'C',
      action_taken: '',
      tanggal_perbaikan: '',
      before_image: '',
      after_image: '',
    }
  ]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'tingkat_keparahan' || field === 'frekuensi' || field === 'kemungkinan') {
      const severity = parseInt(newItems[index].tingkat_keparahan);
      const frequency = parseInt(newItems[index].frekuensi);
      const likelihood = parseInt(newItems[index].kemungkinan);
      const score = severity * frequency * likelihood;
      newItems[index].score = score;
      
      if (score >= 20) {
        newItems[index].rank = 'A';
      } else if (score >= 10) {
        newItems[index].rank = 'B';
      } else {
        newItems[index].rank = 'C';
      }
    }
    
    setItems(newItems);
  };

  const handle4MChange = (index, value) => {
    const newItems = [...items];
    if (newItems[index].kategori_4m.includes(value)) {
      newItems[index].kategori_4m = newItems[index].kategori_4m.filter(item => item !== value);
    } else {
      newItems[index].kategori_4m.push(value);
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      problem: '',
      before_desc: '',
      actual: '',
      standard: '',
      control_point: '',
      kategori_4m: [],
      root_cause: '',
      kaizen: '',
      kaizen_category: 'Eliminasi',
      progress: 'Before',
      after_desc: '',
      tingkat_keparahan: 1,
      frekuensi: 1,
      kemungkinan: 1,
      score: 1,
      rank: 'C',
      action_taken: '',
      tanggal_perbaikan: '',
      before_image: '',
      after_image: '',
    }]);
    setActiveItem(items.length);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      setActiveItem(Math.max(0, index - 1));
    }
  };

  const handleFileUploaded = (index, type, filepath) => {
    const newItems = [...items];
    newItems[index][`${type}_image`] = filepath;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createReport({
        user_id: user.id,
        ...reportData,
        items: items
      });
      
      if (result.success) {
        alert(`Report created successfully with code: ${result.report_code}`);
        navigate(`/report/${result.report_id}`);
      } else {
        alert('Failed to create report: ' + result.message);
      }
    } catch {
      alert('Error creating report');
    } finally {
      setLoading(false);
    }
  };

  // Inline Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    floatingShapes: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    },
    shape1: {
      position: 'absolute',
      top: '5%',
      right: '5%',
      width: '120px',
      height: '120px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '50%',
      animation: 'float 8s ease-in-out infinite'
    },
    shape2: {
      position: 'absolute',
      bottom: '10%',
      left: '3%',
      width: '80px',
      height: '80px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '50%',
      animation: 'float 6s ease-in-out infinite 1s'
    },
    header: {
      textAlign: 'center',
      color: 'white',
      marginBottom: '30px'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '10px',
      textShadow: '0 0 30px rgba(255,255,255,0.3)'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: 'rgba(255,255,255,0.8)',
      fontWeight: '300'
    },
    formContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '25px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    cardHover: {
      transform: 'translateY(-5px)',
      background: 'rgba(255, 255, 255, 0.15)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
    },
    cardGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    cardTitle: {
      color: 'white',
      fontSize: '1.8rem',
      fontWeight: '600',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      color: 'rgba(255,255,255,0.9)',
      marginBottom: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    input: {
      padding: '15px 20px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '2px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      fontFamily: 'inherit'
    },
    inputFocus: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: '2px solid rgba(255,255,255,0.6)',
      transform: 'scale(1.02)',
      boxShadow: '0 0 20px rgba(255,255,255,0.1)'
    },
    textarea: {
      padding: '15px 20px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '2px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      fontFamily: 'inherit',
      minHeight: '100px',
      resize: 'vertical'
    },
    select: {
      padding: '15px 20px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '2px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      fontFamily: 'inherit'
    },
    checkboxContainer: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      marginTop: '10px'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'rgba(255,255,255,0.9)',
      cursor: 'pointer',
      padding: '8px 16px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '25px',
      transition: 'all 0.3s ease',
      border: '1px solid transparent'
    },
    checkboxLabelHover: {
      background: 'rgba(255,255,255,0.2)',
      transform: 'translateY(-2px)'
    },
    checkboxLabelChecked: {
      background: 'rgba(52, 152, 219, 0.3)',
      border: '1px solid rgba(52, 152, 219, 0.5)',
      boxShadow: '0 5px 15px rgba(52, 152, 219, 0.2)'
    },
    itemCard: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '20px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden'
    },
    itemCardActive: {
      background: 'rgba(255, 255, 255, 0.12)',
      border: '1px solid rgba(255,255,255,0.3)',
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    },
    itemHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    },
    itemTitle: {
      color: 'white',
      fontSize: '1.4rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    removeButton: {
      background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    removeButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(231, 76, 60, 0.3)'
    },
    addButton: {
      background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
      color: 'white',
      border: 'none',
      padding: '15px 25px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '20px'
    },
    addButtonHover: {
      transform: 'translateY(-3px) scale(1.05)',
      boxShadow: '0 15px 30px rgba(39, 174, 96, 0.4)'
    },
    submitContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '30px'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
      color: 'white',
      border: 'none',
      padding: '18px 35px',
      borderRadius: '15px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1.1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden'
    },
    submitButtonHover: {
      transform: 'translateY(-3px) scale(1.05)',
      boxShadow: '0 20px 40px rgba(155, 89, 182, 0.4)'
    },
    submitButtonLoading: {
      background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
      cursor: 'not-allowed'
    },
    buttonSparkle: {
      opacity: 0,
      transition: 'opacity 0.3s ease',
      animation: 'sparkle 2s infinite'
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    rankBadge: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontWeight: '600',
      fontSize: '0.9rem',
      display: 'inline-block',
      marginLeft: '10px'
    },
    rankA: {
      background: 'rgba(231, 76, 60, 0.3)',
      color: '#e74c3c',
      border: '1px solid rgba(231, 76, 60, 0.5)'
    },
    rankB: {
      background: 'rgba(243, 156, 18, 0.3)',
      color: '#f39c12',
      border: '1px solid rgba(243, 156, 18, 0.5)'
    },
    rankC: {
      background: 'rgba(39, 174, 96, 0.3)',
      color: '#27ae60',
      border: '1px solid rgba(39, 174, 96, 0.5)'
    },
    scoreDisplay: {
      background: 'rgba(255,255,255,0.1)',
      padding: '10px 15px',
      borderRadius: '10px',
      color: 'white',
      fontWeight: '600',
      border: '1px solid rgba(255,255,255,0.2)'
    }
  };

  // Add keyframes for animations
  const keyframes = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    @keyframes sparkle {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  if (!user) return null;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Floating Background Shapes */}
        <div style={styles.floatingShapes}>
          <div style={styles.shape1}></div>
          <div style={styles.shape2}></div>
        </div>

        <div style={styles.header}>
          <h1 style={styles.title}>Create Safety Patrol Report</h1>
          <p style={styles.subtitle}>Complete the form below to create a new safety report</p>
        </div>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {/* Report Information Card */}
            <div 
              style={{
                ...styles.card,
                ...(isHovered && styles.cardHover)
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div style={styles.cardGlow}></div>
              <h2 style={styles.cardTitle}>
                📋 Report Information
              </h2>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="tanggal_patrol">Patrol Date</label>
                  <input
                    type="date"
                    id="tanggal_patrol"
                    name="tanggal_patrol"
                    value={reportData.tanggal_patrol}
                    onChange={handleReportChange}
                    onFocus={() => setFocusField('tanggal_patrol')}
                    onBlur={() => setFocusField('')}
                    style={{
                      ...styles.input,
                      ...(focusField === 'tanggal_patrol' && styles.inputFocus)
                    }}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="area">Area</label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={reportData.area}
                    onChange={handleReportChange}
                    onFocus={() => setFocusField('area')}
                    onBlur={() => setFocusField('')}
                    style={{
                      ...styles.input,
                      ...(focusField === 'area' && styles.inputFocus)
                    }}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="plant">Plant</label>
                  <input
                    type="text"
                    id="plant"
                    name="plant"
                    value={reportData.plant}
                    onChange={handleReportChange}
                    onFocus={() => setFocusField('plant')}
                    onBlur={() => setFocusField('')}
                    style={{
                      ...styles.input,
                      ...(focusField === 'plant' && styles.inputFocus)
                    }}
                    required
                  />
                </div>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="no_dokumen">Document No.</label>
                  <input
                    type="text"
                    id="no_dokumen"
                    name="no_dokumen"
                    value={reportData.no_dokumen}
                    onChange={handleReportChange}
                    onFocus={() => setFocusField('no_dokumen')}
                    onBlur={() => setFocusField('')}
                    style={{
                      ...styles.input,
                      ...(focusField === 'no_dokumen' && styles.inputFocus)
                    }}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="no_revisi">Revision No.</label>
                  <input
                    type="text"
                    id="no_revisi"
                    name="no_revisi"
                    value={reportData.no_revisi}
                    onChange={handleReportChange}
                    onFocus={() => setFocusField('no_revisi')}
                    onBlur={() => setFocusField('')}
                    style={{
                      ...styles.input,
                      ...(focusField === 'no_revisi' && styles.inputFocus)
                    }}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="tanggal_rilis">Release Date</label>
                  <input
                    type="date"
                    id="tanggal_rilis"
                    name="tanggal_rilis"
                    value={reportData.tanggal_rilis}
                    onChange={handleReportChange}
                    onFocus={() => setFocusField('tanggal_rilis')}
                    onBlur={() => setFocusField('')}
                    style={{
                      ...styles.input,
                      ...(focusField === 'tanggal_rilis' && styles.inputFocus)
                    }}
                  />
                </div>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="pic">PIC</label>
                  <input
                    type="text"
                    id="pic"
                    name="pic"
                    value={reportData.pic}
                    onChange={handleReportChange}
                    onFocus={() => setFocusField('pic')}
                    onBlur={() => setFocusField('')}
                    style={{
                      ...styles.input,
                      ...(focusField === 'pic' && styles.inputFocus)
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Patrol Items Card */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                🔍 Patrol Items
              </h2>
              
              {items.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    ...styles.itemCard,
                    ...(activeItem === index && styles.itemCardActive)
                  }}
                  onClick={() => setActiveItem(index)}
                >
                  <div style={styles.itemHeader}>
                    <h3 style={styles.itemTitle}>
                      📝 Item {index + 1}
                      <span style={{
                        ...styles.rankBadge,
                        ...(item.rank === 'A' ? styles.rankA : 
                            item.rank === 'B' ? styles.rankB : styles.rankC)
                      }}>
                        Rank {item.rank}
                      </span>
                    </h3>
                    {items.length > 1 && (
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(index);
                        }}
                        style={styles.removeButton}
                        onMouseEnter={(e) => {
                          e.target.style.transform = styles.removeButtonHover.transform;
                          e.target.style.boxShadow = styles.removeButtonHover.boxShadow;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>
                  
                  {/* Problem */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`problem-${index}`}>Problem</label>
                      <textarea
                        id={`problem-${index}`}
                        value={item.problem}
                        onChange={(e) => handleItemChange(index, 'problem', e.target.value)}
                        onFocus={() => setFocusField(`problem-${index}`)}
                        onBlur={() => setFocusField('')}
                        style={{
                          ...styles.textarea,
                          ...(focusField === `problem-${index}` && styles.inputFocus)
                        }}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* 4M Category */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>4M Category</label>
                      <div style={styles.checkboxContainer}>
                        {['Man', 'Machine', 'Material', 'Method'].map(category => (
                          <label 
                            key={category}
                            style={{
                              ...styles.checkboxLabel,
                              ...(item.kategori_4m.includes(category) && styles.checkboxLabelChecked)
                            }}
                            onMouseEnter={(e) => {
                              if (!item.kategori_4m.includes(category)) {
                                e.target.style.background = styles.checkboxLabelHover.background;
                                e.target.style.transform = styles.checkboxLabelHover.transform;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!item.kategori_4m.includes(category)) {
                                e.target.style.background = styles.checkboxLabel.background;
                                e.target.style.transform = 'translateY(0)';
                              }
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={item.kategori_4m.includes(category)}
                              onChange={() => handle4MChange(index, category)}
                              style={{ display: 'none' }}
                            />
                            {category}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actual & Standard */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`actual-${index}`}>Actual</label>
                      <textarea
                        id={`actual-${index}`}
                        value={item.actual}
                        onChange={(e) => handleItemChange(index, 'actual', e.target.value)}
                        onFocus={() => setFocusField(`actual-${index}`)}
                        onBlur={() => setFocusField('')}
                        style={{
                          ...styles.textarea,
                          ...(focusField === `actual-${index}` && styles.inputFocus)
                        }}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`standard-${index}`}>Standard</label>
                      <textarea
                        id={`standard-${index}`}
                        value={item.standard}
                        onChange={(e) => handleItemChange(index, 'standard', e.target.value)}
                        onFocus={() => setFocusField(`standard-${index}`)}
                        onBlur={() => setFocusField('')}
                        style={{
                          ...styles.textarea,
                          ...(focusField === `standard-${index}` && styles.inputFocus)
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Control Point */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`control_point-${index}`}>Control Point</label>
                      <input
                        type="text"
                        id={`control_point-${index}`}
                        value={item.control_point}
                        onChange={(e) => handleItemChange(index, 'control_point', e.target.value)}
                        onFocus={() => setFocusField(`control_point-${index}`)}
                        onBlur={() => setFocusField('')}
                        style={{
                          ...styles.input,
                          ...(focusField === `control_point-${index}` && styles.inputFocus)
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Root Cause & Kaizen */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`root_cause-${index}`}>Root Cause</label>
                      <textarea
                        id={`root_cause-${index}`}
                        value={item.root_cause}
                        onChange={(e) => handleItemChange(index, 'root_cause', e.target.value)}
                        onFocus={() => setFocusField(`root_cause-${index}`)}
                        onBlur={() => setFocusField('')}
                        style={{
                          ...styles.textarea,
                          ...(focusField === `root_cause-${index}` && styles.inputFocus)
                        }}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`kaizen-${index}`}>Kaizen</label>
                      <textarea
                        id={`kaizen-${index}`}
                        value={item.kaizen}
                        onChange={(e) => handleItemChange(index, 'kaizen', e.target.value)}
                        onFocus={() => setFocusField(`kaizen-${index}`)}
                        onBlur={() => setFocusField('')}
                        style={{
                          ...styles.textarea,
                          ...(focusField === `kaizen-${index}` && styles.inputFocus)
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Kaizen Category & Progress */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`kaizen_category-${index}`}>Kaizen Category</label>
                      <select
                        id={`kaizen_category-${index}`}
                        value={item.kaizen_category}
                        onChange={(e) => handleItemChange(index, 'kaizen_category', e.target.value)}
                        style={styles.select}
                      >
                        <option value="Eliminasi">Eliminasi</option>
                        <option value="Substitusi">Substitusi</option>
                        <option value="Modifikasi">Modifikasi</option>
                        <option value="APD">APD</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`progress-${index}`}>Progress</label>
                      <select
                        id={`progress-${index}`}
                        value={item.progress}
                        onChange={(e) => handleItemChange(index, 'progress', e.target.value)}
                        style={styles.select}
                      >
                        <option value="Before">Before</option>
                        <option value="After">After</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* After Description */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`after_desc-${index}`}>After Description</label>
                      <textarea
                        id={`after_desc-${index}`}
                        value={item.after_desc}
                        onChange={(e) => handleItemChange(index, 'after_desc', e.target.value)}
                        onFocus={() => setFocusField(`after_desc-${index}`)}
                        onBlur={() => setFocusField('')}
                        style={{
                          ...styles.textarea,
                          ...(focusField === `after_desc-${index}` && styles.inputFocus)
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Risk Assessment */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`tingkat_keparahan-${index}`}>Severity (1-12)</label>
                      <input
                        type="number"
                        id={`tingkat_keparahan-${index}`}
                        min="1"
                        max="12"
                        value={item.tingkat_keparahan}
                        onChange={(e) => handleItemChange(index, 'tingkat_keparahan', parseInt(e.target.value))}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`frekuensi-${index}`}>Frequency (1-8)</label>
                      <input
                        type="number"
                        id={`frekuensi-${index}`}
                        min="1"
                        max="8"
                        value={item.frekuensi}
                        onChange={(e) => handleItemChange(index, 'frekuensi', parseInt(e.target.value))}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`kemungkinan-${index}`}>Likelihood (1-4)</label>
                      <input
                        type="number"
                        id={`kemungkinan-${index}`}
                        min="1"
                        max="4"
                        value={item.kemungkinan}
                        onChange={(e) => handleItemChange(index, 'kemungkinan', parseInt(e.target.value))}
                        style={styles.input}
                      />
                    </div>
                  </div>
                  
                  {/* Score & Rank Display */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Risk Score</label>
                      <div style={styles.scoreDisplay}>
                        Score: {item.score}
                      </div>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Risk Rank</label>
                      <div style={{
                        ...styles.scoreDisplay,
                        ...(item.rank === 'A' ? styles.rankA : 
                            item.rank === 'B' ? styles.rankB : styles.rankC)
                      }}>
                        Rank: {item.rank}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Taken & Repair Date */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`action_taken-${index}`}>Action Taken</label>
                      <input
                        type="text"
                        id={`action_taken-${index}`}
                        value={item.action_taken}
                        onChange={(e) => handleItemChange(index, 'action_taken', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor={`tanggal_perbaikan-${index}`}>Repair Date</label>
                      <input
                        type="date"
                        id={`tanggal_perbaikan-${index}`}
                        value={item.tanggal_perbaikan}
                        onChange={(e) => handleItemChange(index, 'tanggal_perbaikan', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </div>
                  
                  {/* File Upload */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Before Photo</label>
                      <FileUpload
                        type="before"
                        reportId={0}
                        itemId={0}
                        uploadedBy={user.id}
                        onUploaded={(filepath) => handleFileUploaded(index, 'before', filepath)}
                        existingFile={item.before_image}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>After Photo</label>
                      <FileUpload
                        type="after"
                        reportId={0}
                        itemId={0}
                        uploadedBy={user.id}
                        onUploaded={(filepath) => handleFileUploaded(index, 'after', filepath)}
                        existingFile={item.after_image}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={addItem}
                style={styles.addButton}
                onMouseEnter={(e) => {
                  e.target.style.transform = styles.addButtonHover.transform;
                  e.target.style.boxShadow = styles.addButtonHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                ➕ Add New Item
              </button>
            </div>
            
            {/* Submit Button */}
            <div style={styles.submitContainer}>
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(isHovered && styles.submitButtonHover),
                  ...(loading && styles.submitButtonLoading)
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {loading ? (
                  <>
                    <div style={styles.loadingSpinner}></div>
                    Creating Report...
                  </>
                ) : (
                  <>
                    <span style={styles.buttonSparkle}>✨</span>
                    Create Safety Report
                    <span style={{transition: 'transform 0.3s ease', transform: isHovered ? 'translateX(5px)' : 'translateX(0)'}}>🚀</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}