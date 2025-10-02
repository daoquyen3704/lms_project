import React, { useEffect, useState } from 'react'
import Course from './Course'
import toast from 'react-hot-toast'
import { apiUrl } from '../common/Config'

const FeaturedCourses = () => {
    const [courses, setCourses] = useState([]);

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${apiUrl}/fetch-featured-courses`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
            const result = await res.json();
            if (res.ok && result.status === 200) {
                setCourses(result.data);
            } else {
            }
        } catch (error) {
            console.error("Something went wrong", error);
        }
    }
    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <section className='section-3 my-5'>
            <div className="container">
                <div className='section-title py-3  mt-4'>
                    <h2 className='h3'>Featured Courses</h2>
                    <p>Discover courses designed to help you excel in your professional and personal growth.</p>
                </div>
                <div className="row gy-4">
                    {
                        courses && courses.map(course => (
                            <Course
                                key={course.id}
                                course={course}
                                customClasses="col-lg-3 col-md-6"
                            />
                        ))

                    }



                </div>
            </div>
        </section>
    )
}

export default FeaturedCourses
