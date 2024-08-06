import React, { useState, useEffect } from "react";
import { db } from '../Firebase-config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import ConfinModal from "../ConfinModel";
import '../layouts/css/Table.css';

function TableComponent() {
    const [tables, setTables] = useState([]);
    const [tableNumber, setTableNumber] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTableId, setEditingTableId] = useState(null);
    const [editNumber, setEditNumber] = useState("");
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [drinks, setDrinks] = useState([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const tablesCollectionRef = collection(db, 'tables');
    const drinksCollectionRef = collection(db, 'drinks');
    const ordersCollectionRef = collection(db, 'orders');

    useEffect(() => {
        fetchTables();
        fetchDrinks();
    });

    const fetchTables = async () => {
        try {
            const data = await getDocs(tablesCollectionRef);
            const tablesArray = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            tablesArray.sort((a, b) => parseInt(a.number) - parseInt(b.number));
            setTables(tablesArray);
        } catch (error) {
            console.error("Error fetching tables: ", error);
        }
    };

    const fetchDrinks = async () => {
        try {
            const data = await getDocs(drinksCollectionRef);
            const drinksArray = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setDrinks(drinksArray);
        } catch (error) {
            console.error("Error fetching drinks: ", error);
        }
    };

    const handleAddTable = () => {
        setEditingTableId(null);
        setTableNumber("");
        setIsFormVisible(true);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editingTableId) {
                const tableDoc = doc(db, 'tables', editingTableId);
                await updateDoc(tableDoc, { number: editNumber });
                setEditingTableId(null);
                setEditNumber("");
            } else {
                await addDoc(tablesCollectionRef, { number: tableNumber });
                setTableNumber("");
            }
            setIsFormVisible(false);
            fetchTables();
        } catch (error) {
            console.error("Error submitting form: ", error);
        }
    };

    const handleOrder = async (tableId) => {
        setSelectedTableId(tableId);
        setIsFormVisible(true);

        try {
            const orderData = await getDocs(ordersCollectionRef);
            const ordersArray = orderData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            const currentOrder = ordersArray.find(order => order.tableId === tableId);

            if (currentOrder) {
                setOrderDetails(currentOrder);
                setSelectedMenuItems(currentOrder.menuItems);
            } else {
                setOrderDetails(null);
                setSelectedMenuItems([]);
            }
        } catch (error) {
            console.error("Error fetching orders: ", error);
        }
    };

    const handleMenuItemChange = (event, itemId) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedMenuItems([...selectedMenuItems, itemId]);
        } else {
            setSelectedMenuItems(selectedMenuItems.filter(id => id !== itemId));
        }
    };

    const calculateTotalAmount = () => {
        const selectedDrinks = drinks.filter(drink => selectedMenuItems.includes(drink.id));
        return selectedDrinks.reduce((total, drink) => total + parseFloat(drink.price), 0);
    };

    const handleOrderSubmit = async (event) => {
        event.preventDefault();
        try {
            const orderDocRef = doc(ordersCollectionRef, `${selectedTableId}_${Date.now()}`);
            const totalAmount = calculateTotalAmount();
            await setDoc(orderDocRef, {
                tableId: selectedTableId,
                menuItems: selectedMenuItems,
                timestamp: new Date(),
                totalAmount: totalAmount,
            });
            setSelectedTableId(null);
            setSelectedMenuItems([]);
            setOrderDetails({
                tableId: selectedTableId,
                menuItems: selectedMenuItems,
                totalAmount: totalAmount
            });
            setIsFormVisible(false);
        } catch (error) {
            console.error("Error placing order: ", error);
        }
    };

    const handleEdit = (table) => {
        setEditingTableId(table.id);
        setEditNumber(table.number);
        setIsFormVisible(true);
    };

    const handleDelete = async (tableId) => {
        setShowConfirm(true);
        setSelectedTableId(tableId);
    };

    const confirmDelete = async () => {
        try {
            const tableDoc = doc(db, 'tables', selectedTableId);
            await deleteDoc(tableDoc);
            fetchTables();
            setShowConfirm(false);
        } catch (error) {
            console.error("Error deleting table: ", error);
        }
    };

    const handleInputChange = (event) => {
        if (editingTableId) {
            setEditNumber(event.target.value);
        } else {
            setTableNumber(event.target.value);
        }
    };

    return (
        <div className="container">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Sơ Đồ Số Bàn</h1>
                <button className="btn btn-success" onClick={handleAddTable}>
                    Thêm Bàn
                </button>
            </div>

            {isFormVisible && (
                selectedTableId ? (
                    <form onSubmit={handleOrderSubmit} className="order-form">
                        <p>Chọn Đồ Uống</p>
                        {drinks.length > 0 ? (
                            drinks.map(drink => (
                                <div key={drink.id} className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`drink${drink.id}`}
                                        checked={selectedMenuItems.includes(drink.id)}
                                        onChange={(e) => handleMenuItemChange(e, drink.id)}
                                    />
                                    <label className="form-check-label" htmlFor={`drink${drink.id}`}>
                                        {drink.name} - {drink.price} VNĐ
                                    </label>
                                </div>
                            ))
                        ) : (
                            <p>Đang tải đồ uống...</p>
                        )}
                        <p>Tổng tiền: {calculateTotalAmount()} VNĐ</p>
                        <button type="submit" className="btn btn-success mx-2 mt-3">
                            Chọn Món
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary mt-3"
                            onClick={() => setIsFormVisible(false)}
                        >
                            Hủy
                        </button>

                        {orderDetails && (
                            <div className="order-summary mt-3">
                                <h4>Chi tiết đơn hàng:</h4>
                                <p>Bàn số: {orderDetails.tableId}</p>
                                <p>Đồ uống đã chọn:</p>
                                <ul>
                                    {drinks.filter(drink => orderDetails.menuItems.includes(drink.id)).map(drink => (
                                        <li key={drink.id}>{drink.name} - {drink.price} VNĐ</li>
                                    ))}
                                </ul>
                                <p>Tổng tiền: {orderDetails.totalAmount} VNĐ</p>
                            </div>
                        )}
                    </form>
                ) : (
                    <form onSubmit={handleFormSubmit} className="add-table-form">
                        <div className="form-group">
                            <label className="label-control">Số Bàn:</label>
                            <input
                                className="form-control"
                                type="text"
                                id="tableNumber"
                                value={editingTableId ? editNumber : tableNumber}
                                onChange={handleInputChange}
                                required
                                placeholder="Nhập số bàn..."
                            />
                        </div>
                        <button type="submit" className="btn btn-success mx-2">
                            {editingTableId ? "Lưu" : "Thêm"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsFormVisible(false)}
                        >
                            Hủy
                        </button>
                    </form>
                )
            )}

            <div className="floor-plan mt-3">
                {tables.length > 0 ? (
                    tables.map(table => (
                        <div key={table.id} className="floor-plan-row">
                            <div className="table mt-2">
                                <span className="table-number">Bàn Số {table.number}</span>
                            </div>
                            <div className="table-actions">
                                <button className="btn btn-primary mx-2" onClick={() => handleOrder(table.id)}>
                                    <i className="fa fa-check-circle"></i> Chọn
                                </button>
                                <button className="btn btn-primary mx-2" onClick={() => handleOrder(table.id)}>
                                    <i className="fa fa-eye"></i> Xem
                                </button>
                                <button className="btn btn-warning mx-2" onClick={() => handleEdit(table)}>
                                    <i className="fa fa-edit"></i> Sửa
                                </button>
                                <button className="btn btn-danger mx-2" onClick={() => handleDelete(table.id)}>
                                    <i className="fa fa-close"></i> Xóa
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Đang tải...</p>
                )}
            </div>
            <ConfinModal
                show={showConfirm} 
                onConfirm={confirmDelete} 
                onCancel={() => setShowConfirm(false)} 
                message="Bạn có chắc chắn muốn xóa?" 
            />
        </div>
    );
}

export default TableComponent;
