import React, { useEffect } from 'react'
import Layout from '../../../common/Layout'
import { Link } from 'react-router-dom'
import UserSidebar from '../../../common/UserSidebar'
import { set, useForm } from 'react-hook-form'
import { apiUrl, token } from '../../../common/Config'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthContext } from '../../../context/Auth'
import { useContext, useState } from 'react'
const EditCourse = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [levels, setLevels] = useState([]);
    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${apiUrl}/courses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            // console.log(result);

            if (res.ok && result.status === 200) {
                toast.success("Create course successfully!");
                navigate('/account/courses/edit/' + result.data.id);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Register error:", error);
            toast.error("Lỗi kết nối server!");
        }
    }

    const courseMetaData = async () => {
        const res = await fetch(`${apiUrl}/courses/meta-data`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await res.json();
        if (res.ok && result.status === 200) {
            setCategories(result.categories);
            setLanguages(result.languages);
            setLevels(result.levels);
        }
        else {
            toast.error(result.message);
        }
    }
    useEffect(() => {
        courseMetaData();
    }, []);
    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Edit Course</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>Edit Course</h2>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>

                        <div className='col-lg-9'>
                            <div className='row'>
                                <div className='col-md-7'>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='card border-0 shadow-lg'>
                                            <div className='card-body p-4'>
                                                <h4 className='h5 border-bottom pb-3 mb-3'>Course Detail</h4>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="title">Title</label>
                                                    <input type="text"
                                                        {
                                                        ...register("title", { required: "The title field is required" })
                                                        }
                                                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                                        id='title' placeholder='Enter course title'
                                                    />
                                                    {
                                                        errors.title && <p className='invalid-feedback'>{errors.title.message}</p>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="category">Category</label>
                                                    <select className='form-select' name="category" id="category">
                                                        <option value="">Select a Category</option>
                                                        {
                                                            categories && categories.map((category) => (
                                                                <option key={category.id} value={category.id}>{category.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="level">Level</label>
                                                    <select className='form-select' name="level" id="level">
                                                        <option value="">Select a Level</option>
                                                        {
                                                            levels && levels.map((level) => (
                                                                <option key={level.id} value={level.id}>{level.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="language">Language</label>
                                                    <select className='form-select' name="language" id="language">
                                                        <option value="">Select a Language</option>
                                                        {
                                                            languages && languages.map((language) => (
                                                                <option key={language.id} value={language.id}>{language.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="description">Description</label>
                                                    <textarea className='form-control' rows={5} name="description" id="description" placeholder='Enter course description'></textarea>
                                                </div>

                                                <h4 className='h5 border-bottom pb-3 mb-3'>Pricing</h4>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="sell-price">Sell Price</label>
                                                    <input type="text"
                                                        {
                                                        ...register("title", { required: "The title field is required" })
                                                        }
                                                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                                        id='sell-price' placeholder='Sell Price'
                                                    />
                                                    {
                                                        errors.title && <p className='invalid-feedback'>{errors.title.message}</p>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="cross-price">Cross Price</label>
                                                    <input type="text"
                                                        {
                                                        ...register("title", { required: "The title field is required" })
                                                        }
                                                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                                        id='cross-price' placeholder='Cross Price'
                                                    />
                                                    {
                                                        errors.title && <p className='invalid-feedback'>{errors.title.message}</p>
                                                    }
                                                </div>

                                                <button className='btn btn-primary'>Update</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className='col-md-5'>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default EditCourse
