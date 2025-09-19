import React from 'react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { apiUrl, token } from '../../../common/Config'
import toast from 'react-hot-toast'
import { Modal } from 'react-bootstrap'
const UpdateRequirement = ({ showRequirement, handleClose, requirements, setRequirements, requirementData }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/requirements/${requirementData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),

            });
            const result = await res.json();
            // console.log(result);
            setLoading(false);
            if (res.ok && result.status === 200) {
                toast.success("Requirement updated successfully!");
                setRequirements((prev) =>
                    prev.map((item) =>
                        item.id === requirementData.id ? { ...item, text: data.requirement } : item
                    )
                );
                handleClose();
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
        if (requirementData) {
            reset({
                requirement: requirementData.text
            })
        }
    }, [requirementData]);
    return (
        <>
            <Modal size='lg' show={showRequirement} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Requirement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <label htmlFor="" className='form-label'>Requirement</label>
                            <input
                                {
                                ...register('requirement', { required: "The requirement is required" })
                                }
                                type="text"
                                className={`form-control ${errors.requirement ? 'is-invalid' : ''}`}
                                placeholder='Requirement' />
                            {
                                errors.requirement &&
                                <p className='invalid-feedback'>{errors.requirement.message}</p>
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className='btn btn-primary'
                            disabled={loading}
                        >
                            {loading == false ? 'Save' : 'Please wait...'}
                        </button>
                    </Modal.Footer>
                </form>

            </Modal>
        </>
    )
}

export default UpdateRequirement
