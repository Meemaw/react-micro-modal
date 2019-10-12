import { fireEvent, Matcher, RenderResult } from '@testing-library/react';

import {
  closeModalElementText,
  firstFocusableElementText,
  openModalTriggerText,
} from './components';
import { fireDocumentClick, fireEscapeKey, fireShiftTabKey, fireTabKey } from './events';

export function closeModal(getByText: (text: Matcher) => HTMLElement) {
  getByText(closeModalElementText).click();
}

export function openModal(getByText: (text: Matcher) => HTMLElement) {
  getByText(openModalTriggerText).click();
}

export function expectModalIsOpen(modal: HTMLElement) {
  expect(modal.className).toBe('modal modal-slide is-open');
  expect(modal.getAttribute('aria-hidden')).toBe('false');
}

export function expectModalIsClosed(modal: HTMLElement) {
  expect(modal.className).toBe('modal modal-slide');
  expect(modal.getAttribute('aria-hidden')).toBe('true');
}

export function expectFirstElementFocusableAfterModalOpens(
  getByText: (text: Matcher) => HTMLElement,
) {
  openModal(getByText);
  expect(getByText(firstFocusableElementText)).toBe(document.activeElement);
}

export function shouldNotFocusFirstElementOnDisableFocus(renderResult: RenderResult) {
  const { getByTestId, getByText } = renderResult;
  const modalWrapper = getByTestId('micro-modal');
  openModal(getByText);
  expectModalIsOpen(modalWrapper);
  expect(getByText(firstFocusableElementText)).not.toBe(document.activeElement);
}

export function shouldBeInitiallyOpenWithFocusedElement(renderResult: RenderResult) {
  const { getByTestId, getByText } = renderResult;
  const modalWrapper = getByTestId('micro-modal');
  expectModalIsOpen(modalWrapper);
  expect(getByText(firstFocusableElementText)).toBe(document.activeElement);
}

export function shouldCloseAfterClosingAnimationEnds(renderResult: RenderResult) {
  const { getByTestId, getByText } = renderResult;
  const modalWrapper = getByTestId('micro-modal');
  openModal(getByText);
  expectModalIsOpen(modalWrapper);
  closeModal(getByText);
  expect(modalWrapper.className).toBe('modal modal-slide is-open');
  expect(modalWrapper.getAttribute('aria-hidden')).toBe('true');
  fireEvent.animationEnd(getByTestId('micro-modal__container'));
  expectModalIsClosed(modalWrapper);
}

export function shouldBeAbleToApplyCustomClassName(renderResult: RenderResult) {
  const { getByTestId } = renderResult;
  const modalWrapper = getByTestId('micro-modal');
  expect(modalWrapper.className).toBe('modal modal-slide custom-class');
  const child = modalWrapper.firstElementChild as HTMLDivElement;
  expect(child.className).toBe('modal-overlay my-custom-animation-class and-random-more');
}

export function modalShouldApplyCorrectClassNamesOnOpenToggle(renderResult: RenderResult) {
  const { getByTestId, getByText } = renderResult;
  const modalWrapper = getByTestId('micro-modal');
  expectModalIsClosed(modalWrapper);
  openModal(getByText);
  expectModalIsOpen(modalWrapper);
  closeModal(getByText);
  expectModalIsClosed(modalWrapper);
}

export function openModalShouldCloseOnEscapeKeyPress(renderResult: RenderResult) {
  const { getByText, getByTestId } = renderResult;
  openModal(getByText);
  const modalWrapper = getByTestId('micro-modal');
  expectModalIsOpen(modalWrapper);
  fireEscapeKey(modalWrapper);
  expectModalIsClosed(modalWrapper);
}

export function openModalshouldNotCloseOnDocumentClick(renderResult: RenderResult) {
  const { getByTestId, getByText } = renderResult;
  openModal(getByText);
  const modalWrapper = getByTestId('micro-modal');
  expectModalIsOpen(modalWrapper);
  fireDocumentClick(modalWrapper);
  expectModalIsOpen(modalWrapper);
}

export function openModalShouldCloseOnDocumentClick(renderResult: RenderResult) {
  const { getByTestId, getByText } = renderResult;
  openModal(getByText);
  const modalWrapper = getByTestId('micro-modal');
  expectModalIsOpen(modalWrapper);
  fireDocumentClick(modalWrapper);
  expectModalIsClosed(modalWrapper);
}

export function openModalShouldNotCloseOnEscapeKeyPress(renderResult: RenderResult) {
  const { getByText, getByTestId } = renderResult;
  openModal(getByText);
  const modalWrapper = getByTestId('micro-modal');
  expectModalIsOpen(modalWrapper);
  fireEscapeKey(modalWrapper);
  expectModalIsOpen(modalWrapper);
}

export function shouldFocusFirstFocusableElementOnModalOpen(renderResult: RenderResult) {
  expectFirstElementFocusableAfterModalOpens(renderResult.getByText);
}

export function shouldFocusPreviousElementOnShiftAndTabClick(renderResult: RenderResult) {
  const { getByText, getByTestId } = renderResult;
  const modalWrapper = getByTestId('micro-modal');
  expectFirstElementFocusableAfterModalOpens(getByText);
  fireShiftTabKey(modalWrapper);
  expect(getByText(closeModalElementText)).toBe(document.activeElement);
  fireTabKey(modalWrapper);
  expect(getByText(firstFocusableElementText)).toBe(document.activeElement);
}

export function shouldFocusFirstFocusableElementOnTabPressIfFocusIsLost(
  renderResult: RenderResult,
) {
  const { getByText, getByTestId } = renderResult;
  expectFirstElementFocusableAfterModalOpens(getByText);
  const modalWrapper = getByTestId('micro-modal');
  const tempFocusedElement = document.createElement('input');
  document.body.appendChild(tempFocusedElement);
  tempFocusedElement.focus();
  expect(tempFocusedElement).toBe(document.activeElement);
  document.body.removeChild(tempFocusedElement);
  fireTabKey(modalWrapper);
  expect(getByText(firstFocusableElementText)).toBe(document.activeElement);
}
