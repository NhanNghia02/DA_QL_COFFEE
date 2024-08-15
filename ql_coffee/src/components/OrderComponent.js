import React, { useState, useEffect } from "react";
import { db } from '../model/Firebase-config';
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import ConfinModal from "../model/ConfinModel";
import { useNavigate } from 'react-router-dom';
import '../layouts/css/Table.css';

function OrderComponent() {
    const [tables, setTables] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tablesPerPage] = useState(5);
    const [showConfirm, setShowConfirm] = useState(false);
    const [tableIdToDelete, setTableIdToDelete] = useState(null);
    const navigate = useNavigate();
    const tablesCollectionRef = collection(db, 'tables');

    useEffect(() => {
        fetchOrders();
        fetchTables();
    });
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const ordersCollectionRef = collection(db, 'orders');
            const ordersSnapshot = await getDocs(ordersCollectionRef);
            const ordersArray = ordersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setOrders(ordersArray);
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    };

    const fetchTables = async () => {
        try {
            const ordersCollectionRef = collection(db, 'orders');
            const ordersQuery = query(ordersCollectionRef, where('tableId', '!=', null));
            const ordersSnapshot = await getDocs(ordersQuery);
            const orderTableIds = ordersSnapshot.docs.map(doc => doc.data().tableId);

            const data = await getDocs(tablesCollectionRef);
            const tablesArray = data.docs
                .map(doc => ({ ...doc.data(), id: doc.id }))
                .filter(table => orderTableIds.includes(table.id));;

            tablesArray.sort((a, b) => parseInt(a.number) - parseInt(b.number));
            setTables(tablesArray);
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    };

    const handleOrderViewDetail = (tableNumber) => {
        const table = tables.find(t => t.number === tableNumber);
        if (table) {
            const order = orders.find(order => order.tableId === table.id);
            if (order) {
                navigate(`/admin/orders/${table.number.padStart(2, '0')}`, { state: { orderId: order.id } });
            } else {
                console.error("Không tìm thấy đơn hàng");
            }
        }
    };

    const handleOrderDelete = (tableId) => {
        setTableIdToDelete(tableId);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            if (tableIdToDelete) {
                const ordersCollectionRef = collection(db, 'orders');
                const ordersQuery = query(ordersCollectionRef, where('tableId', '==', tableIdToDelete));
                const ordersSnapshot = await getDocs(ordersQuery);
                const ordersToDelete = ordersSnapshot.docs.map(doc => doc.id);
                for (const orderId of ordersToDelete) {
                    await deleteDoc(doc(db, 'orders', orderId));
                }
                fetchTables();
                setTableIdToDelete(null);
                setShowConfirm(false);
            }
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    };

    const indexOfLastTable = currentPage * tablesPerPage;
    const indexOfFirstTable = indexOfLastTable - tablesPerPage;
    const currentTables = tables.slice(indexOfFirstTable, indexOfLastTable);
    const totalPages = Math.ceil(tables.length / tablesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Đơn Hàng</h1>
            </div>

            <div className="floor-plan mt-3">
                {tables.length > 0 ? (
                    <div>
                        {currentTables.length > 0 ? (
                            currentTables.map(table => (
                                <div key={table.id} className="floor-plan-row">
                                    <div className="table mt-2">
                                        <span className="table-number">Bàn Số <strong>{table.number.padStart(2, '0')}</strong> Đã Được Order</span>
                                    </div>
                                    <div className="table-actions">
                                        <button className="btn btn-success mx-2" onClick={() => handleOrderViewDetail(table.number)}>
                                            Xem Chi Tiết
                                        </button>
                                        <button className="btn btn-danger mx-2" onClick={() => handleOrderDelete(table.id)}>
                                            Xóa Order
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có orders nào</p>
                        )}
                    </div>
                ) : (
                    <p>Đang tải...</p>
                )}
            </div>

            {tables.length > tablesPerPage && (
                <div className="pagination-container">
                    <div className="pagination d-flex justify-content-center mt-3">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`btn ${currentPage === index + 1 ? "btn-primary" : "btn-secondary"} mx-1`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <ConfinModal
                show={showConfirm}
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
                message="Bạn có chắc muốn xóa order này không?"
            />
        </div>
    );
}

export default OrderComponent;
