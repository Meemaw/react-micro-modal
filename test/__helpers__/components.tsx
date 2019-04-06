import React, { useState } from 'react';

import Modal from '../../src/react-micro-modal';

export const closeModalElementText = 'Close';
export const openModalTriggerText = 'Trigger';
export const firstFocusableElementText = 'Anchor element';

type TestProps = {
  closeOnEscapeClick?: boolean;
  closeOnOverlayClick?: boolean;
  modalClassName?: string;
  modalOverlayClassName?: string;
};

const UncontrolledModal = ({
  closeOnEscapeClick = true,
  closeOnOverlayClick = true,
  modalClassName = '',
  modalOverlayClassName = ''
}: TestProps) => {
  return (
    <Modal
      modalOverlayClassName={modalOverlayClassName}
      modalClassName={modalClassName}
      closeOnEscapeClick={closeOnEscapeClick}
      closeOnOverlayClick={closeOnOverlayClick}
      trigger={handleOpen => (
        <button onClick={handleOpen}>{openModalTriggerText}</button>
      )}
    >
      {handleClose => <ModalContent handleClose={handleClose} />}
    </Modal>
  );
};

interface ControlledTestProps extends TestProps {
  initiallyOpen?: boolean;
}

const ControlledModal = ({
  initiallyOpen = false,
  closeOnEscapeClick = true,
  closeOnOverlayClick = true,
  modalClassName = '',
  modalOverlayClassName = ''
}: ControlledTestProps) => {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <div>
      <button onClick={() => setOpen(true)}>{openModalTriggerText}</button>
      <Modal
        modalClassName={modalClassName}
        modalOverlayClassName={modalOverlayClassName}
        closeOnEscapeClick={closeOnEscapeClick}
        closeOnOverlayClick={closeOnOverlayClick}
        open={open}
        handleClose={() => setOpen(false)}
      >
        {_ => <ModalContent handleClose={() => setOpen(false)} />}
      </Modal>
    </div>
  );
};

const ModalContent = ({ handleClose }: { handleClose: () => void }) => (
  <div>
    <p>Modal content</p>
    <a href="www.google.com" target="_blank">
      {firstFocusableElementText}
    </a>
    <input placeholder="Write text..." />
    <button onClick={handleClose}>{closeModalElementText}</button>
  </div>
);

export { ControlledModal, UncontrolledModal };
