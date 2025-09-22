import React, { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../../common/Config';
import toast from "react-hot-toast";
import Accordion from 'react-bootstrap/Accordion';
import UpdateChapter from './UpdateChapter';
import { Link, useParams } from 'react-router-dom';
import { deleteConfirm } from '../../../../utils/deleteConfirm';
import CreateLesson from './CreateLesson';
import { FaPlus } from "react-icons/fa6";

const ManageChapter = ({ course }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [chapterData, setChapterData] = useState({});
    const [loading, setLoading] = useState(false);
    const params = useParams();

    // Update chapter modal
    const [showChapter, setShowChapter] = useState(false);
    const handleClose = () => setShowChapter(false);
    const handleShow = (chapter) => {
        setChapterData(chapter);
        setShowChapter(true);
    };

    // Create lesson modal
    const [showLessonModal, setShowLessonModal] = useState(false);
    const handleCloseLessonModal = () => setShowLessonModal(false);
    const handleShowLessonModal = (chapter) => {
        setShowLessonModal(true);
    };
    const chapterReducer = (state, action) => {
        switch (action.type) {
            case "SET_CHAPTERS":
                return action.payload;
            case "ADD_CHAPTER":
                return [...state, action.payload];

            case "UPDATE_CHAPTER":
                const updatedChapters = state.map((chapter) => {
                    if (chapter.id === action.payload.id) {
                        return action.payload;
                    }
                    return chapter;
                });
                return updatedChapters;
            case "DELETE_CHAPTER":
                return state.filter((chapter) => chapter.id !== action.payload);
            default:
                return state;
        }
    }
    const [chapters, setChapters] = useReducer(chapterReducer, []);
    const onSubmit = async (data) => {
        setLoading(true);
        const formData = { ...data, course_id: params.id };
        try {
            const res = await fetch(`${apiUrl}/chapters`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),

            });
            const result = await res.json();
            // console.log(result);
            setLoading(false);
            if (res.ok && result.status === 200) {
                toast.success("Create chapter successfully!");
                setChapters({ type: "ADD_CHAPTER", payload: result.data });
                reset({ chapter: "" });
            } else {
                toast.error(result.message);
            }
        }
        catch (error) {
            console.error("Register error:", error);
            toast.error("Lỗi kết nối server!");
        }

    };

    const handleDelete = async (id) => {
        const { success } = await deleteConfirm(`/chapters/${id}`);
        if (success) {
            toast.success("Delete chapter successfully!");
            setChapters({ type: "DELETE_CHAPTER", payload: id });
        }
    };
    useEffect(() => {
        if (course.chapters) {
            setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
        }
    }, [course]);
    return (
        <>
            <div className='card shadow-lg border-0 mt-3'>
                <div className='card-body p-4'>
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex justify-content-between w-100'>
                            <h4 className='h5 mb-3'>Chapter</h4>
                            <Link onClick={() => handleShowLessonModal(chapterData)} className=''><FaPlus size={12} /> <strong>Add Lesson</strong></Link>
                        </div>
                    </div>
                    <form className='mb-4' onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-3'>
                            <input
                                {
                                ...register('chapter', { required: "The chapter field is required" })
                                }
                                type="text"
                                className={`form-control ${errors.chapter ? 'is-invalid' : ''}`}
                                placeholder='Chapter' />
                            {
                                errors.chapter &&
                                <p className='invalid-feedback'>{errors.chapter.message}</p>
                            }
                        </div>
                        <button
                            type='submit'
                            className='btn btn-primary'
                            disabled={loading}
                        >
                            {loading == false ? 'Save' : 'Please wait...'}
                        </button>
                    </form>
                    <Accordion>
                        {
                            chapters.map((chapter, index) => {
                                return (
                                    <Accordion.Item key={chapter.id} eventKey={index}>
                                        <Accordion.Header>{chapter.title}</Accordion.Header>
                                        <Accordion.Body>
                                            <div className='d-flex'>
                                                <button
                                                    onClick={() => handleDelete(chapter.id)}
                                                    className='btn btn-danger btn-sm'>
                                                    Delete Chapter
                                                </button>
                                                <button
                                                    onClick={() => handleShow(chapter)}
                                                    className='btn btn-primary btn-sm ms-2'>
                                                    Update Chapter
                                                </button>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })
                        }
                    </Accordion>

                    <UpdateChapter
                        chapterData={chapterData}
                        showChapter={showChapter}
                        handleClose={handleClose}
                        setChapters={setChapters}
                    />

                    <CreateLesson
                        showLessonModal={showLessonModal}
                        handleCloseLessonModal={handleCloseLessonModal}
                        course={course}
                    />
                </div>

            </div >
        </>
    )
}

export default ManageChapter
