import React, { useState, useEffect } from "react";
import '../layouts/css/Home.css';
import { db } from '../Firebase-config';
import { collection, getDocs } from 'firebase/firestore';

function HomeComponent() {
    const [totalTables, setTotalTables] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tablesCollectionRef = collection(db, 'tables');
                const data = await getDocs(tablesCollectionRef);
                const tablesArray = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setTotalTables(tablesArray.length);
            } catch (error) {
                console.error("Lỗi: ", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Thống Kê Số Lượng</h1>
            </div>
            <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Tổng Số Lượng Bàn
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        <a href="/admin/table">
                                            Tổng {totalTables} Bàn
                                        </a>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fa-solid fa-table fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-warning shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Tổng Số Đơn Hàng
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        <a href="/admin/orders">
                                            10 Đơn Hàng
                                        </a>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fa-solid fa-receipt fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Tổng Số Khách Hàng
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        <a href="/admin/customers">
                                            10 Khách Hàng
                                        </a>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fa-solid fa-user-group fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Tổng Số Nhân Viên
                                    </div>
                                    <div className="row no-gutters align-items-center">
                                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                            <a href="/admin/employees">
                                                10 Nhân Viên
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fa-solid fa-users fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-8 col-lg-7">
                    <div className="card-body">
                        <div className="chart-area">
                            <canvas id="myChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeComponent;
