import React, { useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

const CreateLesson = ({ course, showLessonModal, handleCloseLessonModal }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/lessons`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            setLoading(false);

            if (res.ok && result.status === 200) {
                toast.success("Lesson updated successfully!");
                reset({
                    chapter: "", lesson: "", status: 1
                });
                handleCloseLessonModal();
            } else {
                toast.error(result.message);
            }
        }
        catch (error) {
            console.error("Update error:", error);
            toast.error("Lỗi kết nối server!");
        }
    };


    return (
        <>
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
                                {
                                    course.chapters && course.chapters.map((chapter) => (
                                        <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                                    ))
                                }
                            </select>
                            {errors.chapter && (
                                <p className='invalid-feedback'>{errors.chapter.message}</p>
                            )}

                            <div className='mb-3'>
                                <label className='form-label'>Lesson</label>
                                <input
                                    {...register('lesson', { required: "The lesson is required" })}
                                    type="text"
                                    className={`form-control ${errors.lesson ? 'is-invalid' : ''}`}
                                    placeholder='Lesson'
                                />
                                {errors.lesson && (
                                    <p className='invalid-feedback'>{errors.lesson.message}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className='form-label'>Status</label>
                            <select
                                {...register('status', { required: "The status is required" })} className='form-select'>
                                <option value="1" selected>Active</option>
                                <option value="0">Block</option>
                            </select>
                            {
                                errors.status && (
                                    <p className='invalid-feedback'>{errors.status.message}</p>
                                )
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className='btn btn-primary'
                            disabled={loading}
                        >
                            {!loading ? 'Save' : 'Please wait...'}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal >
        </>
    )
}

export default CreateLesson
