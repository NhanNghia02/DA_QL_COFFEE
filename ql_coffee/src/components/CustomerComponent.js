import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomerComponent() {
    const [customers, setCustomers] = useState([
        { id: 1, name: "John Doe", image: "https://via.placeholder.com/50" },
        { id: 2, name: "Jane Smith", image: "https://via.placeholder.com/50" },
        { id: 3, name: "Alice Johnson", image: "https://via.placeholder.com/50" },
    ]);

    const [editCustomer, setEditCustomer] = useState(null);
    const [newName, setNewName] = useState("");
    const [newImage, setNewImage] = useState("");
    const [errors, setErrors] = useState({ name: "", image: "" });

    const handleDelete = (id) => {
        setCustomers(customers.filter(customer => customer.id !== id));
    };

    const handleEdit = (customer) => {
        setEditCustomer(customer);
        setNewName(customer.name);
        setNewImage(customer.image);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { name: "", image: "" };

        if (!newName.trim()) {
            newErrors.name = "Name is required.";
            valid = false;
        }

        if (!newImage && !editCustomer) {
            newErrors.image = "Image is required.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        setCustomers(customers.map(customer =>
            customer.id === editCustomer.id ? { ...customer, name: newName, image: newImage } : customer
        ));
        setEditCustomer(null);
        setNewName("");
        setNewImage("");
        setErrors({ name: "", image: "" });
    };

    const handleAddCustomer = () => {
        if (!validateForm()) return;

        const newCustomer = {
            id: customers.length + 1,
            name: newName,
            image: newImage || "https://via.placeholder.com/50" // Use placeholder if no image provided
        };
        setCustomers([...customers, newCustomer]);
        setNewName("");
        setNewImage("");
        setErrors({ name: "", image: "" });
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
                    type="file"
                    className="form-control-file mb-2"
                    onChange={handleImageChange}
                />
                {errors.image && <div className="text-danger">{errors.image}</div>}
                <button className="btn btn-primary" onClick={handleAddCustomer}>Add Customer</button>
            </div>

            <ul className="list-group">
                {customers.map((customer) => (
                    <li key={customer.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <img src={customer.image} alt={customer.name} className="img-thumbnail mr-3" style={{ width: 50, height: 50 }} />
                            {editCustomer && editCustomer.id === customer.id ? (
                                <>
                                    <input
                                        type="text"
                                        className="form-control mr-2"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                    {errors.name && <div className="text-danger">{errors.name}</div>}
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        onChange={handleImageChange}
                                    />
                                    {errors.image && <div className="text-danger">{errors.image}</div>}
                                </>
                            ) : (
                                customer.name
                            )}
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
