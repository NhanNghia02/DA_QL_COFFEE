import React, { useState } from "react";
import '../layouts/css/LoginAdmin.css';
import { useNavigate } from "react-router-dom";
import { auth } from "../model/Firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginAdminComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "email") {
            setEmail(value);
            setErrors(prevErrors => ({ ...prevErrors, email: "" }));
        } else if (id === "password") {
            setPassword(value);
            setErrors(prevErrors => ({ ...prevErrors, password: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};

        if (!email) {
            formErrors.email = "Email không được để trống";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formErrors.email = "Email không hợp lệ";
        }
        if (!password) {
            formErrors.password = "Mật khẩu không được để trống";
        }
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin/dashboard");
        } catch (error) {
            let errorMessage = "Lỗi. Vui lòng thử lại sau !!!";

            if (error.code === 'auth/invalid-credential') {
                errorMessage = "Sai email hoặc mật khẩu. Vui lòng kiểm tra lại !!!";
            }

            setErrors(prevErrors => ({ ...prevErrors, general: errorMessage }));

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="login-container">
                <h2 className="text-center mb-4">Đăng Nhập Admin</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
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

                    <div className="form-group mb-3">
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

                    {errors.general && <div className="invalid-feedback general-error mb-3 mt-2">{errors.general}</div>}

                    <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isSubmitting}>
                        {isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginAdminComponent;
