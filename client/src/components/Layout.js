import React, { useState } from 'react';
import '../layout.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Avatar, Badge } from 'antd';

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-heart-line",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-3-fill",
    },
    {
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "ri-hospital-line",
    }
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-heart-line",
    },
    {
      name: "Users",
      path: "/users",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: "ri-user-star-line",
    },
  ];

  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-heart-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-3-fill",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-3-fill",
    },
  ];

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  const role = user?.isAdmin
  ? "Admin"
  : user?.isDoctor
  ? "Doctor"
  : "User";

  return (
    <div className="main p-2">
      <div className="d-flex layout">
        <div className={`${collapsed ? "collapsed-sidebar" : "sidebar"}`}>
          <div className="sidebar-header">
            <h1>{collapsed ? "TC" : "T-Care"}</h1>
          </div>
          <h1 className='normal-text'>{role}</h1>
          <div className="menu">
            {menuToBeRendered.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={index}
                  className={`d-flex menu-item ${isActive ? "active-menu-item" : ""}`}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div className={'d-flex menu-item'} onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}
              >
                <i className="ri-logout-circle-line"></i>
                {!collapsed && <Link to="/login">Logout</Link>}
              </div>
          </div>
        </div>
        <div className='content'>
          <div className='header'>
            {collapsed ? <i className="ri-menu-3-fill header-action-icon" onClick={() => setCollapsed(false)}></i> : <i className="ri-close-circle-line header-action-icon" onClick={() => setCollapsed(true)}></i>}
            <div className='d-flex align-items-center px-4'>
              <Badge count={user?.unseenNotifications.length} onClick={() => navigate('/notifications')}>
                <i className="ri-notification-3-fill header-action-icon px-3"></i>
              </Badge>
              
              <Link className='anchor mx-3' to="/profile" >{user?.name}</Link>
            </div>
          </div>
          <div className='body'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
