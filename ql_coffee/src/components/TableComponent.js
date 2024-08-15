import React, { useState, useEffect } from "react";
import { db } from '../model/Firebase-config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import ConfinModal from "../model/ConfinModel";
import { useNavigate } from 'react-router-dom';
import '../layouts/css/Table.css';

function TableComponent() {
    const [tables, setTables] = useState([]);
    const [tableNumber, setTableNumber] = useState("");
    const [editingTableId, setEditingTableId] = useState(null);
    const [editNumber, setEditNumber] = useState("");
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [inputError, setInputError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [tablesPerPage] = useState(5);
    const navigate = useNavigate();
    const tablesCollectionRef = collection(db, 'tables');

    useEffect(() => {
        fetchTables();
    });

    const fetchTables = async () => {
        try {
            const data = await getDocs(tablesCollectionRef);
            const tablesArray = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            tablesArray.sort((a, b) => parseInt(a.number) - parseInt(b.number));
            setTables(tablesArray);
        } catch (error) {
            console.error("Lỗi hiển thị bàn: ", error);
        }
    };

    const handleAddTable = () => {
        setEditingTableId(null);
        setTableNumber("");
        setEditNumber("");
        setIsFormVisible(true);
        setErrorMessage("");
        setInputError("");
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const numberToCheck = editingTableId ? editNumber : tableNumber;
            const tableQuery = query(tablesCollectionRef, where("number", "==", numberToCheck));
            const querySnapshot = await getDocs(tableQuery);

            if (!/^\d{2}$/.test(numberToCheck)) {
                setInputError("Số bàn phải nhập hai chữ số.");
                return;
            }
            if (!editingTableId && !querySnapshot.empty) {
                setErrorMessage("Số bàn này đã tồn tại");
                return;
            }
            if (editingTableId) {
                if (!querySnapshot.empty && querySnapshot.docs[0].id !== editingTableId) {
                    setErrorMessage("Số bàn này đã tồn tại");
                    return;
                }
                const tableDoc = doc(db, 'tables', editingTableId);
                await updateDoc(tableDoc, { number: numberToCheck });
            } else {
                await addDoc(tablesCollectionRef, { number: numberToCheck });
            }

            fetchTables();
            setEditingTableId(null);
            setTableNumber("");
            setEditNumber("");
            setIsFormVisible(false);
            setErrorMessage("");
            setInputError("");
        }
        catch (error) {
            console.error("Lỗi: ", error);
            setErrorMessage("Lỗi. Vui lòng thử lại.");
        }
    };


    const handleOrder = (tableNumber) => {
        const table = tables.find(t => t.number === tableNumber);
        if (table) {
            navigate(`/admin/table/${table.number}`);
        } else {
            console.error("Bàn không tồn tại");
        }
    };

    const handleOrderView = () => {
            navigate(`/admin/orders`);   
    };

    const handleEdit = (table) => {
        setEditingTableId(table.id);
        setEditNumber(table.number);
        setIsFormVisible(true);
        setErrorMessage("");
    };

    const handleDelete = (tableId) => {
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
            console.error("Lỗi xóa bàn: ", error);
        }
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (/^\d{0,3}$/.test(value)) {
            if (editingTableId) {
                setEditNumber(value);
            } else {
                setTableNumber(value);
            }
            setInputError("");
        } else {
            setInputError("Số bà nhập tối đa là ba chữ số");
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
                <h1 className="h3 mb-0 text-gray-800">Sơ Đồ Số Bàn</h1>
                <button className="btn btn-success" onClick={handleAddTable}>
                    Thêm Bàn
                </button>
            </div>

            {isFormVisible && (
                <form onSubmit={handleFormSubmit} className="add-table-form">
                    <div className="form-group">
                        <label className="label-control">Nhập Số Bàn</label>
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
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    {inputError && <p className="text-danger">{inputError}</p>}
                    <button type="submit" className="btn btn-success mx-2">
                        {editingTableId ? "Lưu" : "Thêm"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setEditingTableId(null);
                            setTableNumber("");
                            setEditNumber("");
                            setIsFormVisible(false);
                            setErrorMessage("");
                            setInputError("");
                        }}
                    >
                        Hủy
                    </button>
                </form>
            )}

            <div className="floor-plan mt-3">
                {currentTables.length > 0 ? (
                    currentTables.map(table => (
                        <div key={table.id} className="floor-plan-row">
                            <div className="table mt-2">
                                <span className="table-number"><strong>Bàn Số {table.number.padStart(2, '0')}</strong></span>
                            </div>
                            <div className="table-actions">
                                <button className="btn btn-primary mx-2" onClick={() => handleOrder(table.number)}>
                                    <i className="fa fa-check-circle"></i> Chọn Món
                                </button>
                                <button className="btn btn-success mx-2" onClick={() => handleOrderView(table.id)}>
                                    <i className="fa fa-eye"></i> Xem Đơn Hàng
                                </button>
                                <button className="btn btn-warning mx-2" onClick={() => handleEdit(table)}>
                                    <i className="fa fa-edit"></i> Sửa Số Bàn
                                </button>
                                <button className="btn btn-danger mx-2" onClick={() => handleDelete(table.id)}>
                                    <i className="fa fa-close"></i> Xóa Bàn
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Đang tải...</p>
                )}
            </div>

            <div className="pagination-container">
                {tables.length > 5 && (
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
                )}
            </div>

            <ConfinModal
                show={showConfirm}
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
                message="Bạn có chắc muốn xóa bàn này không?"
            />
        </div>
    );
}

export default TableComponent;
