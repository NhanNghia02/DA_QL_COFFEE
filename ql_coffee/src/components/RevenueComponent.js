import React, { useState, useEffect } from "react";
import { db } from '../model/Firebase-config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";


function RevenueComponent() {
    const [revenues, setRevenues] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingRevenueId, setEditingRevenueId] = useState(null);
    const [tableName, setTableName] = useState("");
    const [price, setPrice] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [nextRevenueId, setNextRevenueId] = useState(1); // Bắt đầu với ID là 1

    const revenueCollectionRef = collection(db, 'revenues'); // Sử dụng collection phù hợp với Firestore của bạn

    useEffect(() => {
        fetchRevenues();
    });

    const fetchRevenues = async () => {
        try {
            const data = await getDocs(revenueCollectionRef);
            const revenuesArray = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setRevenues(revenuesArray);
            // Cập nhật nextRevenueId dựa trên số lượng doanh thu hiện có
            if (revenuesArray.length > 0) {
                const maxId = Math.max(...revenuesArray.map(revenue => revenue.id));
                setNextRevenueId(maxId + 1);
            } else {
                setNextRevenueId(1);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu doanh thu: ", error);
        }
    };

    const handleAddRevenue = () => {
        setEditingRevenueId(null);
        setTableName("");
        setPrice("");
        setPaymentDate("");
        setIsFormVisible(true);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editingRevenueId) {
                const revenueDoc = doc(db, 'revenues', editingRevenueId);
                await updateDoc(revenueDoc, { tableName, price: parseInt(price), paymentDate: new Date(paymentDate) });
                setEditingRevenueId(null);
            } else {
                await addDoc(revenueCollectionRef, { id: nextRevenueId, tableName, price: parseInt(price), paymentDate: new Date(paymentDate) });
                setNextRevenueId(nextRevenueId + 1); // Tăng ID tiếp theo lên sau khi thêm
            }
            setIsFormVisible(false);
            fetchRevenues();
        } catch (error) {
            console.error("Lỗi khi thêm/sửa dữ liệu doanh thu: ", error);
        }
    };

    const handleEdit = (revenue) => {
        setEditingRevenueId(revenue.id);
        setTableName(revenue.tableName);
        setPrice(revenue.price);
        setPaymentDate(new Date(revenue.paymentDate.seconds * 1000).toISOString().split('T')[0]); // Chuyển đổi timestamp thành định dạng ngày
        setIsFormVisible(true);
    };

    const handleDelete = async (revenueId) => {
        try {
            const revenueDoc = doc(db, 'revenues', revenueId);
            await deleteDoc(revenueDoc);
            fetchRevenues();
        } catch (error) {
            console.error("Lỗi khi xóa dữ liệu doanh thu: ", error);
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        if (id === "tableName") setTableName(value);
        else if (id === "price") setPrice(value);
        else if (id === "paymentDate") setPaymentDate(value);
    };

    return (
        <div className="container">
            <h2 className="my-4">Doanh Thu</h2>

            <button className="btn btn-success mb-3" onClick={handleAddRevenue}>
                Thêm Doanh Thu
            </button>

            {isFormVisible && (
                <form onSubmit={handleFormSubmit} className="card p-3 mb-3">
                    <div className="form-group">
                        <label htmlFor="tableName">Tên Bàn:</label>
                        <input
                            className="form-control"
                            type="text"
                            id="tableName"
                            value={tableName}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập tên bàn..."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Giá Tiền:</label>
                        <input
                            className="form-control"
                            type="number"
                            id="price"
                            value={price}
                            onChange={handleInputChange}
                            required
                            placeholder="Nhập giá tiền..."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="paymentDate">Ngày Thanh Toán:</label>
                        <input
                            className="form-control"
                            type="date"
                            id="paymentDate"
                            value={paymentDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="btn btn-success mx-2">
                            {editingRevenueId ? "Lưu" : "Thêm"}
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

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Bàn</th>
                        <th>Giá Tiền</th>
                        <th>Ngày Thanh Toán</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {revenues.length > 0 ? (
                        revenues.map(revenue => (
                            <tr key={revenue.id}>
                                <td>{revenue.id}</td>
                                <td>{revenue.tableName}</td>
                                <td>{revenue.price} VND</td>
                                <td>{new Date(revenue.paymentDate.seconds * 1000).toLocaleDateString()}</td> {/* Giả định `paymentDate` là timestamp */}
                                <td>
                                    <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEdit(revenue)}>
                                        <i className="fa fa-pencil-square"></i> Sửa
                                    </button>
                                    <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(revenue.id)}>
                                        <i className="fa fa-trash"></i> Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">Chưa có doanh thu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default RevenueComponent;