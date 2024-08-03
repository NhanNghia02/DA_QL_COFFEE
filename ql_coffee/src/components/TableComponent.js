import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Sử dụng hook useNavigate để điều hướng
import { db } from '../Firebase-config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import '../layouts/css/Table.css';

function TableComponent() {
    const [tables, setTables] = useState([]);
    const [tableNumber, setTableNumber] = useState("");
    const [tablePrice, setTablePrice] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [itemImage, setItemImage] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTableId, setEditingTableId] = useState(null);
    const [editNumber, setEditNumber] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editItems, setEditItems] = useState([]);

    const usersCollectionRef = collection(db, 'tables');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const data = await getDocs(usersCollectionRef);
            const tablesArray = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            tablesArray.sort((a, b) => parseInt(a.number) - parseInt(b.number));
            setTables(tablesArray);
        } catch (error) {
            console.error("Lỗi hiển thị: ", error);
        }
    };

    const handleAddTable = () => {
        setEditingTableId(null);
        setIsFormVisible(true);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editingTableId) {
                const tableDoc = doc(db, 'tables', editingTableId);
                await updateDoc(tableDoc, { number: editNumber, price: editPrice, items: editItems });
                setEditingTableId(null);
                setEditNumber("");
                setEditPrice("");
                setEditItems([]);
            } else {
                await addDoc(usersCollectionRef, { number: tableNumber, price: tablePrice, items: [] });
                setTableNumber("");
                setTablePrice("");
            }
            setIsFormVisible(false);
            fetchTables();
        } catch (error) {
            console.error("Lỗi: ", error);
        }
    };

    const handleEdit = (table) => {
        setEditingTableId(table.id);
        setEditNumber(table.number);
        setEditPrice(table.price);
        setEditItems(table.items || []);
        setIsFormVisible(true);
    };

    const handleDelete = async (tableId) => {
        try {
            const tableDoc = doc(db, 'tables', tableId);
            await deleteDoc(tableDoc);
            fetchTables();
        } catch (error) {
            console.error("Lỗi xóa: ", error);
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (editingTableId) {
            if (id === "editNumber") setEditNumber(value);
            else if (id === "editPrice") setEditPrice(value);
            else if (id === "itemName") setItemName(value);
            else if (id === "itemPrice") setItemPrice(value);
            else if (id === "itemImage") setItemImage(value);
        } else {
            if (id === "tableNumber") setTableNumber(value);
            else if (id === "tablePrice") setTablePrice(value);
            else if (id === "itemName") setItemName(value);
            else if (id === "itemPrice") setItemPrice(value);
            else if (id === "itemImage") setItemImage(value);
        }
    };

    const handleAddItem = () => {
        if (!itemName.trim() || !itemPrice.trim() || !itemImage.trim()) return;

        const newItem = { id: Date.now().toString(), name: itemName, price: parseInt(itemPrice), image: itemImage };
        setEditItems([...editItems, newItem]);
        setItemName("");
        setItemPrice("");
        setItemImage("");
    };

    const handleDeleteItem = (itemId) => {
        const updatedItems = editItems.filter(item => item.id !== itemId);
        setEditItems(updatedItems);
    };

    const handlePayment = (table) => {
        // Chuyển hướng đến trang hóa đơn với thông tin bàn
        navigate('/order', { state: { table } });
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 text-gray-800">Sơ Đồ Số Bàn</h1>
                <button className="btn btn-success" onClick={handleAddTable}>
                    Thêm Bàn
                </button>
            </div>

            {isFormVisible && (
                <form onSubmit={handleFormSubmit} className="card p-3 mb-3">
                    <div className="form-group">
                        <label htmlFor="tableNumber">Số Bàn:</label>
                        <input
                            className="form-control"
                            type="text"
                            id={editingTableId ? "editNumber" : "tableNumber"}
                            value={editingTableId ? editNumber : tableNumber}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập số bàn..."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tablePrice">Giá Tiền:</label>
                        <input
                            className="form-control"
                            type="number"
                            id={editingTableId ? "editPrice" : "tablePrice"}
                            value={editingTableId ? editPrice : tablePrice}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập giá tiền..."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemName">Món Nước:</label>
                        <div className="input-group">
                            <input
                                className="form-control"
                                type="text"
                                id="itemName"
                                value={itemName}
                                onChange={handleInputChange}
                                placeholder="Tên món..."
                            />
                            <input
                                className="form-control"
                                type="number"
                                id="itemPrice"
                                value={itemPrice}
                                onChange={handleInputChange}
                                placeholder="Giá tiền..."
                            />
                            <input
                                className="form-control"
                                type="text"
                                id="itemImage"
                                value={itemImage}
                                onChange={handleInputChange}
                                placeholder="URL ảnh..."
                            />
                            <div className="input-group-append">
                                <button type="button" className="btn btn-primary" onClick={handleAddItem}>
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        {editItems.map(item => (
                            <div key={item.id} className="d-flex align-items-center justify-content-between mb-2">
                                <img src={item.image} alt={item.name} className="img-thumbnail mr-2" style={{ width: 50, height: 50 }} />
                                <span>{item.name} - {item.price} VND</span>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteItem(item.id)}
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="text-right">
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
                    </div>
                </form>
            )}

            <div className="row">
                {tables.length > 0 ? (
                    tables.map(table => (
                        <div key={table.id} className="col-md-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Bàn {table.number}</h5>
                                    <p className="card-text">Giá: {table.price} VND</p>
                                    <ul className="list-group list-group-flush">
                                        {table.items && table.items.length > 0 && (
                                            table.items.map(item => (
                                                <li key={item.id} className="list-group-item">
                                                    <div className="d-flex align-items-center">
                                                        <img src={item.image} alt={item.name} className="img-thumbnail mr-3" style={{ width: 50, height: 50 }} />
                                                        <div>
                                                            <p className="mb-0">{item.name}</p>
                                                            <p className="mb-0 text-muted">{item.price} VND</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                    <div className="d-flex justify-content-end mt-3">
                                        <button className="btn btn-warning mx-2" onClick={() => handleEdit(table)}>
                                            <i className="fa fa-pencil-square"></i> Sửa
                                        </button>
                                        <button className="btn btn-danger mx-2" onClick={() => handleDelete(table.id)}>
                                            <i className="fa fa-close"></i> Xóa
                                        </button>
                                        <button className="btn btn-success" onClick={() => handlePayment(table)}>
                                            Thanh Toán
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Chưa có bàn nào</p>
                )}
            </div>
        </div>
    );
}

export default TableComponent;
