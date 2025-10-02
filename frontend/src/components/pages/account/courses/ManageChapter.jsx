import React, { useState, useContext, useReducer, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth';
import toast from 'react-hot-toast';
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { Accordion } from 'react-bootstrap';
import { deleteConfirm } from '../../../../utils/deleteConfirm';
import UpdateChapter from './UpdateChapter';
import CreateLesson from './CreateLesson';
import { fetchJWT } from '../../../../utils/fetchJWT';
import { apiUrl } from '../../../common/Config';
import LessonSort from './LessonSort';
import SortChapter from './SortChapter';

const ManageChapter = ({ course }) => {
    const { token } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const params = useParams();

    // Modal update chapter
    const [chapterData, setChapterData] = useState({});
    const [showChapter, setShowChapter] = useState(false);
    const handleClose = () => setShowChapter(false);
    const handleShow = (chapter) => {
        setChapterData(chapter);
        setShowChapter(true);
    };

    // Modal create lesson
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [currentChapter, setCurrentChapter] = useState(null);
    const handleCloseLessonModal = () => setShowLessonModal(false);
    const handleShowLessonModal = (chapter) => {
        setCurrentChapter(chapter); // Set chapter hiện tại
        setShowLessonModal(true);
    };

    // Reducer quản lý chapters
    const chapterReducer = (state, action) => {
        switch (action.type) {
            case "SET_CHAPTERS":
                return action.payload;
            case "ADD_CHAPTER":
                return [...state, action.payload];
            case "UPDATE_CHAPTER":
                return state.map(chapter => chapter.id === action.payload.id ? { ...chapter, ...action.payload } : chapter);
            case "DELETE_CHAPTER":
                return state.filter(chapter => chapter.id !== action.payload);
            case "ADD_LESSON":
                return state.map(chapter =>
                    chapter.id === action.payload.chapter_id
                        ? { ...chapter, lessons: [...(chapter.lessons || []), action.payload] }
                        : chapter
                );
            default:
                return state;
        }
    };

    const [chapters, setChapters] = useReducer(chapterReducer, []);

    // Thêm chapter mới
    const onSubmit = async (data) => {
        try {
            const formData = { ...data, course_id: params.id };
            const res = await fetchJWT(`${apiUrl}/chapters`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (res.ok && result.status === 200) {
                toast.success("Create chapter successfully!");
                setChapters({ type: "ADD_CHAPTER", payload: result.data });
                reset({ chapter: "" });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Server connection error!");
        }
    };

    // Xóa chapter
    const handleDelete = async (id) => {
        const { success } = await deleteConfirm(`/chapters/${id}`);
        if (success) {
            toast.success("Delete chapter successfully!");
            setChapters({ type: "DELETE_CHAPTER", payload: id });
        }
    };

    // Xóa lesson
    const handleDeleteLesson = async (id, chapter_id) => {
        const { success } = await deleteConfirm(`/lessons/${id}`);
        if (success) {
            toast.success("Delete lesson successfully!");
            setChapters({
                type: "UPDATE_CHAPTER",
                payload: {
                    id: chapter_id,
                    lessons: chapters.find(c => c.id === chapter_id).lessons.filter(l => l.id !== id)
                }
            });
        }
    };

    // Thêm lesson vào chapter
    const addLessonToChapter = (newLesson) => {
        setChapters({ type: "ADD_LESSON", payload: newLesson });
    };

    // Load chapters từ course
    useEffect(() => {
        if (course.chapters) {
            setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
        }
    }, [course]);

    const [lessonData, setLessonData] = useState([]);
    const [showLessonSort, setShowLessonSort] = useState(false);
    const handleCloseLessonSort = () => setShowLessonSort(false);
    const handleShowLessonSort = (lessons) => {
        setShowLessonSort(true);
        setLessonData(lessons);
    }

    // sort Chapter
    const [showChapterSort, setShowChapterSort] = useState(false);
    const handleCloseChapterSort = () => setShowChapterSort(false);
    const handleShowChapterSort = (lessons) => {
        setShowChapterSort(true);
    }
    return (
        <div className='card shadow-lg border-0 mt-3'>
            <div className='card-body p-4'>
                <div className='d-flex justify-content-between'>
                    <h4 className='h5 mb-3'>Chapters</h4>
                    {/* <Link onClick={() => handleShowLessonModal(currentChapter)}>
                        <FaPlus size={12} /> <strong>Add Lesson</strong>
                    </Link> */}
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
                    <button className='btn btn-primary'>Save</button>
                </form>

                <div className="d-flex justify-content-between  mb-2 mt-4">
                    <h4 className="h5">Chapters</h4>
                    <Link className="h6" onClick={() => handleShowChapterSort()} >
                        <strong>Reorder Chapters</strong>
                    </Link>
                </div>
                <Accordion>
                    {chapters.map((chapter, index) => (
                        <Accordion.Item key={chapter.id} eventKey={index}>
                            <Accordion.Header>{chapter.title}</Accordion.Header>
                            <Accordion.Body>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="d-flex justify-content-between mb-2 ">
                                            <h4 className="h5">Lessons</h4>
                                            <Link className="h6" onClick={() => handleShowLessonSort(chapter.lessons)}><strong>Reorder Lessons</strong></Link>
                                        </div>
                                        <div className="col-md-12">
                                            {chapter.lessons && chapter.lessons.map(lesson => (
                                                <div key={lesson.id} className="d-flex mt-2 border bg-white shadow-lg rounded">
                                                    <div className="col-md-7 px-3 py-2 d-flex align-items-center">{lesson.title}</div>
                                                    <div className="col-md-5 px-3 py-2 d-flex justify-content-end align-items-center text-end">
                                                        {lesson.duration > 0 && <small className="fw-bold text-muted me-1 mb-0">{lesson.duration} mins</small>}
                                                        {lesson.is_free_preview === "yes" && <span className="badge bg-success">Preview</span>}
                                                        <Link to={`/account/courses/edit-lesson/${lesson.id}/${course.id}`} className="ms-1 text-primary">
                                                            <BsPencilSquare />
                                                        </Link>
                                                        <Link onClick={() => handleDeleteLesson(lesson.id, chapter.id)} className="ms-1 text-danger">
                                                            <FaTrashAlt />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="col-md-12 mt-3 d-flex">
                                            <button onClick={() => handleDelete(chapter.id)} className="btn btn-danger btn-sm">Delete Chapter</button>
                                            <button onClick={() => handleShow(chapter)} className="btn btn-primary btn-sm ms-2">Update Chapter</button>
                                            <button onClick={() => handleShowLessonModal(chapter)} className="btn btn-success btn-sm ms-2">Add Lesson</button>
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
                    addLessonToChapter={addLessonToChapter}
                    currentChapter={currentChapter}
                    chapters={chapters}
                />

                <LessonSort
                    showLessonSort={showLessonSort}
                    handleCloseLessonSort={handleCloseLessonSort}
                    lessonData={lessonData}
                    setChapters={setChapters}
                />

                <SortChapter
                    showChapterSort={showChapterSort}
                    handleCloseChapterSort={handleCloseChapterSort}
                    setChapters={setChapters}
                    chapters={chapters}
                />
            </div>
        </div>
    );
};

export default ManageChapter;
