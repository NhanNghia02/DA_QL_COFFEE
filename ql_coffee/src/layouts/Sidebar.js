import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar bg-gradient-primary sidebar-dark accordion" id="accordionSidebar">
      <nav>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className={`nav-link d-flex align-items-center justify-content-center`} to="/">
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fa-solid fa-coffee"></i>
              </div>
              <div className="sidebar-brand-text mx-2">COFFEE 18 MANAGER</div>
            </Link>
          </li>

          <hr className="sidebar-divider my-0" />

          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/dashboard')}`} to="/admin/dashboard">
              <i className="fas fa-tachometer-alt"></i>
              <span>Thống Kê</span>
            </Link>
          </li>
          
          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/menus')}`} to="/admin/menus">
              <i className="fa fa-coffee fa-question-circle"></i>
              <span>Thực Đơn</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/table')}`} to="/admin/table">
              <i className="fa-solid fa-table"></i>
              <span>Số Bàn</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/orders')}`} to="/admin/orders">
              <i className="fa-solid fa-receipt"></i>
              <span>Đơn Hàng</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/customers')}`} to="/admin/customers">
              <i className="fa-solid fa-users"></i>
              <span>Khách Hàng</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/employees')}`} to="/admin/employees">
              <i className="fa-solid fa-user-group"></i>
              <span>Nhân Viên</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/accounts')}`} to="/admin/accounts">
              <i className="fa-solid fa-user"></i>
              <span>Tài Khoản</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/comments')}`} to="/admin/comments">
              <i className="fas fa-comments"></i>
              <span>Bình Luận</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
