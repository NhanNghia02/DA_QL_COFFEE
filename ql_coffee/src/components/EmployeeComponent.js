import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

function EmployeeComponent() {
    const [user, setUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [editEmployee, setEditEmployee] = useState(null);
    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("Staff");
    const [newImage, setNewImage] = useState("");
    const [errors, setErrors] = useState({ name: "", role: "", image: "" });
    const [filterRole, setFilterRole] = useState("All");
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchEmployees(user.uid);
            } else {
                setUser(null);
                setEmployees([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchEmployees = async (userId) => {
        try {
            const q = query(collection(db, "employees"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const employeeList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEmployees(employeeList);
        } catch (err) {
            console.error("Error fetching employees: ", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "employees", id));
            setEmployees(employees.filter(employee => employee.id !== id));
        } catch (err) {
            console.error("Error deleting employee: ", err);
        }
    };

    const handleEdit = (employee) => {
        setEditEmployee(employee);
        setNewName(employee.name);
        setNewRole(employee.role);
        setNewImage(employee.image);
        setImagePreview(employee.image);
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { name: "", role: "", image: "" };

        if (!newName.trim()) {
            newErrors.name = "Name is required.";
            valid = false;
        }

        if (!newRole.trim()) {
            newErrors.role = "Role is required.";
            valid = false;
        }

        if (!newImage && !editEmployee) {
            newErrors.image = "Image is required.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            await updateDoc(doc(db, "employees", editEmployee.id), {
                name: newName,
                role: newRole,
                image: newImage
            });
            setEmployees(employees.map(employee =>
                employee.id === editEmployee.id ? { ...employee, name: newName, role: newRole, image: newImage } : employee
            ));
            setEditEmployee(null);
            setNewName("");
            setNewRole("Staff");
            setNewImage("");
            setImagePreview("");
            setErrors({ name: "", role: "", image: "" });
        } catch (err) {
            console.error("Error updating employee: ", err);
        }
    };

    const handleAddEmployee = async () => {
        if (!validateForm()) return;

        try {
            const userId = user.uid;
            const docRef = await addDoc(collection(db, "employees"), {
                name: newName,
                role: newRole,
                image: newImage || "https://via.placeholder.com/50", 
                userId: userId // Save userId to link employee with user
            });
            const newEmployee = {
                id: docRef.id,
                name: newName,
                role: newRole,
                image: newImage || "https://via.placeholder.com/50"
            };
            setEmployees([...employees, newEmployee]);
            setNewName("");
            setNewRole("Staff");
            setNewImage("");
            setImagePreview("");
            setErrors({ name: "", role: "", image: "" });
        } catch (err) {
            console.error("Error adding employee: ", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredEmployees = filterRole === "All" ? employees : employees.filter(employee => employee.role === filterRole);

    return (
        <div className="container">
            <h2 className="my-4">Danh Sách Nhân Viên</h2>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter employee name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
                <select
                    className="form-control mb-2"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                >
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                </select>
                {errors.role && <div className="text-danger">{errors.role}</div>}
                <input
                    type="file"
                    className="form-control-file mb-2"
                    onChange={handleImageChange}
                />
                {imagePreview && <img src={imagePreview} alt="Preview" className="img-thumbnail mb-2" style={{ width: 100, height: 100 }} />}
                {errors.image && <div className="text-danger">{errors.image}</div>}
                <button className="btn btn-primary" onClick={editEmployee ? handleSave : handleAddEmployee}>
                    {editEmployee ? "Save Changes" : "Add Employee"}
                </button>
            </div>

            <div className="mb-4">
                <label>Filter by role:</label>
                <select
                    className="form-control"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                </select>
            </div>

            <ul className="list-group">
                {filteredEmployees.map((employee) => (
                    <li key={employee.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <img src={employee.image} alt={employee.name} className="img-thumbnail mr-3" style={{ width: 50, height: 50 }} />
                            {editEmployee && editEmployee.id === employee.id ? (
                                <>
                                    <input
                                        type="text"
                                        className="form-control mr-2"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                    {errors.name && <div className="text-danger">{errors.name}</div>}
                                    <select
                                        className="form-control mr-2"
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Staff">Staff</option>
                                    </select>
                                    {errors.role && <div className="text-danger">{errors.role}</div>}
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        onChange={handleImageChange}
                                    />
                                    {errors.image && <div className="text-danger">{errors.image}</div>}
                                </>
                            ) : (
                                <>
                                    <div>
                                        <div>{employee.name}</div>
                                        <div className="text-muted">{employee.role}</div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div>
                            {editEmployee && editEmployee.id === employee.id ? (
                                <button className="btn btn-success btn-sm mr-2" onClick={handleSave}>Save</button>
                            ) : (
                                <button className="btn btn-primary btn-sm mr-2" onClick={() => handleEdit(employee)}>Edit</button>
                            )}
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(employee.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EmployeeComponent;
