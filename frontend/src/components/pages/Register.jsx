import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../common/Layout'
import { useForm } from 'react-hook-form'
import { apiUrl } from '../common/Config'
import toast from 'react-hot-toast'

const Register = () => {
    const navigate = useNavigate();
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        setError
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${apiUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            console.log(result);

            if (res.ok && result.status === 200) {
                toast.success(result.message);
                navigate('/account/login');
            } else {
                // Lấy lỗi validate từ API (Laravel trả về trong "message")
                const apiErrors = result.message;
                if (apiErrors) {
                    Object.keys(apiErrors).forEach((field) => {
                        setError(field, { type: "server", message: apiErrors[field][0] });
                    });
                } else {
                    toast.error("Đăng ký thất bại, vui lòng thử lại!");
                }
            }
        } catch (error) {
            console.error("Register error:", error);
            toast.error("Lỗi kết nối server!");
        }
    };

    return (
        <Layout>
            <div className="container py-5 mt-5">
                <div className="d-flex align-items-center justify-content-center">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="card border-0 shadow register">
                            <div className="card-body p-4">
                                <h3 className="border-bottom pb-3 mb-3">Register</h3>

                                {/* Name */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="name">Name</label>
                                    <input
                                        {...register("name", { required: "Name is required" })}
                                        type="text"
                                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                        placeholder="Name"
                                    />
                                    {errors.name && <p className="invalid-feedback">{errors.name.message}</p>}
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address",
                                            },
                                        })}
                                        type="text"
                                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                        placeholder="Email"
                                    />
                                    {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <input
                                        {...register("password", { required: "Password is required" })}
                                        type="password"
                                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                        placeholder="Password"
                                    />
                                    {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}
                                </div>

                                {/* Button */}
                                <div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Registering..." : "Register"}
                                    </button>
                                </div>

                                <div className="d-flex justify-content-center py-3">
                                    Already have account? &nbsp;
                                    <Link className="text-secondary" to={`/account/login`}>
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
