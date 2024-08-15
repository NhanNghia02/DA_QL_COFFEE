import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../model/Firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

function RegisterComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        switch (id) {
            case "name":
                setName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};

        if (!name) {
            formErrors.name = "Tên không được để trống";
        }
        if (!email) {
            formErrors.email = "Email không được để trống";
        } else if (!email.includes("@")) {
            formErrors.email = "Email không hợp lệ";
        }
        else if (password.length < 8) {
            formErrors.password = "Mật khẩu phải lớn hơn bằng 8 kí tự";
        }
        if (!password) {
            formErrors.password = "Mật khẩu không được để trống";
        }
        if (!confirmPassword) {
            formErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
        }
        if (password !== confirmPassword) {
            formErrors.confirmPassword = "Mật khẩu không khớp";
        }
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setIsSubmitting(true);
        setSuccessMessage("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });

            setSuccessMessage("Đăng ký thành công!!!");
            setTimeout(() => {
                navigate("/client/login");
            }, 2000);
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setErrors({ ...errors, general: "Email đã được sử dụng" });
            } else {
                setErrors({ ...errors, general: error.message });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="login-container">
                <h2 className="text-center">Đăng Kí</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            placeholder="Nhập họ tên..."
                            value={name}
                            onChange={handleChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            placeholder="Nhập địa chỉ email..."
                            value={email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            id="password"
                            placeholder="Nhập mật khẩu..."
                            value={password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirmPassword"
                            placeholder="Nhập lại mật khẩu..."
                            value={confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                    {errors.general && <div className="invalid-feedback">{errors.general}</div>}
                    {successMessage && <div className="valid-feedback">{successMessage}</div>}
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "Đang đăng ký..." : "Đăng Kí"}
                    </button>
                    <div className="d-flex justify-content-between mt-3">
                        <a href="/admin/reset" className="text-primary">Quên mật khẩu?</a>
                        <a href="/admin/logins" className="text-primary">Đăng Nhập</a>
                    </div>
                </form>
                <p className="text-center mt-4">Hoặc tiếp tục với</p>
                <div className="social-buttons">
                    <a href="/" className="btn btn-google btn-danger mx-2">
                        <i className="fab fa-google"></i>
                        <span className="ml-2">Đăng Nhập Với Google</span>
                    </a>
                    <a href="/" className="btn btn-facebook btn-primary">
                        <i className="fab fa-facebook-f"></i>
                        <span className="ml-2">Đăng Nhập Với Facebook</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RegisterComponent;
