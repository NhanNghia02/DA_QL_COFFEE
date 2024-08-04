import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginComponent() {
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
        } else if (!email.includes("@")) {
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
            if (error.code === 'auth/user-not-found') {
                setErrors({ general: "Tài khoản không tồn tại" });
            } else if (error.code === 'auth/wrong-password') {
                setErrors({ general: "Mật khẩu không đúng" });
            } else {
                setErrors({ general: "Đăng nhập không thành công" });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="login-container">
                <h2 className="text-center">Đăng Nhập</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            placeholder="Nhập địa chỉ email"
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
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={handleChange}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    {errors.general && <div className="invalid-feedback">{errors.general}</div>}
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "Đang đăng nhập..." : "Đăng Nhập"}
                    </button>
                    <div className="d-flex justify-content-between mt-3">
                        <a href="/admin/reset" className="text-primary">Quên mật khẩu?</a>
                        <a href="/admin/registers" className="text-primary">Đăng Ký</a>
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

export default LoginComponent;
