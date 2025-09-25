import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from 'react-hot-toast';
import { fetchJWT } from '../../../../utils/fetchJWT';
import { apiUrl } from '../../../common/Config';
import { MdDragIndicator } from "react-icons/md";

const LessonSort = ({ showLessonSort, handleCloseLessonSort, lessonData, setChapters }) => {
    const [lessons, setLessons] = useState([]);
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        setLessons(lessonData);
    }, [lessonData]);

    const saveOrder = async (updateLessons) => {
        try {
            const res = await fetchJWT(`${apiUrl}/sort-lessons`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ lessons: updateLessons }),
            });
            const result = await res.json();
            if (res.ok && result.status === 200) {
                setChapters({
                    type: "UPDATE_CHAPTER",
                    payload: result.chapter
                });
                toast.success("Save lesson order successfully!");
            } else {
                toast.error(result.message || "Failed to save order.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Server connection error!");
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(lessons);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setLessons(reorderedItems);
        saveOrder(reorderedItems);
    };

    const onSubmit = data => console.log(data);

    return (
        <Modal size='lg' show={showLessonSort} onHide={handleCloseLessonSort}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sort Lessons</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {lessons.map((lesson, index) => (
                                        <Draggable key={lesson.id} draggableId={`${lesson.id}`} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="mt-2 border px-3 py-2 bg-white shadow-lg rounded"
                                                >

                                                    {
                                                        <div className='d-flex align-items-center'><MdDragIndicator />
                                                            {lesson.title}
                                                        </div>
                                                    }
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </form>
        </Modal>
    );
};

export default LessonSort;
