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
  closeOnAnimationEnd?: boolean;
  initiallyOpen?: boolean;
  open?: boolean;
};

const UncontrolledTestModal = ({
  closeOnEscapeClick = true,
  closeOnOverlayClick = true,
  modalClassName = '',
  modalOverlayClassName = '',
  closeOnAnimationEnd = false,
  initiallyOpen = false,
  open
}: TestProps) => {
  return (
    <Modal
      modalOverlayClassName={modalOverlayClassName}
      closeOnAnimationEnd={closeOnAnimationEnd}
      modalClassName={modalClassName}
      closeOnEscapeClick={closeOnEscapeClick}
      closeOnOverlayClick={closeOnOverlayClick}
      initiallyOpen={initiallyOpen}
      open={open}
      trigger={handleOpen => (
        <button onClick={handleOpen}>{openModalTriggerText}</button>
      )}
    >
      {handleClose => <TestModalContent handleClose={handleClose} />}
    </Modal>
  );
};

const ControlledTestModal = ({
  initiallyOpen = false,
  closeOnEscapeClick = true,
  closeOnOverlayClick = true,
  modalClassName = '',
  modalOverlayClassName = '',
  closeOnAnimationEnd = false
}: TestProps) => {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <div>
      <button onClick={() => setOpen(true)}>{openModalTriggerText}</button>
      <Modal
        closeOnAnimationEnd={closeOnAnimationEnd}
        modalClassName={modalClassName}
        modalOverlayClassName={modalOverlayClassName}
        closeOnEscapeClick={closeOnEscapeClick}
        closeOnOverlayClick={closeOnOverlayClick}
        initiallyOpen={initiallyOpen}
        open={open}
        handleClose={() => setOpen(false)}
      >
        {handleClose => <TestModalContent handleClose={handleClose} />}
      </Modal>
    </div>
  );
};

const TestModalContent = ({ handleClose }: { handleClose: () => void }) => (
  <div>
    <p>Modal content</p>
    <a href="www.google.com" target="_blank">
      {firstFocusableElementText}
    </a>
    <input placeholder="Write text..." />
    <button onClick={handleClose}>{closeModalElementText}</button>
  </div>
);

export { ControlledTestModal, UncontrolledTestModal };
