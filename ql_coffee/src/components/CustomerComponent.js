import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomerComponent() {
    const [user, setUser] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [editCustomer, setEditCustomer] = useState(null);
    const [newName, setNewName] = useState("");
    const [newImage, setNewImage] = useState("");
    const [newType, setNewType] = useState("Regular");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newPaymentAmount, setNewPaymentAmount] = useState("");
    const [newDateVisited, setNewDateVisited] = useState("");
    const [filterDate, setFilterDate] = useState("All");
    const [errors, setErrors] = useState({ name: "", phoneNumber: "", paymentAmount: "", dateVisited: "" });

    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchCustomers(user.uid);
            } else {
                setUser(null);
                setCustomers([]);
            }
        });

        return () => unsubscribe();
    });

    const fetchCustomers = async (userId) => {
        try {
            const q = query(collection(db, "customers"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const customerList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCustomers(customerList);
        } catch (err) {
            console.error("Error fetching customers: ", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "customers", id));
            setCustomers(customers.filter(customer => customer.id !== id));
        } catch (err) {
            console.error("Error deleting customer: ", err);
        }
    };

    const handleEdit = (customer) => {
        setEditCustomer(customer);
        setNewName(customer.name);
        setNewImage(customer.image);
        setNewType(customer.type);
        setNewPhoneNumber(customer.phoneNumber);
        setNewPaymentAmount(customer.paymentAmount);
        setNewDateVisited(customer.dateVisited);
    };

    const validateForm = () => {
        let hợpLệ = true;
        const lỗiMới = { name: "", phoneNumber: "", paymentAmount: "", dateVisited: "" };

        if (!newName.trim()) {
            lỗiMới.name = "Tên khách hàng là bắt buộc.";
            hợpLệ = false;
        }

        if (!newPhoneNumber.trim()) {
            lỗiMới.phoneNumber = "Số điện thoại là bắt buộc.";
            hợpLệ = false;
        } else if (customers.some(customer => customer.phoneNumber === newPhoneNumber && (!editCustomer || customer.id !== editCustomer.id))) {
            lỗiMới.phoneNumber = "Số điện thoại này đã tồn tại.";
            hợpLệ = false;
        }

        if (!newPaymentAmount.trim() || isNaN(newPaymentAmount)) {
            lỗiMới.paymentAmount = "Số tiền thanh toán hợp lệ là bắt buộc.";
            hợpLệ = false;
        }

        if (!newDateVisited.trim()) {
            lỗiMới.dateVisited = "Ngày ghé thăm là bắt buộc.";
            hợpLệ = false;
        }

        setErrors(lỗiMới);
        return hợpLệ;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            await updateDoc(doc(db, "customers", editCustomer.id), {
                name: newName,
                image: newImage,
                type: newType,
                phoneNumber: newPhoneNumber,
                paymentAmount: newPaymentAmount,
                dateVisited: newDateVisited
            });
            setCustomers(customers.map(customer =>
                customer.id === editCustomer.id
                    ? { ...customer, name: newName, image: newImage, type: newType, phoneNumber: newPhoneNumber, paymentAmount: newPaymentAmount, dateVisited: newDateVisited }
                    : customer
            ));
            setEditCustomer(null);
            setNewName("");
            setNewImage("");
            setNewType("Regular");
            setNewPhoneNumber("");
            setNewPaymentAmount("");
            setNewDateVisited("");
            setErrors({ name: "", phoneNumber: "", paymentAmount: "", dateVisited: "" });
        } catch (err) {
            console.error("Error updating customer: ", err);
        }
    };

    const handleAddCustomer = async () => {
        if (!validateForm()) return;

        try {
            const userId = user.uid;
            const docRef = await addDoc(collection(db, "customers"), {
                name: newName,
                type: newType,
                phoneNumber: newPhoneNumber,
                paymentAmount: newPaymentAmount,
                dateVisited: newDateVisited,
                userId: userId
            });
            const newCustomer = {
                id: docRef.id,
                name: newName,
                image: newImage || "https://via.placeholder.com/50",
                type: newType,
                phoneNumber: newPhoneNumber,
                paymentAmount: newPaymentAmount,
                dateVisited: newDateVisited
            };
            setCustomers([...customers, newCustomer]);
            setNewName("");
            setNewImage("");
            setNewType("Regular");
            setNewPhoneNumber("");
            setNewPaymentAmount("");
            setNewDateVisited("");
            setErrors({ name: "", phoneNumber: "", paymentAmount: "", dateVisited: "" });
        } catch (err) {
            console.error("Error adding customer: ", err);
        }
    };

    const filteredCustomers = filterDate === "All" ? customers : customers.filter(customer => customer.dateVisited === filterDate);

    const totalPaymentByPhoneNumber = filteredCustomers.reduce((acc, customer) => {
        if (!acc[customer.phoneNumber]) {
            acc[customer.phoneNumber] = 0;
        }
        acc[customer.phoneNumber] += parseFloat(customer.paymentAmount || 0);
        return acc;
    }, {});

    return (
        <div className="container">
            <h2 className="my-1">Danh sách khách hàng</h2>
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nhập tên khách hàng"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nhập số điện thoại"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                />
                {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nhập số tiền thanh toán"
                    value={newPaymentAmount}
                    onChange={(e) => setNewPaymentAmount(e.target.value)}
                />
                {errors.paymentAmount && <div className="text-danger">{errors.paymentAmount}</div>}
                <input
                    type="date"
                    className="form-control mb-2"
                    value={newDateVisited}
                    onChange={(e) => setNewDateVisited(e.target.value)}
                />
                {errors.dateVisited && <div className="text-danger">{errors.dateVisited}</div>}
                <select
                    className="form-control mb-2"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                >
                    <option value="Regular">Thường</option>
                    <option value="Loyal">Loyal</option>
                    <option value="VIP">VIP</option>
                </select>
                <button className="btn btn-primary mt-3" onClick={editCustomer ? handleSave : handleAddCustomer}>
                    {editCustomer ? "Lưu thay đổi" : "Thêm khách hàng"}
                </button>
            </div>

            <div className="mb-4">
                <label>Lọc theo ngày:</label>
                <select
                    className="form-control"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                >
                    <option value="All">Tất cả</option>
                    <option value="2024-08-01">2024-08-01</option>
                    <option value="2024-08-02">2024-08-02</option>
                </select>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Hình ảnh</th>
                        <th>Tên khách hàng</th>
                        <th>Loại khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Số tiền thanh toán</th>
                        <th>Ngày ghé thăm</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td><img src={customer.image || "https://via.placeholder.com/50"} alt="Customer" style={{ width: "50px" }} /></td>
                            <td>{customer.name}</td>
                            <td>{customer.type}</td>
                            <td>{customer.phoneNumber}</td>
                            <td>{customer.paymentAmount}</td>
                            <td>{customer.dateVisited}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => handleEdit(customer)}>Sửa</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(customer.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                <h4>Khách Hàng</h4>
                <ul>
                    {Object.entries(totalPaymentByPhoneNumber).map(([phoneNumber, total]) => (
                        <li key={phoneNumber}>Khách Hàng Có SĐT - <strong>{phoneNumber}</strong> - Đã Chi Tiêu - <strong>{total}</strong> VNĐ</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CustomerComponent;
