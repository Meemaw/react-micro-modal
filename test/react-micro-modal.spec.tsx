import React from 'react';
import { render, act } from '@testing-library/react';

import Modal from '../src/react-micro-modal';
import { UncontrolledTestModal, ControlledTestModal } from './__helpers__/components';
import {
  expectModalIsClosed,
  expectModalIsOpen,
  openModalShouldCloseOnEscapeKeyPress,
  openModalshouldNotCloseOnDocumentClick,
  shouldFocusFirstFocusableElementOnTabPressIfFocusIsLost,
  shouldBeAbleToApplyCustomClassName,
  shouldNotFocusFirstElementOnDisableFocus,
  shouldBeInitiallyOpenWithFocusedElement,
  openModalShouldCloseOnDocumentClick,
  shouldFocusFirstFocusableElementOnModalOpen,
  shouldCloseAfterClosingAnimationEnds,
  shouldFocusPreviousElementOnShiftAndTabClick,
  openModalShouldNotCloseOnEscapeKeyPress,
  modalShouldApplyCorrectClassNamesOnOpenToggle,
} from './__helpers__/assertions';

const MODAL_FIXTURES = [
  { description: 'Uncontrolled modal', ModalComponent: UncontrolledTestModal },
  { description: 'Controlled modal', ModalComponent: ControlledTestModal },
];

describe('Micro modal', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  describe('Nested modal', () => {
    it('Should open and close nested modals on triggers', () => {
      const { getByTestId, getByText } = render(
        <Modal trigger={handleOpen => <div onClick={handleOpen}>Open modal</div>}>
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
              {handleClose => <div onClick={handleClose}>Close nested modal</div>}
            </Modal>
          )}
        </Modal>,
      );
      const modalWrapper = getByTestId('micro-modal');

      expectModalIsClosed(modalWrapper);
      act(() => {
        getByText('Open modal').click();
      });

      const nestedModalWrapper = getByTestId('nested-micro-modal');
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

  MODAL_FIXTURES.forEach(({ description, ModalComponent }) => {
    describe(description, () => {
      it('Should apply correct classnames and attributes on modal toggle', () => {
        modalShouldApplyCorrectClassNamesOnOpenToggle(render(<ModalComponent />));
      });

      it('Open modal should close on escape key press', () => {
        openModalShouldCloseOnEscapeKeyPress(render(<ModalComponent />));
      });

      it('Open modal should close on document click', () => {
        openModalShouldCloseOnDocumentClick(render(<ModalComponent />));
      });

      it('Open modal should not close on escape key press', () => {
        openModalShouldNotCloseOnEscapeKeyPress(
          render(<ModalComponent closeOnEscapePress={false} />),
        );
      });

      it('Open modal should not close on document click', () => {
        openModalshouldNotCloseOnDocumentClick(
          render(<ModalComponent closeOnOverlayClick={false} />),
        );
      });

      it('Should focus first focusable element on open', () => {
        shouldFocusFirstFocusableElementOnModalOpen(render(<ModalComponent />));
      });

      it('Should focus previous element on shift+tab click', () => {
        shouldFocusPreviousElementOnShiftAndTabClick(render(<ModalComponent />));
      });

      it('Should focus first focusable element on tab press if focus is lost', () => {
        shouldFocusFirstFocusableElementOnTabPressIfFocusIsLost(render(<ModalComponent />));
      });

      it('Open modal should close after closing animation ends', () => {
        shouldCloseAfterClosingAnimationEnds(render(<ModalComponent closeOnAnimationEnd={true} />));
      });

      it('Should be initially open with first element focues', () => {
        shouldBeInitiallyOpenWithFocusedElement(render(<ModalComponent openInitially={true} />));
      });

      it('Should not focus first element when focus disabled', () => {
        shouldNotFocusFirstElementOnDisableFocus(
          render(<ModalComponent disableFirstElementFocus />),
        );
      });

      it('Should be able to apply custom className to modal', () => {
        shouldBeAbleToApplyCustomClassName(
          render(
            <ModalComponent
              modalClassName="custom-class"
              modalOverlayClassName=" my-custom-animation-class and-random-more "
            />,
          ),
        );
      });
    });
  });
});
