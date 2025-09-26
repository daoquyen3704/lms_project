import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { fetchJWT } from '../../../../utils/fetchJWT'
import { apiUrl } from '../../../common/Config'
import { MdDragIndicator } from 'react-icons/md'
import { toast } from 'react-hot-toast'

const SortChapter = ({ showChapterSort, handleCloseChapterSort, chapters, setChapters }) => {
    const [chaptersData, setChaptersData] = useState([])

    useEffect(() => {
        if (chapters) {
            setChaptersData(chapters)
        }
    }, [chapters])

    const handleDragEnd = (result) => {
        if (!result.destination) return

        const reordered = Array.from(chaptersData)
        const [moved] = reordered.splice(result.source.index, 1)
        reordered.splice(result.destination.index, 0, moved)

        setChaptersData(reordered)
        saveOrder(reordered)
    }

    const saveOrder = async (updatedChapters) => {
        try {
            const res = await fetchJWT(`${apiUrl}/sort-chapters`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ chapters: updatedChapters }),
            })
            const result = await res.json()

            if (res.ok && result.status === 200) {
                // update luôn reducer cha
                setChapters({ type: "SET_CHAPTERS", payload: updatedChapters })
                toast.success("Save chapter order successfully!")
            } else {
                toast.error(result.message || "Failed to save order.")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Server connection error!")
        }
    }

    return (
        <Modal size='lg' show={showChapterSort} onHide={handleCloseChapterSort}>
            <Modal.Header closeButton>
                <Modal.Title>Sort Chapters</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="chapter-list">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                {chaptersData.map((chapter, index) => (
                                    <Draggable key={chapter.id} draggableId={`${chapter.id}`} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="mt-2 border px-3 py-2 bg-white shadow-md rounded d-flex align-items-center"
                                            >
                                                <MdDragIndicator className="me-2" />
                                                {chapter.title}
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
        </Modal>
    )
}

export default SortChapter
