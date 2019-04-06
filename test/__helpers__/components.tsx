import React, { useState } from 'react';

import Modal from '../../src/react-micro-modal';

export const closeModalElementText = 'Close';
export const openModalTriggerText = 'Trigger';
export const firstFocusableElementText = 'Anchor element';

type TestProps = {
  closeOnEscapeClick?: boolean;
  closeOnOverlayClick?: boolean;
};

const UncontrolledModal = ({
  closeOnEscapeClick = true,
  closeOnOverlayClick = true
}: TestProps) => {
  return (
    <Modal
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
  closeOnOverlayClick = true
}: ControlledTestProps) => {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <div>
      <button onClick={() => setOpen(true)}>{openModalTriggerText}</button>
      <Modal
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
