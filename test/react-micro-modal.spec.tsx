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
      const { getByTestId, getByText, unmount } = render(
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

      expect(document.body.querySelector('.nested-micro-modal-portal')).toBeTruthy();

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

      // we clean nested modal after ourselves
      expect(document.body.querySelector('.nested-micro-modal-portal')).toBeNull();

      unmount();
    });
  });

  MODAL_FIXTURES.forEach(({ description, ModalComponent }) => {
    describe(description, () => {
      it('Should apply correct classnames and attributes on modal toggle', () => {
        const renderResult = render(<ModalComponent />);
        modalShouldApplyCorrectClassNamesOnOpenToggle(renderResult);
        renderResult.unmount();
      });

      it('Open modal should close on escape key press', () => {
        const renderResult = render(<ModalComponent />);
        openModalShouldCloseOnEscapeKeyPress(renderResult);
        renderResult.unmount();
      });

      it('Open modal should close on document click', () => {
        const renderResult = render(<ModalComponent />);
        openModalShouldCloseOnDocumentClick(renderResult);
        renderResult.unmount();
      });

      it('Open modal should not close on escape key press', () => {
        const renderResult = render(<ModalComponent closeOnEscapePress={false} />);
        openModalShouldNotCloseOnEscapeKeyPress(renderResult);
        renderResult.unmount();
      });

      it('Open modal should not close on document click', () => {
        const renderResult = render(<ModalComponent closeOnOverlayClick={false} />);
        openModalshouldNotCloseOnDocumentClick(renderResult);
        renderResult.unmount();
      });

      it('Should focus first focusable element on open', () => {
        const renderResult = render(<ModalComponent />);
        shouldFocusFirstFocusableElementOnModalOpen(renderResult);
        renderResult.unmount();
      });

      it('Should focus previous element on shift+tab click', () => {
        const renderResult = render(<ModalComponent />);
        shouldFocusPreviousElementOnShiftAndTabClick(renderResult);
        renderResult.unmount();
      });

      it('Should focus first focusable element on tab press if focus is lost', () => {
        const renderResult = render(<ModalComponent />);
        shouldFocusFirstFocusableElementOnTabPressIfFocusIsLost(renderResult);
        renderResult.unmount();
      });

      it('Open modal should close after closing animation ends', () => {
        const renderResult = render(<ModalComponent closeOnAnimationEnd={true} />);
        shouldCloseAfterClosingAnimationEnds(renderResult);
        renderResult.unmount();
      });

      it('Should be initially open with first element focues', () => {
        const renderResult = render(<ModalComponent openInitially={true} />);
        shouldBeInitiallyOpenWithFocusedElement(renderResult);
        renderResult.unmount();
      });

      it('Should not focus first element when focus disabled', () => {
        const renderResult = render(<ModalComponent disableFirstElementFocus />);
        shouldNotFocusFirstElementOnDisableFocus(renderResult);
        renderResult.unmount();
      });

      it('Should be able to apply custom className to modal', () => {
        const renderResult = render(
          <ModalComponent
            modalClassName="custom-class"
            modalOverlayClassName=" my-custom-animation-class and-random-more "
          />,
        );
        shouldBeAbleToApplyCustomClassName(renderResult);
        renderResult.unmount();
      });
    });
  });
});
