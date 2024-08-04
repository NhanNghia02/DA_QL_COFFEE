import React, { useState, useEffect } from "react";
import { db } from '../Firebase-config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import '../layouts/css/Table.css';

function TableComponent() {
    const [tables, setTables] = useState([]);
    const [tableNumber, setTableNumber] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTableId, setEditingTableId] = useState(null);
    const [editNumber, setEditNumber] = useState("");

    const usersCollectionRef = collection(db, 'tables');

    useEffect(() => {
        fetchTables();
    });

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
                await updateDoc(tableDoc, { number: editNumber });
                setEditingTableId(null);
                setEditNumber("");
            } else {
                await addDoc(usersCollectionRef, { number: tableNumber });
                setTableNumber("");
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
        if (editingTableId) {
            setEditNumber(event.target.value);
        } else {
            setTableNumber(event.target.value);
        }
    };

    const handleView = (event) => {

    }

    return (
        <div className="container">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Sơ Đồ Số Bàn</h1>
                <button className="btn btn-success" onClick={handleAddTable}>
                    Thêm Bàn
                </button>
            </div>

            {isFormVisible && (
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
            )}

            <div className="floor-plan mt-3">
                {tables.length > 0 ? (
                    tables.map(table => (
                        <div key={table.id} className="floor-plan-row">
                            <div className="table mt-2">
                                <span className="table-number">Bàn Số {table.number}</span>
                            </div>
                            <div className="table-actions">
                                <button className="btn btn-success mx-2" onClick={() => handleView(table.id)}>
                                    <i className="fa fa-eye"></i> Xem
                                </button>
                                <button className="btn btn-warning mx-2" onClick={() => handleEdit(table)}>
                                    <i className="fa fa-pencil-square"></i> Sửa
                                </button>
                                <button className="btn btn-danger mx-2" onClick={() => handleDelete(table.id)}>
                                    <i className="fa fa-close"></i> Xóa
                                </button>
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
