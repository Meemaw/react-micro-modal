import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Modal from '../src/react-micro-modal';
import {
  UncontrolledTestModal,
  ControlledTestModal,
  firstFocusableElementText,
  closeModalElementText,
  openModalTriggerText,
} from './__helpers__/components';
import { fireEscapeKey } from './__helpers__/events';

const MODAL_FIXTURES = [
  { description: 'Uncontrolled modal', ModalComponent: UncontrolledTestModal },
  { description: 'Controlled modal', ModalComponent: ControlledTestModal },
];

const closeModal = () => {
  userEvent.click(screen.getByText(closeModalElementText));
};

const openModal = () => {
  userEvent.click(screen.getByText(openModalTriggerText));
};

const expectModalIsOpen = (modal: HTMLElement) => {
  expect(modal.className).toBe('modal modal-slide is-open');
  expect(modal.getAttribute('aria-hidden')).toBe('false');
};

const expectModalIsClosed = (modal: HTMLElement) => {
  expect(modal.className).toBe('modal modal-slide');
  expect(modal.getAttribute('aria-hidden')).toBe('true');
};

describe('Micro modal', () => {
  describe('Nested modal', () => {
    it('Should open and close nested modals on triggers', () => {
      const { getByTestId, getByText } = render(
        <Modal
          trigger={(handleOpen) => <div onClick={handleOpen}>Open modal</div>}
        >
          {(handleClose) => (
            <Modal
              id="nested-micro-modal"
              trigger={(handleOpen) => (
                <div>
                  <div onClick={handleOpen}>Open nested modal</div>
                  <div onClick={handleClose}>Close modal</div>
                </div>
              )}
            >
              {(handleClose) => (
                <div onClick={handleClose}>Close nested modal</div>
              )}
            </Modal>
          )}
        </Modal>
      );
      const modalWrapper = getByTestId('micro-modal');

      expectModalIsClosed(modalWrapper);
      userEvent.click(getByText('Open modal'));

      expect(
        document.body.querySelector('.nested-micro-modal-portal')
      ).toBeTruthy();

      const nestedModalWrapper = getByTestId('nested-micro-modal');
      expectModalIsOpen(modalWrapper);
      expectModalIsClosed(nestedModalWrapper);

      userEvent.click(getByText('Open nested modal'));
      expectModalIsOpen(modalWrapper);
      expectModalIsOpen(nestedModalWrapper);

      userEvent.click(getByText('Close nested modal'));
      expectModalIsOpen(modalWrapper);
      expectModalIsClosed(nestedModalWrapper);

      userEvent.click(getByText('Close modal'));
      expectModalIsClosed(modalWrapper);
      expectModalIsClosed(nestedModalWrapper);

      // we clean nested modal after ourselves
      expect(
        document.body.querySelector('.nested-micro-modal-portal')
      ).toBeNull();
    });
  });

  MODAL_FIXTURES.forEach(({ description, ModalComponent }) => {
    describe(description, () => {
      it('Should apply correct classnames and attributes on modal toggle', () => {
        render(<ModalComponent />);
        const modalWrapper = screen.getByTestId('micro-modal');
        expectModalIsClosed(modalWrapper);
        openModal();
        expectModalIsOpen(modalWrapper);
        closeModal();
        expectModalIsClosed(modalWrapper);
      });

      it('Open modal should close on escape key press', () => {
        render(<ModalComponent />);
        openModal();
        const modalWrapper = screen.getByTestId('micro-modal');
        expectModalIsOpen(modalWrapper);
        fireEscapeKey(modalWrapper);
        expectModalIsClosed(modalWrapper);
      });

      it('Open modal should close on document click', () => {
        render(<ModalComponent />);
        openModal();
        const modalWrapper = screen.getByTestId('micro-modal');
        expectModalIsOpen(modalWrapper);
        userEvent.click(modalWrapper);
        expectModalIsClosed(modalWrapper);
      });

      it('Open modal should not close on escape key press', () => {
        render(<ModalComponent closeOnEscapePress={false} />);
        openModal();
        const modalWrapper = screen.getByTestId('micro-modal');
        expectModalIsOpen(modalWrapper);
        fireEscapeKey(modalWrapper);
        expectModalIsOpen(modalWrapper);
      });

      it('Open modal should not close on document click', () => {
        render(<ModalComponent closeOnOverlayClick={false} />);
        openModal();
        const modalWrapper = screen.getByTestId('micro-modal');
        expectModalIsOpen(modalWrapper);
        userEvent.click(document.body);
        expectModalIsOpen(modalWrapper);
      });

      it('Should focus first focusable element on open', () => {
        render(<ModalComponent />);
        openModal();
        expect(screen.getByText(firstFocusableElementText)).toBe(
          document.activeElement
        );
      });

      it('Should focus previous element on shift+tab click', () => {
        render(<ModalComponent />);
        openModal();
        expect(screen.getByText(firstFocusableElementText)).toBe(
          document.activeElement
        );
        userEvent.tab({ shift: true });
        expect(screen.getByText(closeModalElementText)).toBe(
          document.activeElement
        );
        userEvent.tab();
        expect(screen.getByText(firstFocusableElementText)).toBe(
          document.activeElement
        );
      });

      it('Should focus first focusable element on tab press if focus is lost', () => {
        render(<ModalComponent />);
        openModal();
        expect(screen.getByText(firstFocusableElementText)).toBe(
          document.activeElement
        );
        const tempFocusedElement = document.createElement('input');
        document.body.appendChild(tempFocusedElement);
        tempFocusedElement.focus();
        expect(tempFocusedElement).toBe(document.activeElement);
        document.body.removeChild(tempFocusedElement);
        userEvent.tab();
        expect(screen.getByText(firstFocusableElementText)).toBe(
          document.activeElement
        );
      });

      it('Open modal should close after closing animation ends', () => {
        render(<ModalComponent closeOnAnimationEnd={true} />);
        const modalWrapper = screen.getByTestId('micro-modal');
        openModal();
        expectModalIsOpen(modalWrapper);
        closeModal();
        expect(modalWrapper.className).toBe('modal modal-slide is-open');
        expect(modalWrapper.getAttribute('aria-hidden')).toBe('true');
        fireEvent.animationEnd(screen.getByTestId('micro-modal__container'));
        expectModalIsClosed(modalWrapper);
      });

      it('Should be initially open with first element focues', async () => {
        render(<ModalComponent openInitially={true} />);
        const modalWrapper = screen.getByTestId('micro-modal');
        expectModalIsOpen(modalWrapper);

        await waitFor(() => {
          expect(screen.getByText(firstFocusableElementText)).toBe(
            document.activeElement
          );
        });
      });

      it('Should not focus first element when focus disabled', async () => {
        render(<ModalComponent disableFirstElementFocus />);
        const modalWrapper = screen.getByTestId('micro-modal');
        openModal();
        expectModalIsOpen(modalWrapper);

        await waitFor(() => {
          expect(screen.getByText(firstFocusableElementText)).not.toBe(
            document.activeElement
          );
        });
      });

      it('Should be able to apply custom className to modal', () => {
        render(
          <ModalComponent
            modalClassName="custom-class"
            modalOverlayClassName=" my-custom-animation-class and-random-more "
          />
        );
        const modalWrapper = screen.getByTestId('micro-modal');
        expect(modalWrapper.className).toBe('modal modal-slide custom-class');
        const child = modalWrapper.firstElementChild as HTMLDivElement;
        expect(child.className).toBe(
          'modal-overlay my-custom-animation-class and-random-more'
        );
      });
    });
  });
});
