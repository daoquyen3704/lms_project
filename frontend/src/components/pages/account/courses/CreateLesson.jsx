import React, { useContext, useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../context/Auth';
import toast from 'react-hot-toast';
import { fetchJWT } from '../../../../utils/fetchJWT';
import { apiUrl } from '../../../common/Config';

const CreateLesson = ({ course, showLessonModal, handleCloseLessonModal, addLessonToChapter, currentChapter }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    // Khi modal mở, set chapter mặc định
    useEffect(() => {
        if (currentChapter) {
            setValue('chapter', currentChapter.id);
        }
    }, [currentChapter, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = {
                chapter: data.chapter,
                lesson: data.lesson,
                status: data.status,
            };

            const res = await fetchJWT(`${apiUrl}/lessons`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            setLoading(false);

            if (res.ok && result.status === 200) {
                toast.success("Lesson created successfully!");
                reset({ chapter: "", lesson: "", status: 1 });
                addLessonToChapter(result.data);
                handleCloseLessonModal();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            setLoading(false);
            toast.error("Server connection error!");
        }
    };

    return (
        <Modal size='lg' show={showLessonModal} onHide={handleCloseLessonModal}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Lesson</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        <label className='form-label'>Chapter</label>
                        <select
                            {...register('chapter', { required: "Please select a chapter" })}
                            className={`form-select ${errors.chapter ? 'is-invalid' : ''}`}
                        >
                            <option value="">Select a chapter</option>
                            {course.chapters && course.chapters.map(chapter => (
                                <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                            ))}
                        </select>
                        {errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>}
                    </div>

                    <div className='mb-3'>
                        <label className='form-label'>Lesson</label>
                        <input
                            {...register('lesson', { required: "The lesson is required" })}
                            type="text"
                            className={`form-control ${errors.lesson ? 'is-invalid' : ''}`}
                            placeholder='Lesson'
                        />
                        {errors.lesson && <p className='invalid-feedback'>{errors.lesson.message}</p>}
                    </div>

                    <div>
                        <label className='form-label'>Status</label>
                        <select
                            {...register('status', { required: "The status is required" })}
                            className='form-select'
                            defaultValue="1"
                        >
                            <option value="1">Active</option>
                            <option value="0">Block</option>
                        </select>
                        {errors.status && <p className='invalid-feedback'>{errors.status.message}</p>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-primary' disabled={loading}>
                        {!loading ? 'Save' : 'Please wait...'}
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default CreateLesson;
