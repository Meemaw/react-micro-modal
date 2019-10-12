import { fireEvent } from '@testing-library/react';

function fireKeyDownEvent(element: Element = document.body, event: object) {
  fireEvent.keyDown(element, event);
}

export function fireTabKey(element: Element = document.body, shiftKey = false) {
  fireKeyDownEvent(element, {
    key: 'Tab',
    code: 'Tab',
    keyCode: 9,
    which: 9,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey,
  });
}

export function fireShiftTabKey(element: Element = document.body) {
  fireTabKey(element, true);
}

export function fireDocumentClick(element: Element = document.body) {
  fireEvent.click(element);
}

export function fireEscapeKey(element: Element = document.body) {
  fireKeyDownEvent(element, {
    key: 'Escape',
    keyCode: 27,
    which: 27,
  });
}
