import React, { useState } from 'react';

import { BaseProps } from '../../src';
import Modal from '../../src/react-micro-modal';

export const closeModalElementText = 'Close';
export const openModalTriggerText = 'Trigger';
export const firstFocusableElementText = 'Anchor element';

const UncontrolledTestModal = ({
  closeOnEscapePress = true,
  closeOnOverlayClick = true,
  modalClassName = '',
  modalOverlayClassName = '',
  closeOnAnimationEnd = false,
  openInitially = false,
  open,
  disableFirstElementFocus = false
}: BaseProps) => {
  return (
    <Modal
      modalOverlayClassName={modalOverlayClassName}
      closeOnAnimationEnd={closeOnAnimationEnd}
      modalClassName={modalClassName}
      closeOnEscapePress={closeOnEscapePress}
      closeOnOverlayClick={closeOnOverlayClick}
      openInitially={openInitially}
      open={open}
      disableFirstElementFocus={disableFirstElementFocus}
      trigger={handleOpen => (
        <button onClick={handleOpen}>{openModalTriggerText}</button>
      )}
    >
      {handleClose => <TestModalContent handleClose={handleClose} />}
    </Modal>
  );
};

const ControlledTestModal = ({
  openInitially = false,
  closeOnEscapePress = true,
  closeOnOverlayClick = true,
  modalClassName = '',
  modalOverlayClassName = '',
  closeOnAnimationEnd = false,
  disableFirstElementFocus = false
}: BaseProps) => {
  const [open, setOpen] = useState(openInitially);
  return (
    <div>
      <button onClick={() => setOpen(true)}>{openModalTriggerText}</button>
      <Modal
        closeOnAnimationEnd={closeOnAnimationEnd}
        modalClassName={modalClassName}
        modalOverlayClassName={modalOverlayClassName}
        closeOnEscapePress={closeOnEscapePress}
        disableFirstElementFocus={disableFirstElementFocus}
        closeOnOverlayClick={closeOnOverlayClick}
        openInitially={openInitially}
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
