import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../../api';
import ToggleMode from '../../ToggleMode';
import './BookAppointment.css';
import Footer from '../../common/Footer';


const BookAppointment = () => {
  const { doctorId } = useParams();
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Show and auto-dismiss short messages
  const showMessage = (text, success = false, autoHide = true) => {
    setMessage(text);
    setIsSuccess(success);
    if (autoHide) {
      setTimeout(() => {
        setMessage('');
      }, 1000); // Show for 1 second
    }
  };

  // Load draft on mount
  useEffect(() => {
    setTimeout(() => {
      setIsPageVisible(true);
    }, 100);

    const savedDraft = localStorage.getItem(`draft-${doctorId}`);
    if (savedDraft) {
      setReason(savedDraft);
      showMessage('📝 Draft loaded.', false, true);
    }
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await API.post('/auth/patient-dashboard/bookAppointment', {
        doctorId,
        reason,
      });

      showMessage(response.data.message, true, false); // Keep success visible
      setReason('');
      localStorage.removeItem(`draft-${doctorId}`);
    } catch (error) {
      console.error(error);
      showMessage(error.response?.data?.message || 'Something went wrong', false, false); // Keep error visible
    } finally {
      setLoading(false);
    }
  };

  const handleReasonChange = (e) => {
    const val = e.target.value;
    setReason(val);
    localStorage.setItem(`draft-${doctorId}`, val);
  };

  const handleDiscardDraft = () => {
    setReason('');
    localStorage.removeItem(`draft-${doctorId}`);
    showMessage('🗑️ Draft discarded.', false, true); // Auto hide in 1 sec
  };

  return (
    
    <div className='app-container'>

      <header className="main-header">
        <div className="header-content">
          <div className="logo-container">
            <h1 className="logo-text">HealthSetu</h1>
          </div>
          <div className="tagline-container">
            <span className="logo-tagline" >Your Health, Our Priority</span>
          </div>
          <div className="nav-menu">
            <Link to="find-doctors" smooth={true} offset={-100} duration={60} className="nav-link">Doctors</Link>
            <Link to="health-tips" smooth={true} offset={-100} duration={60} className="nav-link">Health Tips</Link>
            <Link to="feedback" smooth={true} offset={-100} duration={60} className="nav-link">Feedback</Link>
          </div>
        </div>
        <div className="theme-toggle-wrapper">
          <ToggleMode />
        </div>
      </header> 


      
    <div className={`appointment-container ${isPageVisible ? 'animate' : ''}`}>
      <div className="theme-toggle-wrapper">
        <ToggleMode />
      </div>
      <div className="appointment-form-container">
        <h2>Book an Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reason for Appointment:</label>
            <textarea
              value={reason}
              onChange={handleReasonChange}
              placeholder="Please describe your symptoms or reason for the appointment"
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
            {reason && (
              <button 
                type="button" 
                className="discard-btn" 
                onClick={handleDiscardDraft}
                disabled={loading}
              >
                Discard Draft
              </button>
            )}
          </div>
        </form>

        {message && (
          <div className={`message ${isSuccess ? 'success-message' : 'error-message'}`}>
            {message}
          </div>
        )}

        <Link to="/patient-Dashboard" className="back-link">
          Back to Dashboard
        </Link>
      </div>
      
    </div>
    <Footer />
    </div>
  );
};

export default BookAppointment;
