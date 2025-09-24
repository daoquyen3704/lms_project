import React, { useEffect, useState, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth'; // Import AuthContext
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';
import LessonVideo from './LessonVideo';
import { fetchJWT } from '../../../../utils/fetchJWT'; // Import fetchJWT
import { apiUrl } from '../../../common/Config';
import UserSidebar from '../../../common/UserSidebar';
import Layout from '../../../common/Layout';
const EditLesson = () => {
    const { token } = useContext(AuthContext); // Get token from AuthContext
    const { register, handleSubmit, formState: { errors }, reset } = useForm({});
    const params = useParams();
    const [chapters, setChapters] = useState([]);
    const [lesson, setLesson] = useState({});
    const [loading, setLoading] = useState(false);
    const editor = useRef(null);
    const [content, setContent] = useState('');

    // Handle form submission
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetchJWT(`${apiUrl}/lessons/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    lesson: data.lesson,
                    chapter_id: data.chapter,
                    duration: data.duration,
                    description: content, // nội dung từ JoditEditor
                    status: data.status,
                    free_preview: data.free_preview,
                }),
            });

            const result = await res.json();
            setLoading(false);

            if (res.ok && result.status === 200) {
                toast.success("Lesson updated successfully!");
            } else {
                console.log('Something went wrong:', result.message);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            toast.error("Server connection error!");
        }
    };

    useEffect(() => {
        fetchJWT(`${apiUrl}/chapters?course_id=${params.courseId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
            .then(res => res.json())
            .then(result => {
                if (result.status === 200) {
                    setChapters(result.data);
                } else {
                    console.log('Error fetching chapters');
                }
            });

        fetchJWT(`${apiUrl}/lessons/${params.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
            .then(res => res.json())
            .then(result => {
                if (result.status === 200) {
                    setLesson(result.data);
                    reset({
                        lesson: result.data.title,
                        chapter: result.data.chapter_id,
                        duration: result.data.duration,
                        status: result.data.status,
                        free_preview: result.data.is_free_preview === 'yes',
                    });
                    setContent(result.data.description || ''); // Update content for JoditEditor
                } else {
                    console.log('Error fetching lesson');
                }
            });
    }, [params.id, params.courseId]);

    const config = {
        readonly: false,
        uploader: {
            url: 'https://xdsoft.net/jodit/finder/?action=fileUpload'
        },
        filebrowser: {
            ajax: {
                url: 'https://xdsoft.net/jodit/finder/'
            },
            height: 580,
        }
    };

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>Edit Lesson</h2>
                                <Link className='btn btn-primary' to={`/account/courses/edit/${params.courseId}`}>Back</Link>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>

                        <div className='col-lg-9'>
                            <div className='row'>
                                <div className='col-md-8'>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='card border-0 shadow-lg'>
                                            <div className='card-body p-4'>
                                                <h4 className='h5 border-bottom pb-3 mb-3'>Basic Information</h4>

                                                {/* Title */}
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="lesson">Title</label>
                                                    <input
                                                        type="text"
                                                        {...register("lesson", { required: "The title field is required" })}
                                                        className={`form-control ${errors.lesson ? "is-invalid" : ""}`}
                                                        id='lesson'
                                                    />
                                                    {errors.lesson && <p className='invalid-feedback'>{errors.lesson.message}</p>}
                                                </div>

                                                {/* Chapter */}
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="chapter">Chapter</label>
                                                    <select
                                                        id='chapter'
                                                        className={`form-select ${errors.chapter ? "is-invalid" : ""}`}
                                                        {...register("chapter", { required: "Please select a chapter" })}
                                                    >
                                                        <option value="">Select a Chapter</option>
                                                        {chapters.map((chapter) => (
                                                            <option key={chapter.id} value={chapter.id}>
                                                                {chapter.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>}
                                                </div>

                                                {/* Duration */}
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="duration">Duration (in minutes)</label>
                                                    <input
                                                        type="number"
                                                        {...register("duration", { required: "The duration field is required" })}
                                                        className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                                                        id='duration'
                                                    />
                                                    {errors.duration && <p className='invalid-feedback'>{errors.duration.message}</p>}
                                                </div>

                                                {/* Description */}
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="description">Description</label>
                                                    <JoditEditor
                                                        ref={editor}
                                                        value={content}
                                                        config={config}
                                                        tabIndex={1}
                                                        onBlur={newContent => setContent(newContent)}
                                                    />
                                                </div>

                                                {/* Status */}
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="status">Status</label>
                                                    <select
                                                        id='status'
                                                        className={`form-select ${errors.status ? "is-invalid" : ""}`}
                                                        {...register("status", { required: "Please select a status" })}
                                                    >
                                                        <option value="1">Active</option>
                                                        <option value="0">Blocked</option>
                                                    </select>
                                                    {errors.status && <p className='invalid-feedback'>{errors.status.message}</p>}
                                                </div>

                                                {/* Free Preview */}
                                                <div className='d-flex'>
                                                    <input
                                                        {...register("free_preview")}
                                                        className='form-check-input'
                                                        type="checkbox"
                                                        id='freeLesson'
                                                    />
                                                    <label className='form-check-label ms-2' htmlFor="freeLesson"> Free Lesson</label>
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    disabled={loading}
                                                    className='btn btn-primary mt-4'>
                                                    {loading ? 'Please wait...' : 'Update'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className='col-md-4'>
                                    <LessonVideo lesson={lesson} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default EditLesson;
