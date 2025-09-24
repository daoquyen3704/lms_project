import React, { useEffect, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../context/Auth'; // Import AuthContext
import toast from 'react-hot-toast';
import { fetchJWT } from '../../../../utils/fetchJWT';

const UpdateChapter = ({ showChapter, handleClose, chapterData, setChapters }) => {
    const { token } = useContext(AuthContext); // Get token from AuthContext
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetchJWT(`${apiUrl}/chapters/${chapterData.id}`, {
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
                toast.success("Chapter updated successfully!");
                setChapters({ type: "UPDATE_CHAPTER", payload: result.data });
                handleClose();
            } else {
                toast.error(result.message || "Update failed!");
            }
        } catch (error) {
            setLoading(false);
            console.error("Update error:", error);
            toast.error("Server connection error!");
        }
    };

    useEffect(() => {
        if (chapterData) {
            reset({
                chapter: chapterData.title, // Field you store is 'title'
            });
        }
    }, [chapterData, reset, showChapter]);

    return (
        <Modal size='lg' show={showChapter} onHide={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Chapter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        <label className='form-label'>Chapter</label>
                        <input
                            {...register('chapter', { required: "The chapter is required" })}
                            type="text"
                            className={`form-control ${errors.chapter ? 'is-invalid' : ''}`}
                            placeholder='Chapter'
                        />
                        {errors.chapter && (
                            <p className='invalid-feedback'>{errors.chapter.message}</p>
                        )}
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
        </Modal>
    );
};

export default UpdateChapter;
