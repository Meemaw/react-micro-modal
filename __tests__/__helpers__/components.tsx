import React, { useState } from 'react';

import { MicroModalProps } from '../../src';
import Modal from '../../src/react-micro-modal';

export const closeModalElementText = 'Close';
export const openModalTriggerText = 'Trigger';
export const firstFocusableElementText = 'Anchor element';

type TestModalProps = Omit<MicroModalProps, 'children'>;

const UncontrolledTestModal = ({
  closeOnEscapePress = true,
  closeOnOverlayClick = true,
  closeOnAnimationEnd = false,
  openInitially = false,
  open,
  disableFirstElementFocus = false,
  overrides,
}: TestModalProps) => {
  return (
    <Modal
      closeOnAnimationEnd={closeOnAnimationEnd}
      closeOnEscapePress={closeOnEscapePress}
      closeOnOverlayClick={closeOnOverlayClick}
      openInitially={openInitially}
      open={open}
      disableFirstElementFocus={disableFirstElementFocus}
      trigger={(handleOpen) => (
        <button onClick={handleOpen} type="button">
          {openModalTriggerText}
        </button>
      )}
      overrides={overrides}
    >
      {(handleClose) => <TestModalContent handleClose={handleClose} />}
    </Modal>
  );
};

const ControlledTestModal = ({
  openInitially = false,
  closeOnEscapePress = true,
  closeOnOverlayClick = true,
  closeOnAnimationEnd = false,
  disableFirstElementFocus = false,
  ...rest
}: TestModalProps) => {
  const [open, setOpen] = useState(openInitially);
  return (
    <div>
      <button onClick={() => setOpen(true)} type="button">
        {openModalTriggerText}
      </button>
      <Modal
        closeOnAnimationEnd={closeOnAnimationEnd}
        closeOnEscapePress={closeOnEscapePress}
        disableFirstElementFocus={disableFirstElementFocus}
        closeOnOverlayClick={closeOnOverlayClick}
        openInitially={openInitially}
        open={open}
        handleClose={() => setOpen(false)}
        {...rest}
      >
        {(handleClose) => <TestModalContent handleClose={handleClose} />}
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
    <button onClick={handleClose} type="button">
      {closeModalElementText}
    </button>
  </div>
);

export { ControlledTestModal, UncontrolledTestModal };
