import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import CourseEdit from '../../common/CourseEdit'
import { apiUrl } from '../../common/Config'
import { fetchJWT } from '../../../utils/fetchJWT'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { deleteConfirm } from '../../../utils/deleteConfirm'
const MyCourses = () => {
    const [courses, setCourses] = useState([]);

    const fetchCourses = async () => {
        const res = await fetchJWT(`${apiUrl}/my-courses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        });
        const result = await res.json();
        if (res.ok && result.status === 200) {
            setCourses(result.data);
            console.log(result);
        } else {
            toast.error(result.message);
        }
    }

    const deleteCourse = async (courseId) => {
        const { success } = await deleteConfirm(`/courses/${courseId}`);

        if (success) {
            const newCourses = courses.filter(course => course.id !== courseId);
            setCourses(newCourses);
            toast.success("Delete course successfully!");
        } else {
            // toast.error("Failed to delete course.");
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);
    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>My Courses</h2>
                                <Link to="/account/courses/create" className='btn btn-primary'>Create</Link>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className='row gy-4'>
                                {
                                    courses && courses.map((course, index) => (
                                        <CourseEdit course={course} key={index} deleteCourse={deleteCourse} />
                                    ))
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>

    )
}

export default MyCourses
