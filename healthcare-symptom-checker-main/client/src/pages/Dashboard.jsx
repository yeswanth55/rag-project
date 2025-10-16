import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, LogOut, Stethoscope, History, Activity, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { getStats } from '../api/api';

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
            <Link to="/dashboard" className="nav-link active">
              <Activity size={20} />
              Dashboard
            </Link>
            <Link to="/check-symptoms" className="nav-link">
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
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {user?.username}! 👋</h1>
          <p className="dashboard-subtitle">
            Your personal AI-powered health assistant is ready to help
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FileText size={28} />
            </div>
            <div className="stat-value">
              {loading ? '...' : stats?.totalConsultations || 0}
            </div>
            <div className="stat-label">Total Consultations</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={28} />
            </div>
            <div className="stat-value">
              {loading ? '...' : stats?.lastConsultation ? formatDate(stats.lastConsultation) : 'Never'}
            </div>
            <div className="stat-label">Last Check</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Activity size={28} />
            </div>
            <div className="stat-value">AI Powered</div>
            <div className="stat-label">Advanced Analysis</div>
          </div>
        </div>

        <div className="action-cards">
          <Link to="/check-symptoms" className="action-card">
            <div className="action-card-icon primary">
              <Stethoscope size={35} />
            </div>
            <h3>Check Symptoms</h3>
            <p>
              Describe your symptoms and get AI-powered insights about possible conditions
              and recommended next steps. Fast, accurate, and educational.
            </p>
          </Link>

          <Link to="/history" className="action-card">
            <div className="action-card-icon success">
              <History size={35} />
            </div>
            <h3>View History</h3>
            <p>
              Access your past consultations, track your health journey, and review
              previous AI analyses whenever you need them.
            </p>
          </Link>

          <div className="action-card">
            <div className="action-card-icon info">
              <AlertCircle size={35} />
            </div>
            <h3>Important Notice</h3>
            <p>
              This tool is for educational purposes only. Always consult with qualified
              healthcare professionals for medical advice and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
