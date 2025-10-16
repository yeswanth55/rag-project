import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Heart, LogOut, Stethoscope, History, Activity, ArrowLeft, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { getConsultation } from '../api/api';

function ConsultationDetail({ onLogout }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConsultation();
  }, [id]);

  const fetchConsultation = async () => {
    try {
      const response = await getConsultation(id);
      setConsultation(response.data);
    } catch (err) {
      console.error('Error fetching consultation:', err);
      alert('Failed to load consultation');
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'emergency':
        return <AlertTriangle size={20} />;
      case 'high':
        return <AlertCircle size={20} />;
      case 'moderate':
        return <AlertCircle size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container" style={{ height: '100vh' }}>
          <div className="spinner"></div>
          <p className="loading-text">Loading consultation details...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return null;
  }

  const analysis = consultation.analysis;

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/dashboard" className="navbar-brand">
            <Heart size={32} />
            <span>HealthCheck AI</span>
          </Link>
          
          <div className="navbar-menu">
            <Link to="/dashboard" className="nav-link">
              <Activity size={20} />
              Dashboard
            </Link>
            <Link to="/check-symptoms" className="nav-link">
              <Stethoscope size={20} />
              Check Symptoms
            </Link>
            <Link to="/history" className="nav-link active">
              <History size={20} />
              History
            </Link>
          </div>

          <div className="user-menu">
            <div className="user-info">
              <span>{user?.username}</span>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="symptom-checker-container">
          <Link to="/history" className="btn btn-secondary" style={{ maxWidth: '200px', marginBottom: '2rem' }}>
            <ArrowLeft size={20} />
            Back to History
          </Link>

          <div className="checker-card">
            <div className="checker-header">
              <h2>Consultation Details</h2>
              <p>Reviewed on {formatDate(consultation.createdAt)}</p>
            </div>

            <div className="form-group">
              <label>Your Symptoms</label>
              <div style={{ 
                background: 'var(--bg-secondary)', 
                padding: '1rem', 
                borderRadius: '10px',
                color: 'var(--text-secondary)',
                lineHeight: '1.6'
              }}>
                {consultation.symptoms}
              </div>
            </div>

            {(consultation.age || consultation.gender) && (
              <div className="form-row">
                {consultation.age && (
                  <div className="form-group">
                    <label>Age</label>
                    <div style={{ 
                      background: 'var(--bg-secondary)', 
                      padding: '0.75rem', 
                      borderRadius: '10px' 
                    }}>
                      {consultation.age} years
                    </div>
                  </div>
                )}
                {consultation.gender && (
                  <div className="form-group">
                    <label>Gender</label>
                    <div style={{ 
                      background: 'var(--bg-secondary)', 
                      padding: '0.75rem', 
                      borderRadius: '10px',
                      textTransform: 'capitalize'
                    }}>
                      {consultation.gender}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="analysis-container">
            <div className="analysis-header">
              <Stethoscope size={28} />
              <h3>AI Analysis Results</h3>
            </div>
            
            <div className="analysis-content">
              <div className={`urgency-badge ${analysis.urgencyLevel}`}>
                {getUrgencyIcon(analysis.urgencyLevel)}
                Urgency Level: {analysis.urgencyLevel?.toUpperCase()}
              </div>

              <div className="disclaimer-box" style={{ marginTop: '1rem' }}>
                <p><strong>{analysis.disclaimer}</strong></p>
              </div>

              <div className="conditions-list">
                <h3>Possible Conditions</h3>
                {analysis.possibleConditions?.map((condition, index) => (
                  <div key={index} className="condition-card">
                    <div className="condition-header">
                      <h4 className="condition-name">{condition.name}</h4>
                      <span className={`probability-badge ${condition.probability}`}>
                        {condition.probability} probability
                      </span>
                    </div>
                    <p className="condition-description">{condition.description}</p>
                    <div className="condition-reasoning">
                      <strong>Reasoning:</strong> {condition.reasoning}
                    </div>
                  </div>
                ))}
              </div>

              <div className="recommendations-section">
                <h3>
                  <CheckCircle size={24} />
                  Recommended Next Steps
                </h3>
                <ul className="recommendations-list">
                  {analysis.recommendations?.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              {analysis.whenToSeekHelp && (
                <div className="advice-section" style={{ background: '#fee2e2', borderLeft: '4px solid #ef4444' }}>
                  <h3>
                    <AlertCircle size={24} />
                    When to Seek Medical Help
                  </h3>
                  <p style={{ color: '#991b1b', lineHeight: 1.6 }}>{analysis.whenToSeekHelp}</p>
                </div>
              )}

              {analysis.generalAdvice && (
                <div className="advice-section">
                  <h3>
                    <Heart size={24} />
                    General Health Advice
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{analysis.generalAdvice}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultationDetail;
