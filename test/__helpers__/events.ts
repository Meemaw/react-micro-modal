import { fireEvent } from 'react-testing-library';

/*
function fireTabKey(element: Element = document.body) {
  fireKeyDownEvent(element, {
    key: 'Tab',
    keyCode: 9,
    which: 9
  });
}
*/

export function fireDocumentClick(element: Element = document.body) {
  fireEvent.click(element);
}

export function fireEscapeKey(element: Element = document.body) {
  fireKeyDownEvent(element, {
    key: 'Escape',
    keyCode: 27,
    which: 27
  });
}

function fireKeyDownEvent(element: Element = document.body, event: object) {
  fireEvent.keyDown(element, event);
}
