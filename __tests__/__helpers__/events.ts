import { fireEvent } from '@testing-library/react';

function fireKeyDownEvent(element: Element = document.body, event: object) {
  fireEvent.keyDown(element, event);
}

export function fireEscapeKey(element: Element = document.body) {
  fireKeyDownEvent(element, {
    key: 'Escape',
    keyCode: 27,
    which: 27,
  });
}
