import { RefObject } from 'react';

export const getFocusableNodes = (
  ref: RefObject<HTMLDivElement>
): HTMLElement[] => {
  return !ref.current
    ? []
    : Object.values(
        ref.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELETORS)
      );
};

export const focusFirstNode = (
  ref: RefObject<HTMLDivElement>
): HTMLElement | undefined => {
  const focusableNodes = getFocusableNodes(ref);
  let focusedElement: HTMLElement | undefined;
  if (focusableNodes.length) {
    focusedElement = focusableNodes[0];
    focusedElement.focus();
  }
  return focusedElement;
};

export const handleTabPress = (
  ref: RefObject<HTMLDivElement>,
  event: KeyboardEvent
): HTMLElement | undefined => {
  const focusableNodes = getFocusableNodes(ref);
  if (!focusableNodes.length) {
    return undefined;
  }

  const focusedElement = focusableNodes[0];

  if (ref.current && !ref.current.contains(document.activeElement)) {
    focusedElement.focus();
    event.preventDefault();
  } else {
    const focusedItemIndex = focusableNodes.indexOf(
      document.activeElement as HTMLElement
    );
    if (event.shiftKey && focusedItemIndex === 0) {
      focusableNodes[focusableNodes.length - 1].focus();
      event.preventDefault();
    }
    if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
      focusedElement.focus();
      event.preventDefault();
    }
    return focusableNodes[focusedItemIndex];
  }
  return focusedElement;
};

const FOCUSABLE_SELETORS = ([
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])'
] as unknown) as string;
