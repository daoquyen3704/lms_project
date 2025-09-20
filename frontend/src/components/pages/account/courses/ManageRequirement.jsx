import React from 'react'
import { Link, useParams } from 'react-router-dom';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import UpdateRequirement from './UpdateRequirement';
import { useState, useEffect } from 'react';
import { set, useForm } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ManageRequirement = () => {
    const [loading, setLoading] = useState(false);
    const [requirements, setRequirements] = useState([]);
    const [requirementData, setRequirementData] = useState();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const params = useParams();

    const [showRequirement, setShowRequirement] = useState(false);
    const handleClose = () => setShowRequirement(false);
    const handleShow = (requirement) => {
        setShowRequirement(true);
        setRequirementData(requirement);
    };
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const FormData = { ...data, course_id: params.id };
            const res = await fetch(`${apiUrl}/requirements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(FormData),

            });
            const result = await res.json();
            // console.log(result);
            setLoading(false);
            if (res.ok && result.status === 200) {
                const newRequirement = [...requirements, result.data];
                setRequirements(newRequirement);
                toast.success("Requirement updated successfully!");
                reset();
            } else {
                toast.error(result.message);
            }
        }
        catch (error) {
            console.error("Register error:", error);
            toast.error("Lỗi kết nối server!");
        }

    };

    const fetchRequirements = async () => {
        try {
            const res = await fetch(`${apiUrl}/requirements?course_id=${params.id}`, {
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
                setRequirements(result.data);
            } else {
                toast.error(result.message);
            }
        }
        catch (error) {
            console.error("Register error:", error);
            toast.error("Lỗi kết nối server!");
        }

    };

    const deleteRequirement = async (id) => {
        try {
            if (confirm("Are you sure you want to delete this requirement?")) {
                const res = await fetch(`${apiUrl}/requirements/${id}`, {
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
                    // const newOutcomes = outcomes.filter((outcome) => outcome.id !== id);
                    fetchRequirements();
                    toast.success("Delete requirement successfully!");
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

    useEffect(() => {
        fetchRequirements();
    }, []);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(requirements);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setRequirements(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updateRequirements) => {
        try {
            const res = await fetch(`${apiUrl}/sort-requirements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ requirements: updateRequirements }),

            });
            const result = await res.json();
            // console.log(result);
            if (res.ok && result.status === 200) {
                toast.success("Save requirement successfully!");
            } else {
                toast.error(result.message);
            }
        }
        catch (error) {
            console.error("Register error:", error);
            toast.error("Lỗi kết nối server!");
        }
    }
    return (
        <>
            <div className='card shadow-lg border-0 mt-3'>
                <div className='card-body p-4'>
                    <div className='d-flex justify-content-between'>
                        <h4 className='h5 mb-3'>Requirement</h4>
                    </div>
                    <form className='mb-4' onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-3'>
                            <input
                                {
                                ...register('requirement', { required: "The requirement field is required" })
                                }
                                type="text"
                                className={`form-control ${errors.requirement ? 'is-invalid' : ''}`}
                                placeholder='Requirement' />
                            {
                                errors.requirement &&
                                <p className='invalid-feedback'>{errors.requirement.message}</p>
                            }
                        </div>
                        <button
                            className='btn btn-primary'
                            disabled={loading}
                        >
                            {loading == false ? 'Save' : 'Please wait...'}
                        </button>
                    </form>

                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        requirements.map((requirement, index) => (
                                            <Draggable key={requirement.id} draggableId={`${requirement.id}`} index={index}>

                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mt-2 border bg-white shadow-lg  rounded"
                                                    >
                                                        <div className='card-body p-2 d-flex'>
                                                            <div><MdDragIndicator /></div>
                                                            <div className='d-flex justify-content-between w-100'>
                                                                <div className='ps-2'>
                                                                    {requirement.text}
                                                                </div>
                                                                <div className='d-flex'>
                                                                    <Link onClick={() => handleShow(requirement)} className='text-primary me-1'><BsPencilSquare /></Link>
                                                                    <Link onClick={() => deleteRequirement(requirement.id)} className='text-danger'><FaTrashAlt /></Link>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>



                </div>
            </div >

            <UpdateRequirement
                showRequirement={showRequirement}
                handleClose={handleClose}
                requirements={requirements}
                setRequirements={setRequirements}
                requirementData={requirementData}
            />
        </>
    )
}

export default ManageRequirement
