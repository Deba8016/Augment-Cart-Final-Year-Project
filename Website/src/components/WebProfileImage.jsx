// components/WebProfileImage.js
import React, { useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUser } from '../api/User_API';

const URL = import.meta.env.VITE_APP_BACKEND_URL;

const WebProfileImage = ({ size}) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          const userFromDB = await getUser(decoded.id);
          console.log(userFromDB);
          setUserInfo(userFromDB);

        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUser();
  }, []);

  const firstLetter = userInfo?.name?.charAt(0)?.toUpperCase() || "G";

  const backgroundColor = useMemo(() => {
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#f44336', '#607d8b'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }, []);

  return (
    <div
      className="rounded-circle overflow-hidden d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: backgroundColor,
        height: `${size}px`,
        width: `${size}px`,
        aspectRatio: "1/1",
        border: "3px solid rgb(140, 208, 143)",
      }}
    >
      {userInfo ? (
        userInfo.image === "default" ? (
          // Show first letter if image is default
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
            {firstLetter}
          </span>
        ) : (
          // Show image if it's not default
          <img
            src={`${URL}/images/user-images/${userInfo.image}`}
            alt={userInfo?.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )
      ) : (
        // Show first letter if userInfo is not available
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
          {firstLetter}
        </span>
      )}
    </div>
  );
};

export default WebProfileImage;
