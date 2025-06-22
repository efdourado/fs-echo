import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">Admin Panel</h2>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className="admin-nav-link">Dashboard</NavLink>
          <NavLink to="/admin/artists" className="admin-nav-link">Artists</NavLink>
          <NavLink to="/admin/albums" className="admin-nav-link">Albums</NavLink>
          <NavLink to="/admin/songs" className="admin-nav-link">Songs</NavLink>
          <NavLink to="/admin/users" className="admin-nav-link">Users</NavLink>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet /> 
      </main>
    </div>
); };

export default AdminLayout;