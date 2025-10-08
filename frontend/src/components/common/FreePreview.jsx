import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ReactPlayer from 'react-player';
const FreePreview = ({ show, handleClose, freeLesson }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{freeLesson.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ReactPlayer
                    width="100%"
                    height="100%"
                    src={freeLesson.video_url}
                    controls={true}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FreePreview


