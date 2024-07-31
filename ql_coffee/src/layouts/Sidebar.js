import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar bg-gradient-primary sidebar-dark accordion" id="accordionSidebar">
      <nav>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link d-flex align-items-center justify-content-center" to="/admin">
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fa-solid fa-mobile"></i>
              </div>
              <div className="sidebar-brand-text mx-3">BAR MANAGER</div>
            </Link>
          </li>

          <hr className="sidebar-divider my-0" />

          <li className="nav-item active">
            <Link className="nav-link" to="/admin">
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span>Thống Kê</span>
            </Link>
          </li>

          <hr className="sidebar-divider" />

          <li className="nav-item">
            <Link className="nav-link" to="/admin/category/list">
              <i className="fa-solid fa-mobile-screen-button"></i>
              <span>Số bàn</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className="nav-link" to="/products">
              <i className="fa-solid fa-shop"></i>
              <span>Khách hàng</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className="nav-link" to="/accounts">
              <i className="fa-solid fa-user"></i>
              <span>Nhân viên</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className="nav-link" to="/orders">
              <i className="fa-solid fa-box"></i>
              <span>Đơn Hàng</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className="nav-link" to="/comments">
              <i className="fas fa-comments"></i>
              <span>Bình Luận</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <li className="nav-item">
            <Link className="nav-link" to="/questions">
              <i className="fa-regular fa-circle-question"></i>
              <span>Câu Hỏi</span>
            </Link>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
