import React, { useState, useEffect } from "react";
import '../layouts/css/Home.css';
import { db } from '../model/Firebase-config';
import { collection, getDocs } from 'firebase/firestore';

function HomeComponent() {
    const [totalTables, setTotalTables] = useState(0);
    const [totalDrinks, setTotalDrinks] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalEmployees, setTotalEmployees] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hiển thị số lượng bàn
                const tablesCollectionRef = collection(db, 'tables');
                const tablesData = await getDocs(tablesCollectionRef);
                const tablesArray = tablesData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setTotalTables(tablesArray.length);

                // Hiển thị số lượng thực đơn
                const drinksCollectionRef = collection(db, 'drinks');
                const drinksData = await getDocs(drinksCollectionRef);
                const drinksArray = drinksData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setTotalDrinks(drinksArray.length);

                // Hiển thị số lượng danh mục
                const categoriesCollectionRef = collection(db, 'categories');
                const categoriesData = await getDocs(categoriesCollectionRef);
                const cateArray = categoriesData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setTotalCategories(cateArray.length);

                // Hiển thị số lượng đơn hàng
                const ordersCollectionRef = collection(db, 'orders');
                const ordersData = await getDocs(ordersCollectionRef);
                const ordersArray = ordersData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setTotalOrders(ordersArray.length);

                // Hiển thị số lượng khách hàng
                const customersCollectionRef = collection(db, 'customers');
                const customersData = await getDocs(customersCollectionRef);
                const customersArray = customersData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setTotalCustomers(customersArray.length);

                // Hiển thị số lượng nhân viên
                const employeesCollectionRef = collection(db, 'employees');
                const employeesData = await getDocs(employeesCollectionRef);
                const employeesArray = employeesData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setTotalEmployees(employeesArray.length);

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
                <div className="col-xl-6 col-md-6 mb-4">
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
                <div className="col-xl-6 col-md-6 mb-4">
                    <div className="card border-left-warning shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Tổng Số Đơn Hàng
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        <a href="/admin/orders">
                                            Tổng {totalOrders} Đơn Hàng
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
            </div>
            <div className="row">
                <div className="col-xl-6 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Tổng Số Khách Hàng
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        <a href="/admin/customers">
                                            Tổng {totalCustomers} Khách Hàng
                                        </a>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fa-solid fa-users fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Tổng Số Nhân Viên
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        <a href="/admin/employees">
                                            Tổng {totalEmployees} Nhân Viên
                                        </a>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fa-solid  fa-user-group fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-6 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                        Tổng Số Lượng Món Nước
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        <a href="/admin/drinks">
                                            Tổng {totalDrinks} Món Nước
                                        </a>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fa-solid fa-cocktail fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-muted text-uppercase mb-1">
                                        Tổng Số Lượng Danh Mục
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        <a href="/admin/categories">
                                            Tổng {totalCategories} Danh Mục
                                        </a>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fa fa-folder fa-2x text-gray-300"></i>
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
