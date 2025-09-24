import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth'; // Import AuthContext
import toast from 'react-hot-toast';
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { Modal, Button } from 'react-bootstrap';
import UpdateChapter from './UpdateChapter';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { deleteConfirm } from '../../../../utils/deleteConfirm'; // Import deleteConfirm
import CreateLesson from './CreateLesson';
import { fetchJWT } from '../../../../utils/fetchJWT';
import { useReducer } from 'react';
import { Accordion } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";
import { apiUrl } from '../../../common/Config';

const ManageChapter = ({ course }) => {
    const { token } = useContext(AuthContext); // Get token from AuthContext
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
                return state.map((chapter) => chapter.id === action.payload.id ? { ...chapter, ...action.payload } : chapter);
            case "DELETE_CHAPTER":
                return state.filter((chapter) => chapter.id !== action.payload);
            default:
                return state;
        }
    };

    const [chapters, setChapters] = useReducer(chapterReducer, []);

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = { ...data, course_id: params.id };
        try {
            const res = await fetchJWT(`${apiUrl}/chapters`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            setLoading(false);
            if (res.ok && result.status === 200) {
                toast.success("Create chapter successfully!");
                setChapters({ type: "ADD_CHAPTER", payload: result.data });
                reset({ chapter: "" });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
            toast.error("Server connection error!");
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

    const handleDeleteLesson = async (id) => {
        const { success } = await deleteConfirm(`/lessons/${id}`);
        if (success) {
            toast.success("Delete lesson successfully!");
            setChapters({ type: "DELETE_CHAPTER", payload: id });
        }
    };

    return (
        <>
            <div className='card shadow-lg border-0 mt-3'>
                <div className='card-body p-4'>
                    <div className='d-flex justify-content-between'>
                        <h4 className='h5 mb-3'>Chapter</h4>
                        <Link onClick={() => handleShowLessonModal(chapterData)} className=''>
                            <FaPlus size={12} /> <strong>Add Lesson</strong>
                        </Link>
                    </div>
                    <form className='mb-4' onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-3'>
                            <input
                                {...register('chapter', { required: "The chapter field is required" })}
                                type="text"
                                className={`form-control ${errors.chapter ? 'is-invalid' : ''}`}
                                placeholder='Chapter'
                            />
                            {errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>}
                        </div>
                        <button className='btn btn-primary' disabled={loading}>
                            {loading ? 'Please wait...' : 'Save'}
                        </button>
                    </form>
                    <Accordion>
                        {chapters.map((chapter, index) => (
                            <Accordion.Item key={chapter.id} eventKey={index}>
                                <Accordion.Header>{chapter.title}</Accordion.Header>
                                <Accordion.Body>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="d-flex justify-content-between mb-2 mt-4">
                                                <h4 className="h5">Lessons</h4>
                                                <a className="h6" href="#"><strong>Reorder Lessons</strong></a>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            {chapter.lessons && chapter.lessons.map((lesson, index) => (
                                                <div key={index} className="d-flex mt-2 border bg-white shadow-lg rounded">
                                                    <div className="col-md-7 px-3 py-2 d-flex align-items-center">{lesson.title}</div>
                                                    <div className="col-md-5 px-3 py-2 d-flex justify-content-end align-items-center text-end">
                                                        {lesson.duration > 0 && (
                                                            <small className="fw-bold text-muted me-1 mb-0">{lesson.duration} mins</small>
                                                        )}
                                                        {lesson.is_free_preview === "yes" && (
                                                            <span className="badge bg-success">Preview</span>
                                                        )}
                                                        <Link to={`/account/courses/edit-lesson/${lesson.id}/${course.id}`} className="ms-1 text-primary">
                                                            <BsPencilSquare />
                                                        </Link>
                                                        <Link onClick={() => handleDeleteLesson(lesson.id)} className="ms-1 text-danger">
                                                            <FaTrashAlt />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="col-md-12">
                                            <div className="d-flex mt-3">
                                                <button onClick={() => handleDelete(chapter.id)} className="btn btn-danger btn-sm">Delete Chapter</button>
                                                <button onClick={() => handleShow(chapter)} className="btn btn-primary btn-sm ms-2">Update Chapter</button>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
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
            </div>
        </>
    );
};

export default ManageChapter;
