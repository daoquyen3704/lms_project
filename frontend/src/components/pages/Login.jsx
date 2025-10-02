import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../common/Layout';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiUrl } from '../common/Config';
import { AuthContext } from '../context/Auth';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { handleSubmit, register, formState: { errors, isSubmitting }, setError } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${apiUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok && result.status === 200) {
                // Lưu token và user thông tin vào localStorage
                const userInfo = {
                    name: result.user.name,
                    id: result.user.id,
                    token: result.access_token,
                };
                localStorage.setItem("accessToken", result.access_token);
                localStorage.setItem("refreshToken", result.refresh_token); // Lưu refresh token
                localStorage.setItem("userInfoLms", JSON.stringify(userInfo));

                // Cập nhật vào AuthContext
                login(userInfo, result.access_token);

                // Redirect đến Dashboard
                navigate('/account/dashboard');
            } else {
                toast.error(result.message || "Login failed!");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Lỗi kết nối server!");
        }
    };

    return (
        <Layout>
            <div className='container py-5 mt-5'>
                <div className='d-flex align-items-center justify-content-center'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='card border-0 shadow login'>
                            <div className='card-body p-4'>
                                <h3 className='border-bottom pb-3 mb-3'>Login</h3>
                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="email">Email</label>
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

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="password">Password</label>
                                    <input
                                        {...register("password", { required: "Password is required" })}
                                        type="password"
                                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                        placeholder="Password"
                                    />
                                    {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}
                                </div>

                                <div className='d-flex justify-content-between align-items-center'>
                                    <button className='btn btn-primary' disabled={isSubmitting}>Login</button>
                                    <Link to={`/account/register`} className='text-secondary'>Register Here</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
