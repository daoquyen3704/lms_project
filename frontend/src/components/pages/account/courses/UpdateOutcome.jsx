import React, { useEffect, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../context/Auth'; // Import AuthContext
import { fetchJWT } from '../../../../utils/fetchJWT';

const UpdateOutcome = ({ showOutcome, handleClose, outcomes, setOutcomes, outcomeData }) => {
    const { token } = useContext(AuthContext); // Get token from AuthContext
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetchJWT(`${apiUrl}/outcomes/${outcomeData.id}`, {
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
                toast.success("Outcome updated successfully!");
                setOutcomes((prev) =>
                    prev.map((item) =>
                        item.id === outcomeData.id ? { ...item, text: data.outcome } : item
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
        if (outcomeData) {
            reset({
                outcome: outcomeData.text
            });
        }
    }, [outcomeData, reset]);

    return (
        <Modal size='lg' show={showOutcome} onHide={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Outcome</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        <label className='form-label'>Outcome</label>
                        <input
                            {...register('outcome', { required: "The outcome is required" })}
                            type="text"
                            className={`form-control ${errors.outcome ? 'is-invalid' : ''}`}
                            placeholder='Outcome'
                        />
                        {errors.outcome && <p className='invalid-feedback'>{errors.outcome.message}</p>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-primary' disabled={loading}>
                        {loading ? 'Please wait...' : 'Save'}
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default UpdateOutcome;
