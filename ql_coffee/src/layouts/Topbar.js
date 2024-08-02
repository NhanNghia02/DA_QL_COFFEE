import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Topbar.css';

const Topbar = () => {
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        console.log('User logged out');
    };

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow mx-3">
                    <a className="nav-link dropdown-toggle" href="#!" id="notificationsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => setShowNotifications(!showNotifications)}>
                        <i className="fas fa-bell fa-fw"></i>
                        <span className="badge badge-danger badge-counter">3+</span>
                    </a>
                    {showNotifications && (
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="notificationsDropdown">
                            <h6 className="dropdown-header">Thông báo</h6>
                            <a className="dropdown-item" href="/dd">
                                <i className="fas fa-envelope fa-sm fa-fw mr-2 text-gray-400"></i>
                                Bàn 12 có một order mới
                            </a>
                            <a className="dropdown-item" href="/dd">
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                Bàn 10 có một order mới
                            </a>
                            <a className="dropdown-item" href="/dd">
                                <i className="fas fa-file-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Bàn 05 khách thanh toán tiền
                            </a>
                        </div>
                    )}
                </li>

                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" href="/dd" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">Coffee 18</span>
                        <i className="fa-solid fa-user"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                        <Link className="dropdown-item" to="/profile">
                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Hồ sơ
                        </Link>
                        <Link className="dropdown-item" to="/singin">
                        <i className="fas fa-sign-in-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Đăng Nhập
                        </Link>
                        <a className="dropdown-item" href="/dd" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Đăng xuất
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default Topbar;
