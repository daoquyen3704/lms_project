import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth'; // Import AuthContext
import { apiUrl } from '../../../common/Config';
import toast from 'react-hot-toast';
import UserSidebar from '../../../common/UserSidebar';
import ManageOutcome from './ManageOutcome';
import ManageRequirement from './ManageRequirement';
import EditCover from './EditCover';
import ManageChapter from './ManageChapter';
import { fetchJWT } from '../../../../utils/fetchJWT';
import Layout from '../../../common/Layout';

const EditCourse = () => {
    const { token } = useContext(AuthContext); // Get token from AuthContext
    const params = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState({});
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [levels, setLevels] = useState([]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: async () => {
            const res = await fetchJWT(`${apiUrl}/courses/${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            const result = await res.json();
            if (res.ok && result.status === 200) {
                reset({
                    title: result.data.title,
                    description: result.data.description,
                    category: result.data.category_id,
                    language: result.data.language_id,
                    level: result.data.level_id,
                    sell_price: result.data.price,
                    cross_price: result.data.cross_price
                });
                setCourse(result.data);
            } else {
                toast.error(result.message);
            }
        }
    });

    useEffect(() => {
        const courseMetaData = async () => {
            const res = await fetchJWT(`${apiUrl}/courses/meta-data`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            const result = await res.json();
            if (res.ok && result.status === 200) {
                setCategories(result.categories);
                setLanguages(result.languages);
                setLevels(result.levels);
            } else {
                toast.error(result.message);
            }
        };

        courseMetaData();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetchJWT(`${apiUrl}/courses/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            setLoading(false);

            if (res.ok && result.status === 200) {
                toast.success("Course updated successfully!");
                navigate(`/account/courses/edit/${params.id}`);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            setLoading(false);
            toast.error("Lỗi kết nối server!");
        }
    };

    const changeStatus = async (course) => {
        const status = (course.status === 1) ? 0 : 1;
        const res = await fetchJWT(`${apiUrl}/change-course-status/${params.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ status: status }),
        });
        const result = await res.json();
        if (res.ok && result.status === 200) {
            toast.success(result.message);
            setCourse({ ...course, status: result.data.status });
        } else {
            toast.error(result.message);
        }
    }
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
                                <div>
                                    {
                                        (course.status === 1) ?
                                            <Link onClick={() => changeStatus(course)} className='btn btn-warning me-2'>Unpublish</Link>
                                            :
                                            <Link onClick={() => changeStatus(course)} className='btn btn-primary me-2'>Publish</Link>
                                    }
                                    <Link to="/account/my-courses" className='btn btn-secondary'>Back</Link>
                                </div>
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
                                                    <input
                                                        type="text"
                                                        {...register("title", { required: "The title field is required" })}
                                                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                                        id='title'
                                                    />
                                                    {errors.title && <p className='invalid-feedback'>{errors.title.message}</p>}
                                                </div>

                                                {/* Category */}
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="category">Category</label>
                                                    <select
                                                        id='category'
                                                        className={`form-select ${errors.category ? "is-invalid" : ""}`}
                                                        {...register("category", { required: "The category field is required" })}
                                                        name="category"
                                                    >
                                                        <option value="">Select a Category</option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>{category.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.category && <p className="invalid-feedback">{errors.category.message}</p>}
                                                </div>

                                                {/* Level */}
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="level">Level</label>
                                                    <select
                                                        id="level"
                                                        name="level"
                                                        className={`form-select ${errors.level ? "is-invalid" : ""}`}
                                                        {...register("level", { required: "The level field is required" })}
                                                    >
                                                        <option value="">Select a Level</option>
                                                        {levels.map((level) => (
                                                            <option key={level.id} value={level.id}>{level.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.level && <p className="invalid-feedback">{errors.level.message}</p>}
                                                </div>

                                                {/* Language */}
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="language">Language</label>
                                                    <select
                                                        id="language"
                                                        name="language"
                                                        className={`form-select ${errors.language ? "is-invalid" : ""}`}
                                                        {...register("language", { required: "The language field is required" })}
                                                    >
                                                        <option value="">Select a Language</option>
                                                        {languages.map((language) => (
                                                            <option key={language.id} value={language.id}>{language.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.language && <p className="invalid-feedback">{errors.language.message}</p>}
                                                </div>

                                                {/* Description */}
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="description">Description</label>
                                                    <textarea
                                                        {...register("description")}
                                                        className='form-control'
                                                        rows={5}
                                                        name="description"
                                                        id="description"
                                                        placeholder='Enter course description'
                                                    ></textarea>
                                                </div>

                                                <h4 className='h5 border-bottom pb-3 mb-3'>Pricing</h4>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="sell-price">Sell Price</label>
                                                    <input
                                                        type="text"
                                                        id="sell-price"
                                                        placeholder="Sell Price"
                                                        {...register("sell_price", { required: "The sell price field is required" })}
                                                        className={`form-control ${errors.sell_price ? "is-invalid" : ""}`}
                                                    />
                                                    {errors.sell_price && <p className="invalid-feedback">{errors.sell_price.message}</p>}
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="cross-price">Cross Price</label>
                                                    <input
                                                        type="text"
                                                        id="cross-price"
                                                        placeholder="Cross Price"
                                                        {...register("cross_price")}
                                                        className={`form-control ${errors.cross_price ? "is-invalid" : ""}`}
                                                    />
                                                    {errors.cross_price && <p className="invalid-feedback">{errors.cross_price.message}</p>}
                                                </div>

                                                <button
                                                    disabled={loading}
                                                    className='btn btn-primary'>
                                                    {loading ? 'Please wait...' : 'Update'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    <ManageChapter course={course} params={params} />
                                </div>

                                <div className='col-md-5'>
                                    <ManageOutcome />
                                    <ManageRequirement />
                                    <EditCover course={course} setCourse={setCourse} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default EditCourse;
