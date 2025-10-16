import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, Stethoscope, History as HistoryIcon, Activity, Trash2, Eye, FileText, AlertTriangle } from 'lucide-react';
import { getHistory, deleteConsultation } from '../api/api';

function History({ onLogout }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getHistory();
      setConsultations(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this consultation?')) return;

    try {
      await deleteConsultation(id);
      setConsultations(consultations.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting consultation:', err);
      alert('Failed to delete consultation');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/consultation/${id}`);
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

  const getSeverityClass = (severity) => {
    return severity || 'moderate';
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
            <Link to="/check-symptoms" className="nav-link">
              <Stethoscope size={20} />
              Check Symptoms
            </Link>
            <Link to="/history" className="nav-link active">
              <HistoryIcon size={20} />
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
        <div className="history-container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Consultation History</h1>
            <p className="dashboard-subtitle">
              Review your past symptom analyses and health insights
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading your consultations...</p>
            </div>
          ) : consultations.length === 0 ? (
            <div className="empty-state">
              <FileText size={80} />
              <h3>No Consultations Yet</h3>
              <p>Start by checking your symptoms to build your health history</p>
              <Link to="/check-symptoms" className="btn" style={{ maxWidth: '300px', margin: '0 auto' }}>
                <Stethoscope size={20} />
                Check Symptoms Now
              </Link>
            </div>
          ) : (
            <div className="history-grid">
              {consultations.map((consultation) => (
                <div 
                  key={consultation.id} 
                  className="history-card"
                  onClick={() => handleViewDetails(consultation.id)}
                >
                  <div className="history-header">
                    <div>
                      <div className={`urgency-badge ${getSeverityClass(consultation.severity)}`}>
                        <AlertTriangle size={16} />
                        {consultation.severity || 'moderate'}
                      </div>
                    </div>
                    <div className="history-date">
                      {formatDate(consultation.createdAt)}
                    </div>
                  </div>

                  <div className="history-symptoms">
                    <strong>Symptoms:</strong> {consultation.symptoms}
                  </div>

                  <div className="history-footer">
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(consultation.id)}
                    >
                      <Eye size={18} />
                      View Details
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={(e) => handleDelete(consultation.id, e)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
