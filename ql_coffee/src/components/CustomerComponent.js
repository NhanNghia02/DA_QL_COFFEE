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
    }, []);

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
        let valid = true;
        const newErrors = { name: "", phoneNumber: "", paymentAmount: "", dateVisited: "" };

        if (!newName.trim()) {
            newErrors.name = "Name is required.";
            valid = false;
        }

        if (!newPhoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required.";
            valid = false;
        }

        if (!newPaymentAmount.trim() || isNaN(newPaymentAmount)) {
            newErrors.paymentAmount = "Valid payment amount is required.";
            valid = false;
        }

        if (!newDateVisited.trim()) {
            newErrors.dateVisited = "Date visited is required.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
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
                image: newImage || "https://via.placeholder.com/50", // Use placeholder if no image provided
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result);
            };
            reader.readAsDataURL(file);
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
            <h2 className="my-4">Customer List</h2>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter customer name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter phone number"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                />
                {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter payment amount"
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
                    <option value="Regular">Regular</option>
                    <option value="Loyal">Loyal</option>
                    <option value="VIP">VIP</option>
                </select>
                <button className="btn btn-primary" onClick={editCustomer ? handleSave : handleAddCustomer}>
                    {editCustomer ? "Save Changes" : "Add Customer"}
                </button>
            </div>

            <div className="mb-4">
                <label>Filter by date:</label>
                <select
                    className="form-control"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="2024-08-01">2024-08-01</option>
                    <option value="2024-08-02">2024-08-02</option>
                    {/* Add more options as needed */}
                </select>
            </div>

            <h4>Total Payment by Phone Number:</h4>
            <ul className="list-group mb-4">
                {Object.entries(totalPaymentByPhoneNumber).map(([phoneNumber, totalPayment]) => (
                    <li key={phoneNumber} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            Phone: {phoneNumber}
                        </div>
                        <div>
                            Total Payment: ${totalPayment.toFixed(2)}
                        </div>
                    </li>
                ))}
            </ul>

            <ul className="list-group">
                {filteredCustomers.map((customer) => (
                    <li key={customer.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <div>Name: {customer.name}</div>
                            <div>Phone: {customer.phoneNumber}</div>
                            <div>Payment: ${customer.paymentAmount}</div>
                            <div>Date Visited: {customer.dateVisited}</div>
                        </div>
                        <div>
                            {editCustomer && editCustomer.id === customer.id ? (
                                <button className="btn btn-success btn-sm mr-2" onClick={handleSave}>Save</button>
                            ) : (
                                <button className="btn btn-primary btn-sm mr-2" onClick={() => handleEdit(customer)}>Edit</button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(customer.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CustomerComponent;
