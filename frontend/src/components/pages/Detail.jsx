import React, { useEffect } from 'react'
import Layout from '../common/Layout'
import { Rating } from 'react-simple-star-rating'
import { useState } from 'react'
import { Accordion, Badge, ListGroup, Card } from "react-bootstrap";
import { Link, useParams } from 'react-router-dom';
import { fetchJWT } from '../../utils/fetchJWT';
import { apiUrl, convertMinutesToHours } from '../common/Config';
import { LuMonitorPlay } from "react-icons/lu";
import { set } from 'lodash';
import FreePreview from '../common/FreePreview';


const Detail = () => {
    const [rating, setRating] = useState(4.0);
    const [loading, setLoading] = useState(false);
    const [courseDetail, setCourseDetail] = useState(null);
    const params = useParams();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [freeLesson, setFreeLesson] = useState(null);
    const handleShow = (lesson) => {
        setFreeLesson(lesson);
        setShow(true);
    }

    const fetchCourseDetail = async () => {
        setLoading(true);
        const res = await fetchJWT(`${apiUrl}/fetch-course/${params.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        });
        const result = await res.json();
        console.log(result);
        setLoading(false);
        if (res.ok && result.status === 200) {
            setCourseDetail(result.data);
        } else {
            console.error(result.message);
            return null;
        }
    }

    useEffect(() => {
        fetchCourseDetail();
    }, []);
    return (
        <Layout>

            {
                freeLesson && <FreePreview show={show} handleClose={handleClose} freeLesson={freeLesson} />
            }

            {
                loading && <div className='text-center my-5'>
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            }
            {
                courseDetail &&

                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item"><a href="/courses">Courses</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{courseDetail?.title}</li>
                        </ol>
                    </nav>
                    <div className='row my-5'>
                        <div className='col-lg-8'>
                            <h2>{courseDetail?.title}</h2>
                            <div className='d-flex'>
                                <div className='mt-1'>
                                    <span className="badge bg-green">{courseDetail?.category.name}</span>
                                </div>
                                <div className='d-flex ps-3'>
                                    <div className="text pe-2 pt-1">5.0</div>
                                    <Rating initialValue={rating} size={20} />
                                </div>
                            </div>
                            <div className="row mt-4">
                                {/* <div className="col">
                            <span className="text-muted d-block">Last Updates</span>
                            <span className="fw-bold">Aug 2021</span>
                        </div> */}
                                <div className="col">
                                    <span className="text-muted d-block">Level</span>
                                    <span className="fw-bold">{courseDetail?.level.name}</span>
                                </div>
                                <div className="col">
                                    <span className="text-muted d-block">Students</span>
                                    <span className="fw-bold">150,668</span>
                                </div>
                                <div className="col">
                                    <span className="text-muted d-block">Language</span>
                                    <span className="fw-bold">{courseDetail?.language.name}</span>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-12 mt-4'>
                                    <div className='border bg-white rounded-3 p-4'>
                                        <h3 className='mb-3  h4'>Overview</h3>
                                        {
                                            courseDetail?.description
                                        }
                                    </div>
                                </div>
                                <div className='col-md-12 mt-4'>
                                    <div className='border bg-white rounded-3 p-4'>
                                        <h3 className='mb-3 h4'>What you will learn</h3>
                                        <ul className="list-unstyled mt-3">
                                            {
                                                courseDetail?.outcomes.map((outcome, index) => (
                                                    <li className="d-flex align-items-center mb-2" key={index}>
                                                        <span className="text-success me-2">&#10003;</span>
                                                        <span>{outcome.text}</span>
                                                    </li>
                                                ))
                                            }

                                        </ul>
                                    </div>
                                </div>

                                <div className='col-md-12 mt-4'>
                                    <div className='border bg-white rounded-3 p-4'>
                                        <h3 className='mb-3 h4'>Requirements</h3>
                                        <ul className="list-unstyled mt-3">
                                            {
                                                courseDetail?.requirements.map((requirement, index) => (
                                                    <li className="d-flex align-items-center mb-2" key={index}>
                                                        <span className="text-success me-2">&#10003;</span>
                                                        <span>{requirement.text}</span>
                                                    </li>
                                                ))
                                            }

                                        </ul>
                                    </div>
                                </div>

                                <div className='col-md-12 mt-4'>
                                    <div className='border bg-white rounded-3 p-4'>
                                        <h3 className="h4 mb-3">Course Structure</h3>
                                        <p>
                                            {courseDetail.chapters ? courseDetail.chapters.length : 0} chapters • {courseDetail.total_lessons} lectures • {convertMinutesToHours(courseDetail.total_duration)}
                                        </p>
                                        <Accordion defaultActiveKey="0" id="courseAccordion">
                                            {
                                                courseDetail.chapters && courseDetail.chapters.map((chapter, index) => {
                                                    return (
                                                        <Accordion.Item key={index} eventKey={index.toString()}>
                                                            <Accordion.Header>
                                                                {chapter.title} <span className="ms-3 text-muted">({chapter.lessons_count} lectures - {convertMinutesToHours(chapter.lessons_sum_duration)})</span>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <ListGroup>
                                                                    {
                                                                        chapter.lessons && chapter.lessons.map((lesson, idx) => {
                                                                            return (
                                                                                <ListGroup.Item key={idx}>
                                                                                    <div className="row">
                                                                                        <div className="col-md-9">
                                                                                            <LuMonitorPlay className='me-2' />
                                                                                            {lesson.title}
                                                                                        </div>
                                                                                        <div className="col-md-3">
                                                                                            <div className='d-flex justify-content-end'>
                                                                                                {
                                                                                                    lesson.is_free_preview === 'yes' && <Badge bg="primary">
                                                                                                        <Link onClick={() => handleShow(lesson)} className="text-white text-decoration-none">Preview</Link>
                                                                                                    </Badge>
                                                                                                }

                                                                                                <span className="text-muted ms-2">{convertMinutesToHours(lesson.duration)}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </ListGroup.Item>
                                                                            )
                                                                        })
                                                                    }
                                                                </ListGroup>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    )
                                                })
                                            }


                                        </Accordion>
                                    </div>
                                </div>

                                <div className='col-md-12 mt-4'>
                                    <div className='border bg-white rounded-3 p-4'>
                                        <h3 className='mb-3 h4'>Reviews</h3>
                                        <p>Our student says about this course</p>

                                        <div className='mt-4'>
                                            <div className="d-flex align-items-start mb-4 border-bottom pb-3">
                                                <img src="https://placehold.co/50" alt="User" className="rounded-circle me-3" />
                                                <div>
                                                    <h6 className="mb-0">Mohit Singh <span className="text-muted fs-6">Jan 2, 2025</span></h6>
                                                    <div className="text-warning mb-2">
                                                        <Rating initialValue={rating} size={20} />
                                                    </div>
                                                    <p className="mb-0">Quisque et quam lacus amet. Tincidunt auctor phasellus purus faucibus lectus mattis.</p>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-start mb-4  pb-3">
                                                <img src="https://placehold.co/50" alt="User" className="rounded-circle me-3" />
                                                <div>
                                                    <h6 className="mb-0">mark Doe <span className="text-muted fs-6">Jan 10, 2025</span></h6>
                                                    <div className="text-warning mb-2">
                                                        <Rating initialValue={rating} size={20} />
                                                    </div>
                                                    <p className="mb-0">Quisque et quam lacus amet. Tincidunt auctor phasellus purus faucibus lectus mattis.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div className='border rounded-3 bg-white p-4 shadow-sm'>
                                <Card.Img variant="top" src={courseDetail.course_small_image} className="rounded-3" />
                                <Card.Body className='mt-3'>
                                    <h3 className="fw-bold">${courseDetail.price}</h3>
                                    {
                                        courseDetail.cross_price && <div className="text-muted text-decoration-line-through">${courseDetail.cross_price}</div>
                                    }
                                    {/* Buttons */}
                                    <div className="mt-4">
                                        <button className="btn btn-primary w-100">
                                            <i className="bi bi-ticket"></i> Buy Now
                                        </button>
                                    </div>
                                </Card.Body>
                                <Card.Footer className='mt-4'>
                                    <h6 className="fw-bold">This course includes</h6>
                                    <ListGroup variant="flush">

                                        <ListGroup.Item className='ps-0'>
                                            <i className="bi bi-infinity text-primary me-2"></i>
                                            Full lifetime access
                                        </ListGroup.Item>
                                        <ListGroup.Item className='ps-0'>
                                            <i className="bi bi-tv text-primary me-2"></i>
                                            Access on mobile and TV
                                        </ListGroup.Item>
                                        <ListGroup.Item className='ps-0'>
                                            <i className="bi bi-award-fill text-primary me-2"></i>
                                            Certificate of completion
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Footer>
                            </div>
                        </div>
                    </div>
                </div>

            }
        </Layout>
    )
}

export default Detail
