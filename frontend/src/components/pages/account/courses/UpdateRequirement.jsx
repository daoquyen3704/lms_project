import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth'; // Import AuthContext
import toast from 'react-hot-toast';
import { Modal } from 'react-bootstrap';
import { fetchJWT } from '../../../../utils/fetchJWT';

const UpdateRequirement = ({ showRequirement, handleClose, requirements, setRequirements, requirementData }) => {
    const { token } = useContext(AuthContext); // Get token from AuthContext
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetchJWT(`${apiUrl}/requirements/${requirementData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
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
                toast.error(result.message || "Update failed!");
            }
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
            toast.error("Server connection error!");
        }
    };

    useEffect(() => {
        if (requirementData) {
            reset({
                requirement: requirementData.text,
            });
        }
    }, [requirementData, reset]);

    return (
        <Modal size='lg' show={showRequirement} onHide={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Requirement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        <label className='form-label'>Requirement</label>
                        <input
                            {...register('requirement', { required: "The requirement is required" })}
                            type="text"
                            className={`form-control ${errors.requirement ? 'is-invalid' : ''}`}
                            placeholder='Requirement'
                        />
                        {errors.requirement && <p className='invalid-feedback'>{errors.requirement.message}</p>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className='btn btn-primary'
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : 'Save'}
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default UpdateRequirement;
