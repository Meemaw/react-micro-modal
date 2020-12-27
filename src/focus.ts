const FOCUSABLE_SELETORS = [
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
  '[tabindex]:not([tabindex^="-"])',
] as const;

export const getFocusableNodes = (element: HTMLElement) => {
  return Object.values(
    element.querySelectorAll<HTMLElement>(
      (FOCUSABLE_SELETORS as unknown) as string
    )
  );
};

export const focusFirstNode = (element: HTMLElement) => {
  const focusableNodes = getFocusableNodes(element);
  let focusedElement: HTMLElement | undefined;
  if (focusableNodes.length) {
    [focusedElement] = focusableNodes;
    focusedElement.focus();
  }
  return focusedElement;
};

export const handleTabPress = (element: HTMLElement, event: KeyboardEvent) => {
  const focusableNodes = getFocusableNodes(element);
  if (!focusableNodes.length) {
    return undefined;
  }

  const focusedElement = focusableNodes[0];

  if (!element.contains(document.activeElement)) {
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
