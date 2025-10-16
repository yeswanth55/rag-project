import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, LogOut, Stethoscope, History, Activity, AlertTriangle, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { analyzeSymptoms } from '../api/api';

function SymptomChecker({ onLogout }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [formData, setFormData] = useState({
    symptoms: '',
    age: '',
    gender: '',
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await analyzeSymptoms(formData);
      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <Link to="/check-symptoms" className="nav-link active">
              <Stethoscope size={20} />
              Check Symptoms
            </Link>
            <Link to="/history" className="nav-link">
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
          <div className="checker-card">
            <div className="checker-header">
              <h2>AI Symptom Checker</h2>
              <p>Describe your symptoms for an educational health analysis</p>
            </div>

            <div className="disclaimer-box">
              <h4>
                <AlertTriangle size={20} />
                Medical Disclaimer
              </h4>
              <p>
                This tool is for <strong>educational purposes only</strong> and should NOT be used 
                as a substitute for professional medical advice, diagnosis, or treatment. 
                Always seek the advice of your physician or other qualified health provider 
                with any questions you may have regarding a medical condition.
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="symptoms">Describe Your Symptoms *</label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder="Please describe your symptoms in detail. For example: 'I have been experiencing a persistent headache for 3 days, along with mild fever and fatigue...'"
                  required
                  minLength="10"
                  rows="6"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Age (Optional)</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Your age"
                    min="1"
                    max="120"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender (Optional)</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Stethoscope size={20} />
                    Analyze Symptoms
                  </>
                )}
              </button>
            </form>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Analyzing your symptoms with AI...</p>
            </div>
          )}

          {analysis && !loading && (
            <div className="analysis-container">
              <div className="analysis-header">
                <Stethoscope size={28} />
                <h3>Analysis Results</h3>
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

                <Link to="/history" className="btn" style={{ marginTop: '2rem' }}>
                  <History size={20} />
                  View All Consultations
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SymptomChecker;
