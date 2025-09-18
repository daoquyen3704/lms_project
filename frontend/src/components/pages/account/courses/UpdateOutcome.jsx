import React, { useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';
const UpdateOutcome = ({ showOutcome, handleClose, outcomes, setOutcomes, outcomeData }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/outcomes/${outcomeData.id}`, {
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
                toast.success("Create updated successfully!");
                setOutcomes((prev) =>
                    prev.map((item) =>
                        item.id === outcomeData.id ? { ...item, text: data.outcome } : item
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
        if (outcomeData) {
            reset({
                outcome: outcomeData.text
            })
        }
    }, [outcomeData]);
    return (
        <>
            <Modal size='lg' show={showOutcome} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Outcome</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <label htmlFor="" className='form-label'>Outcome</label>
                            <input
                                {
                                ...register('outcome', { required: "The outcome is required" })
                                }
                                type="text"
                                className={`form-control ${errors.outcome ? 'is-invalid' : ''}`}
                                placeholder='Outcome' />
                            {
                                errors.outcome &&
                                <p className='invalid-feedback'>{errors.outcome.message}</p>
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

export default UpdateOutcome
