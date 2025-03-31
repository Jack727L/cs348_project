import React, { useState, useEffect, useRef } from 'react';
import { fetchNotifications } from '../api/favoritesApi';
import { getUserId } from '../utils/authUtils';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      getNotifications(userId);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNotifications = async (userId) => {
    try {
      const data = await fetchNotifications(userId);
      setNotifications(data);

      setUnreadCount(data.length > 0 ? data.length : 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {

      setUnreadCount(0);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="notifications-container" ref={notificationRef}>
      <div className="notification-bell" onClick={toggleNotifications}>
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </div>
      
      {showNotifications && (
        <div className="notifications-dropdown">
          <h3>Notifications</h3>
          {notifications.length > 0 ? (
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li key={notification.notification_id} className="notification-item">
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{formatDate(notification.created_at)}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-notifications">No notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications; 