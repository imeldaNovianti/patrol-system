import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [focusField, setFocusField] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(username, password);
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
      top: '10%',
      left: '10%',
      width: '100px',
      height: '100px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '50%',
      animation: 'float 6s ease-in-out infinite'
    },
    shape2: {
      position: 'absolute',
      bottom: '20%',
      right: '10%',
      width: '150px',
      height: '150px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '50%',
      animation: 'float 8s ease-in-out infinite 2s'
    },
    loginCard: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      padding: '40px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
      position: 'relative',
      overflow: 'hidden'
    },
    cardGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
      opacity: isHovered ? 1 : 0,
      transition: 'opacity 0.3s ease'
    },
    title: {
      textAlign: 'center',
      color: 'white',
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '10px',
      background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.8)',
      fontSize: '1rem',
      marginBottom: '30px',
      fontWeight: '300'
    },
    errorMessage: {
      background: 'rgba(231, 76, 60, 0.1)',
      border: '1px solid rgba(231, 76, 60, 0.3)',
      color: '#e74c3c',
      padding: '12px 16px',
      borderRadius: '12px',
      marginBottom: '20px',
      fontSize: '0.9rem',
      textAlign: 'center',
      animation: 'shake 0.5s ease-in-out'
    },
    formGroup: {
      marginBottom: '25px',
      position: 'relative'
    },
    label: {
      display: 'block',
      color: 'rgba(255,255,255,0.9)',
      marginBottom: '8px',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    input: {
      width: '100%',
      padding: '15px 20px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: `2px solid ${focusField ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'}`,
      borderRadius: '12px',
      color: 'white',
      fontSize: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none'
    },
    inputFocus: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: '2px solid rgba(255,255,255,0.6)',
      transform: 'scale(1.02)',
      boxShadow: '0 0 20px rgba(255,255,255,0.1)'
    },
    inputHover: {
      background: 'rgba(255, 255, 255, 0.12)',
      border: '2px solid rgba(255,255,255,0.3)'
    },
    loginButton: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    loginButtonHover: {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: '0 15px 30px rgba(39, 174, 96, 0.4)'
    },
    loginButtonLoading: {
      background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
      cursor: 'not-allowed'
    },
    buttonSparkle: {
      opacity: isHovered ? 1 : 0,
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
    footerText: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.6)',
      fontSize: '0.8rem',
      marginTop: '20px'
    }
  };

  // Add keyframes for animations
  const keyframes = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
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

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Floating Background Shapes */}
        <div style={styles.floatingShapes}>
          <div style={styles.shape1}></div>
          <div style={styles.shape2}></div>
        </div>

        <div 
          style={styles.loginCard}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={styles.cardGlow}></div>
          
          <h1 style={styles.title}>Safety Patrol</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
          
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusField('username')}
                onBlur={() => setFocusField('')}
                onMouseEnter={(e) => {
                  if (focusField !== 'username') {
                    e.target.style.background = styles.inputHover.background;
                    e.target.style.border = styles.inputHover.border;
                  }
                }}
                onMouseLeave={(e) => {
                  if (focusField !== 'username') {
                    e.target.style.background = styles.input.background;
                    e.target.style.border = styles.input.border;
                  }
                }}
                style={{
                  ...styles.input,
                  ...(focusField === 'username' && styles.inputFocus)
                }}
                required
                disabled={loading}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusField('password')}
                onBlur={() => setFocusField('')}
                onMouseEnter={(e) => {
                  if (focusField !== 'password') {
                    e.target.style.background = styles.inputHover.background;
                    e.target.style.border = styles.inputHover.border;
                  }
                }}
                onMouseLeave={(e) => {
                  if (focusField !== 'password') {
                    e.target.style.background = styles.input.background;
                    e.target.style.border = styles.input.border;
                  }
                }}
                style={{
                  ...styles.input,
                  ...(focusField === 'password' && styles.inputFocus)
                }}
                required
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = styles.loginButtonHover.transform;
                  e.target.style.boxShadow = styles.loginButtonHover.boxShadow;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }
              }}
              style={{
                ...styles.loginButton,
                ...(isHovered && !loading && styles.loginButtonHover),
                ...(loading && styles.loginButtonLoading)
              }}
            >
              {loading ? (
                <>
                  <div style={styles.loadingSpinner}></div>
                  Logging in...
                </>
              ) : (
                <>
                  <span style={styles.buttonSparkle}>✨</span>
                  Login
                  <span style={{transition: 'transform 0.3s ease', transform: isHovered ? 'translateX(3px)' : 'translateX(0)'}}>→</span>
                </>
              )}
            </button>
          </form>
          
          <p style={styles.footerText}>
            Secure access to Safety Patrol System
          </p>
        </div>
      </div>
    </>
  );
}