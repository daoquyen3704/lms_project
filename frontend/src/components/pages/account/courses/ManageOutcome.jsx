import React, { useEffect } from 'react'
import { useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { Modal, Button } from 'react-bootstrap';
import UpdateOutcome from './UpdateOutcome';

const ManageOutcome = () => {
    const [loading, setLoading] = useState(false);
    const [outcomes, setOutcomes] = useState([]);
    const [outcomeData, setOutcomeData] = useState();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const params = useParams();

    const [showOutcome, setShowOutcome] = useState(false);
    const handleClose = () => setShowOutcome(false);
    const handleShow = (outcome) => {
        setShowOutcome(true);
        setOutcomeData(outcome);
    };
    const onSubmit = async (data) => {
        setLoading(true);
        const formData = { ...data, course_id: params.id };
        try {
            const res = await fetch(`${apiUrl}/outcomes`, {
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
                toast.success("Create outcome successfully!");
                reset({ outcome: "" });
                fetchOutcomes();
            } else {
                toast.error(result.message);
            }
        }
        catch (error) {
            console.error("Register error:", error);
            toast.error("Lỗi kết nối server!");
        }

    };

    const fetchOutcomes = async () => {
        try {
            const res = await fetch(`${apiUrl}/outcomes?course_id=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const result = await res.json();
            console.log(result);
            if (res.ok && result.status === 200) {
                setOutcomes(result.data);
            } else {
                toast.error(result.message);
            }
        }
        catch (error) {
            console.error("Register error:", error);
            toast.error("Lỗi kết nối server!");
        }

    };
    useEffect(() => {
        fetchOutcomes();
    }, []);

    const deleteOutcome = async (id) => {
        try {
            if (confirm("Are you sure you want to delete this outcome?")) {
                const res = await fetch(`${apiUrl}/outcomes/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }

                });
                const result = await res.json();
                // console.log(result);
                if (res.ok && result.status === 200) {
                    const newOutcomes = outcomes.filter((outcome) => outcome.id !== id);
                    toast.success("Delete outcome successfully!");
                    fetchOutcomes();
                } else {
                    toast.error(result.message);
                }
            }

        }
        catch (error) {
            console.error("Register error:", error);
            toast.error("Lỗi kết nối server!");
        }

    };
    return (
        <>
            <div className='card shadow-lg border-0'>
                <div className='card-body p-4'>
                    <div className='d-flex justify-content-between'>
                        <h4 className='h5 mb-3'>Outcome</h4>
                    </div>
                    <form className='mb-4' onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-3'>
                            <input
                                {
                                ...register('outcome', { required: "The outcome field is required" })
                                }
                                type="text"
                                className={`form-control ${errors.outcome ? 'is-invalid' : ''}`}
                                placeholder='Outcome' />
                            {
                                errors.outcome &&
                                <p className='invalid-feedback'>{errors.outcome.message}</p>
                            }
                        </div>
                        <button
                            className='btn btn-primary'
                            disabled={loading}
                        >
                            {loading == false ? 'Save' : 'Please wait...'}
                        </button>
                    </form>
                    {
                        outcomes && outcomes.map((outcome) => {
                            return (
                                <div key={`outcome - ${outcome.id}`} className='card shadow mb-2' >
                                    <div className='card-body p-2 d-flex'>
                                        <div><MdDragIndicator /></div>
                                        <div className='d-flex justify-content-between w-100'>
                                            <div className='ps-2'>
                                                {outcome.text}
                                            </div>
                                            <div className='d-flex'>
                                                <Link onClick={() => handleShow(outcome)} className='text-primary me-1'><BsPencilSquare /></Link>
                                                <Link onClick={() => deleteOutcome(outcome.id)} className='text-danger'><FaTrashAlt /></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
            </div >

            <UpdateOutcome
                outcomeData={outcomeData}
                showOutcome={showOutcome}
                handleClose={handleClose}
                outcomes={outcomes}
                setOutcomes={setOutcomes}
            />
        </>



    )
}

export default ManageOutcome
