import React from "react";
import '../layouts/css/Home.css';

function HomeComponent() {
    return (
        <div className="container">
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 class="h3 mb-0 text-gray-800">Thống Kê Số Lượng</h1>
            </div>
            <div class="row">
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-primary shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Tổng Số Lượng Bàn</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800"><a href="/admin/table">
                                        10 Số Bàn
                                    </a></div>
                                </div>
                                <div class="col-auto">
                                    <i class="fa-solid fa-table fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-warning shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Tổng Số Đơn Hàng</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800"><a href="/admin/orders">
                                        10 Đơn Hàng
                                    </a></div>
                                </div>
                                <div class="col-auto">
                                    <i class="fa-solid fa-receipt fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-success shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Tổng Số Khách Hàng</div>
                                    <div class="h5 mb-0 font-weight-bold text-gray-800"><a href="/admin/customers">
                                        10 Khách Hàng
                                    </a></div>
                                </div>
                                <div class="col-auto">
                                    <i class="fa-solid fa-user-group fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 mb-4">
                    <div class="card border-left-info shadow h-100 py-2">
                        <div class="card-body">
                            <div class="row no-gutters align-items-center">
                                <div class="col mr-2">
                                    <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Tổng Số Nhân Viên
                                    </div>
                                    <div class="row no-gutters align-items-center">
                                        <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800"><a href="/admin/employees">
                                            10 Nhân Viên
                                        </a></div>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <i class="fa-solid fa-users fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xl-8 col-lg-7">
                    <div class="card-body">
                        <div class="chart-area">
                            <canvas id="myChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeComponent;