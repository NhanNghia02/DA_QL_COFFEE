import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfinModal = ({ show, onConfirm, onCancel, message }) => {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xác Nhận</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Hủy
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Xác Nhận
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfinModal;
