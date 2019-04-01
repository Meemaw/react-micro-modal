import React, { useState } from 'react';
import { Matcher, render } from 'react-testing-library';

import Modal from '../src/react-micro-modal';
import { fireDocumentClick, fireEscapeKey } from './__helpers__/events';

describe('Micro modal', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  describe('Nested modal', () => {
    it('Should open and close nested modals on triggers', () => {
      const { getByTestId, getByText } = render(
        <Modal
          trigger={handleOpen => <div onClick={handleOpen}>Open modal</div>}
        >
          {handleClose => (
            <Modal
              id="nested-micro-modal"
              trigger={handleOpen => (
                <div>
                  <div onClick={handleOpen}>Open nested modal</div>
                  <div onClick={handleClose}>Close modal</div>
                </div>
              )}
            >
              {handleClose => (
                <div onClick={handleClose}>Close nested modal</div>
              )}
            </Modal>
          )}
        </Modal>
      );
      let modalWrapper = getByTestId('micro-modal');

      expectModalIsClosed(modalWrapper);
      getByText('Open modal').click();

      let nestedModalWrapper = getByTestId('nested-micro-modal');
      expectModalIsOpen(modalWrapper);
      expectModalIsClosed(nestedModalWrapper);

      getByText('Open nested modal').click();
      expectModalIsOpen(modalWrapper);
      expectModalIsOpen(nestedModalWrapper);

      getByText('Close nested modal').click();
      expectModalIsOpen(modalWrapper);
      expectModalIsClosed(nestedModalWrapper);

      getByText('Close modal').click();
      expectModalIsClosed(modalWrapper);
      expectModalIsClosed(nestedModalWrapper);
    });
  });

  describe('Controlled modal', () => {
    it('Should be initially closed on closed prop pased', () => {
      const { getByTestId } = render(<ControlledModal />);
      let modalWrapper = getByTestId('micro-modal');
      expectModalIsClosed(modalWrapper);
    });

    it('Should be initially open on open prop passed', () => {
      const { getByTestId } = render(<ControlledModal initiallyOpen={true} />);
      const modalWrapper = getByTestId('micro-modal');
      expectModalIsOpen(modalWrapper);
    });

    it('Should focus first focusable element on open', () => {
      const { getByText } = render(<ControlledModal />);
      expectFirstElementFocusableAfterModalOpens(getByText);
    });
  });

  describe('Uncontrolled modal', () => {
    it('Should apply correct classnames and attributes on modal toggle', () => {
      const { getByText, getByTestId } = render(<UncontrolledModal />);
      let modalWrapper = getByTestId('micro-modal');

      expectModalIsClosed(modalWrapper);
      openModal(getByText);
      expectModalIsOpen(modalWrapper);
      closeModal(getByText);

      expectModalIsClosed(modalWrapper);
    });

    it('Open modal should close on escape key press', () => {
      const { getByText, getByTestId } = render(<UncontrolledModal />);
      openModal(getByText);
      let modalWrapper = getByTestId('micro-modal');
      expectModalIsOpen(modalWrapper);
      fireEscapeKey(modalWrapper);
      expectModalIsClosed(modalWrapper);
    });

    it('Open modal should close on document click', () => {
      const { getByText, getByTestId } = render(<UncontrolledModal />);
      openModal(getByText);
      let modalWrapper = getByTestId('micro-modal');
      expectModalIsOpen(modalWrapper);
      fireDocumentClick(modalWrapper);
      expectModalIsClosed(modalWrapper);
    });

    it('Open modal should not close on document click', () => {
      const { getByText, getByTestId } = render(
        <Modal
          closeOnOverlayClick={false}
          trigger={handleOpen => (
            <button onClick={handleOpen}>{openModalTriggerText}</button>
          )}
        >
          {handleClose => <ModalContent handleClose={handleClose} />}
        </Modal>
      );
      openModal(getByText);
      let modalWrapper = getByTestId('micro-modal');
      expectModalIsOpen(modalWrapper);
      fireDocumentClick(modalWrapper);
      expectModalIsOpen(modalWrapper);
    });

    it('Open modal should not close on escape key press', () => {
      const { getByText, getByTestId } = render(
        <Modal
          closeOnEscapeClick={false}
          trigger={handleOpen => (
            <button onClick={handleOpen}>{openModalTriggerText}</button>
          )}
        >
          {handleClose => <ModalContent handleClose={handleClose} />}
        </Modal>
      );

      openModal(getByText);
      let modalWrapper = getByTestId('micro-modal');
      expectModalIsOpen(modalWrapper);
      fireEscapeKey(modalWrapper);
      expectModalIsOpen(modalWrapper);
    });

    it('Should focus first focusable element on open', () => {
      const { getByText } = render(<UncontrolledModal />);
      expectFirstElementFocusableAfterModalOpens(getByText);
    });
  });
});

function expectModalIsClosed(modal: HTMLElement) {
  expect(modal.className).toBe('modal modal-slide');
  expect(modal.getAttribute('aria-hidden')).toBe('true');
}

function expectModalIsOpen(modal: HTMLElement) {
  expect(modal.className).toBe('modal modal-slide is-open');
  expect(modal.getAttribute('aria-hidden')).toBe('false');
}

function expectFirstElementFocusableAfterModalOpens(
  getByText: (text: Matcher) => HTMLElement
) {
  openModal(getByText);
  expect(getByText(firstFocusableElementText)).toBe(document.activeElement);
}

const closeModalElementText = 'Close';
const openModalTriggerText = 'Trigger';
const firstFocusableElementText = 'Anchor element';

function closeModal(getByText: (text: Matcher) => HTMLElement) {
  getByText(closeModalElementText).click();
}

function openModal(getByText: (text: Matcher) => HTMLElement) {
  getByText(openModalTriggerText).click();
}

const UncontrolledModal = () => {
  return (
    <Modal
      trigger={handleOpen => (
        <button onClick={handleOpen}>{openModalTriggerText}</button>
      )}
    >
      {handleClose => <ModalContent handleClose={handleClose} />}
    </Modal>
  );
};

const ControlledModal = ({
  initiallyOpen = false
}: {
  initiallyOpen?: boolean;
}) => {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <div>
      <button onClick={() => setOpen(true)}>{openModalTriggerText}</button>
      <Modal open={open} handleClose={() => setOpen(false)}>
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
