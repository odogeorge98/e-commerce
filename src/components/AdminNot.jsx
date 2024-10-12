import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';

const AdminNot = () => {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  // Fetch notifications when the component mounts
  useEffect(() => {
    axios.get('/notifications', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error("Error fetching notifications:", error);
      });
  }, []);

  const handleClick = (notificationId) => {
    navigate('/admin/notifications');
    // Optionally mark notification as read on click
    axios.patch(`/notifications/${notificationId}`, { read: true }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(() => {
        // Remove notification from local state or refetch notifications
        setNotifications(notifications.filter(notification => notification.id !== notificationId));
      })
      .catch(error => {
        console.error("Error updating notification:", error);
      });
    setShow(false);
  };

  return (
    <div>
      <AdminNavbar />
      <ToastContainer className="p-3" position="top-end">
        {notifications.map(notification => (
          <Toast key={notification.id} onClose={() => setShow(false)} show={show} bg="info" className="mb-2">
            <Toast.Body>
              <span>{notification.message}</span>
              <button
                className="btn btn-link"
                onClick={() => handleClick(notification.id)}
                style={{ marginLeft: '10px' }}
              >
                Go to Notifications
              </button>
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
};

export default AdminNot;
