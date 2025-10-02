import React from 'react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { apiUrl } from '../common/Config'
import { Link } from 'react-router-dom'

const FeaturedCategories = () => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${apiUrl}/fetch-categories`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
            const result = await res.json();
            if (res.ok && result.status === 200) {
                setCategories(result.data);
            } else {
            }
        } catch (error) {
            console.error("Something went wrong", error);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);
    return (
        <section className='section-2'>
            <div className="container">
                <div className='section-title py-3  mt-4'>
                    <h2 className='h3'>Explore Categories</h2>
                    <p>Discover categories designed to help you excel in your professional and personal growth.</p>
                </div>
                <div className='row gy-3'>
                    {
                        categories && categories.map(category => (
                            <div key={category.id} className='col-6 col-md-6 col-lg-3' >
                                <div className='card shadow border-0'>
                                    <div className='card-body'><Link>{category.name}</Link></div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </section>
    )
}

export default FeaturedCategories
