import React from 'react';
import {
  fireEvent,
  Matcher,
  render,
  RenderResult
} from 'react-testing-library';

import Modal from '../src/react-micro-modal';
import {
  closeModalElementText,
  ControlledTestModal,
  firstFocusableElementText,
  openModalTriggerText,
  UncontrolledTestModal
} from './__helpers__/components';
import {
  fireDocumentClick,
  fireEscapeKey,
  fireShiftTabKey,
  fireTabKey
} from './__helpers__/events';

const MODAL_FIXTURES = [
  { description: 'Uncontrolled modal', ModalComponent: UncontrolledTestModal },
  { description: 'Controlled modal', ModalComponent: ControlledTestModal }
];

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

  MODAL_FIXTURES.forEach(({ description, ModalComponent }) => {
    describe(description, () => {
      it('Should apply correct classnames and attributes on modal toggle', () => {
        modalShouldApplyCorrectClassNamesOnOpenToggle(
          render(<ModalComponent />)
        );
      });

      it('Open modal should close on escape key press', () => {
        openModalShouldCloseOnEscapeKeyPress(render(<ModalComponent />));
      });

      it('Open modal should close on document click', () => {
        openModalShouldCloseOnDocumentClick(render(<ModalComponent />));
      });

      it('Open modal should not close on escape key press', () => {
        openModalShouldNotCloseOnEscapeKeyPress(
          render(<ModalComponent closeOnEscapeClick={false} />)
        );
      });

      it('Open modal should not close on document click', () => {
        openModalshouldNotCloseOnDocumentClick(
          render(<ModalComponent closeOnOverlayClick={false} />)
        );
      });

      it('Should focus first focusable element on open', () => {
        shouldFocusFirstFocusableElementOnModalOpen(render(<ModalComponent />));
      });

      it('Should focus previous element on shift+tab click', () => {
        shouldFocusPreviousElementOnShiftAndTabClick(
          render(<ModalComponent />)
        );
      });

      it('Should focus first focusable element on tab press if focus is lost', () => {
        shouldFocusFirstFocusableElementOnTabPressIfFocusIsLost(
          render(<ModalComponent />)
        );
      });

      it('Open modal should close after closing animation ends', () => {
        shouldCloseAfterClosingAnimationEnds(
          render(<ModalComponent closeOnAnimationEnd={true} />)
        );
      });

      it('Should be able to apply custom className to modal', () => {
        shouldBeAbleToApplyCustomClassName(
          render(
            <ModalComponent
              modalClassName="custom-class"
              modalOverlayClassName=" my-custom-animation-class and-random-more "
            />
          )
        );
      });
    });
  });

  describe('Controlled modal', () => {
    it('Should be initially open on open prop passed', () => {
      const { getByTestId } = render(
        <ControlledTestModal initiallyOpen={true} />
      );
      const modalWrapper = getByTestId('micro-modal');
      expectModalIsOpen(modalWrapper);
    });
  });
});

function shouldCloseAfterClosingAnimationEnds(renderResult: RenderResult) {
  const { getByTestId, getByText } = renderResult;
  let modalWrapper = getByTestId('micro-modal');
  openModal(getByText);
  expectModalIsOpen(modalWrapper);
  closeModal(getByText);

  expect(modalWrapper.className).toBe('modal modal-slide is-open');

  fireEvent.animationEnd(getByTestId('micro-modal__container'));
  expectModalIsClosed(modalWrapper);
}

function shouldBeAbleToApplyCustomClassName(renderResult: RenderResult) {
  const { getByTestId } = renderResult;
  let modalWrapper = getByTestId('micro-modal');
  expect(modalWrapper.className).toBe('modal modal-slide custom-class');
  const child = modalWrapper.firstElementChild as HTMLDivElement;
  expect(child.className).toBe(
    'modal-overlay my-custom-animation-class and-random-more'
  );
}

function modalShouldApplyCorrectClassNamesOnOpenToggle(
  renderResult: RenderResult
) {
  const { getByTestId, getByText } = renderResult;
  let modalWrapper = getByTestId('micro-modal');
  expectModalIsClosed(modalWrapper);
  openModal(getByText);
  expectModalIsOpen(modalWrapper);
  closeModal(getByText);
  expectModalIsClosed(modalWrapper);
}

function openModalShouldCloseOnEscapeKeyPress(renderResult: RenderResult) {
  const { getByText, getByTestId } = renderResult;
  openModal(getByText);
  let modalWrapper = getByTestId('micro-modal');
  expectModalIsOpen(modalWrapper);
  fireEscapeKey(modalWrapper);
  expectModalIsClosed(modalWrapper);
}

function openModalshouldNotCloseOnDocumentClick(renderResult: RenderResult) {
  const { getByTestId, getByText } = renderResult;
  openModal(getByText);
  let modalWrapper = getByTestId('micro-modal');
  expectModalIsOpen(modalWrapper);
  fireDocumentClick(modalWrapper);
  expectModalIsOpen(modalWrapper);
}

function openModalShouldCloseOnDocumentClick(renderResult: RenderResult) {
  const { getByTestId, getByText } = renderResult;
  openModal(getByText);
  let modalWrapper = getByTestId('micro-modal');
  expectModalIsOpen(modalWrapper);
  fireDocumentClick(modalWrapper);
  expectModalIsClosed(modalWrapper);
}

function openModalShouldNotCloseOnEscapeKeyPress(renderResult: RenderResult) {
  const { getByText, getByTestId } = renderResult;
  openModal(getByText);
  let modalWrapper = getByTestId('micro-modal');
  expectModalIsOpen(modalWrapper);
  fireEscapeKey(modalWrapper);
  expectModalIsOpen(modalWrapper);
}

function shouldFocusFirstFocusableElementOnModalOpen(
  renderResult: RenderResult
) {
  expectFirstElementFocusableAfterModalOpens(renderResult.getByText);
}

function shouldFocusPreviousElementOnShiftAndTabClick(
  renderResult: RenderResult
) {
  const { getByText, getByTestId } = renderResult;
  let modalWrapper = getByTestId('micro-modal');
  expectFirstElementFocusableAfterModalOpens(getByText);
  fireShiftTabKey(modalWrapper);
  expect(getByText(closeModalElementText)).toBe(document.activeElement);
  fireTabKey(modalWrapper);
  expect(getByText(firstFocusableElementText)).toBe(document.activeElement);
}

function shouldFocusFirstFocusableElementOnTabPressIfFocusIsLost(
  renderResult: RenderResult
) {
  const { getByText, getByTestId } = renderResult;
  expectFirstElementFocusableAfterModalOpens(getByText);
  let modalWrapper = getByTestId('micro-modal');
  let tempFocusedElement = document.createElement('input');
  document.body.appendChild(tempFocusedElement);
  tempFocusedElement.focus();
  expect(tempFocusedElement).toBe(document.activeElement);
  document.body.removeChild(tempFocusedElement);
  fireTabKey(modalWrapper);
  expect(getByText(firstFocusableElementText)).toBe(document.activeElement);
}

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

function closeModal(getByText: (text: Matcher) => HTMLElement) {
  getByText(closeModalElementText).click();
}

function openModal(getByText: (text: Matcher) => HTMLElement) {
  getByText(openModalTriggerText).click();
}
