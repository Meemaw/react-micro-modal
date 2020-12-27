import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { focusFirstNode, handleTabPress } from './focus';
import { ModalPortal, ModalPortalProps } from './Portal';
import { DIALOG_BASE_STYLE, OVERLAY_BASE_STYLE } from './styles';

export type MicroModalProps = Pick<ModalPortalProps, 'parent'> & {
  children: (handleClose: () => void) => React.ReactNode;
  trigger?: (handleOpen: () => void) => React.ReactNode;

  handleClose?: () => void;
  open?: boolean;

  openInitially?: boolean;
  closeOnAnimationEnd?: boolean;
  disableFirstElementFocus?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscapePress?: boolean;

  overrides?: {
    Root?: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >;
    Overlay?: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >;
    Dialog?: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >;
  };
};

const ESCAPE_KEY = 'Escape' as const;
const TAB_KEY = 'Tab' as const;

const getOverlayAnimationName = (ariaHidden: 'false' | 'true') => {
  return ariaHidden === 'false' ? 'modal-fade-in' : 'modal-fade-out';
};

const getDialogAnimationName = (ariaHidden: 'false' | 'true') => {
  return ariaHidden === 'false' ? 'modal-slide-in' : 'modal-slide-out';
};

const openContainerRefStack: React.RefObject<HTMLDivElement>[] = [];

function getLastOpenContainer(): React.RefObject<HTMLDivElement> {
  return openContainerRefStack[openContainerRefStack.length - 1];
}

export const MicroModal = ({
  trigger,
  children,
  open: isOpenParam,
  handleClose: handleCloseParam,
  parent: parentSelector,
  openInitially,
  closeOnAnimationEnd,
  closeOnEscapePress = true,
  closeOnOverlayClick = true,
  disableFirstElementFocus,
  overrides: {
    Root: { style: rootStyleOverrides, ...rootOverrides } = { style: {} },
    Overlay: { style: overlayStyleOverrides, ...overlayOverrides } = {
      style: {},
      className: '',
    },
    Dialog: { style: dialogStyleOverrides, ...dialogOverrides } = {
      style: {},
    },
  } = {},
}: MicroModalProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement>(
    null
  ) as MutableRefObject<HTMLElement | null>;
  const [isModalOpen, setIsModalOpen] = useState(openInitially ?? false);
  const [isClosing, setIsClosing] = useState(false);
  const ariaHidden = isModalOpen && !isClosing ? 'false' : 'true';
  const isControlled = useMemo(() => isOpenParam !== undefined, [isOpenParam]);
  const isMounted = useRef(false);

  const open = useCallback(() => {
    setIsModalOpen(true);
    setIsClosing(false);
  }, [setIsModalOpen, setIsClosing]);

  const close = useCallback(() => {
    setIsModalOpen(false);
    setIsClosing(false);
  }, [setIsModalOpen, setIsClosing]);

  const closeOrStartAnimating = useCallback(() => {
    if (closeOnAnimationEnd) {
      setIsClosing(true);
    } else {
      close();
    }
  }, [close, closeOnAnimationEnd]);

  const handleClose = useCallback(() => {
    if (isControlled) {
      if (handleCloseParam) {
        handleCloseParam();
      } else if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(
          '[react-micro-modal]: cannot close modal -- handleClose prop is required in controlled mode'
        );
      }
    } else {
      closeOrStartAnimating();
    }
  }, [isControlled, handleCloseParam, closeOrStartAnimating]);

  const onKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (dialogRef === getLastOpenContainer()) {
        if (event.key === ESCAPE_KEY && closeOnEscapePress) {
          event.stopPropagation();
          handleClose();
        }
        if (event.key === TAB_KEY && dialogRef.current) {
          handleTabPress(dialogRef.current, event);
        }
      }
    },
    [handleClose]
  );

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (
        event.target &&
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        handleClose();
        event.preventDefault();
      }
    },
    [handleClose]
  );

  // Controlled component
  useEffect(() => {
    if (isMounted.current) {
      if (isOpenParam === true) {
        open();
      } else if (isOpenParam === false) {
        closeOrStartAnimating();
      }
    } else {
      isMounted.current = true;
    }
  }, [isOpenParam]);

  // Animate
  useEffect(() => {
    const containerElement = dialogRef.current;
    if (isClosing && containerElement) {
      containerElement.addEventListener('animationend', function handler() {
        close();
        containerElement.removeEventListener('animationend', handler, false);
      });
    }
  }, [isClosing]);

  // Stack & focus
  useEffect(() => {
    if (isModalOpen) {
      lastActiveElement.current = document.activeElement as HTMLElement;
      openContainerRefStack.push(dialogRef);
      document.addEventListener('keydown', onKeydown);
      if (closeOnOverlayClick) {
        rootRef.current?.addEventListener('click', onClick);
      }

      if (!disableFirstElementFocus && dialogRef.current) {
        focusFirstNode(dialogRef.current);
      }
    } else {
      document.removeEventListener('keydown', onKeydown);
      if (closeOnOverlayClick) {
        rootRef.current?.removeEventListener('click', onClick);
      }
      openContainerRefStack.pop();
      if (lastActiveElement.current) {
        lastActiveElement.current.focus();
        lastActiveElement.current = null;
      }
    }
  }, [isModalOpen]);

  return (
    <>
      {trigger !== undefined && trigger(open)}
      <ModalPortal parent={parentSelector}>
        <div
          ref={rootRef}
          aria-hidden={ariaHidden}
          style={{
            display: isModalOpen ? 'block' : 'none',
            ...rootStyleOverrides,
          }}
          {...rootOverrides}
        >
          <div
            style={{
              ...OVERLAY_BASE_STYLE,
              animation: `${getOverlayAnimationName(
                ariaHidden
              )} 0.3s cubic-bezier(0, 0, 0.2, 1)`,
              ...overlayStyleOverrides,
            }}
            {...overlayOverrides}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              style={{
                ...DIALOG_BASE_STYLE,
                animation: `${getDialogAnimationName(
                  ariaHidden
                )} 0.3s cubic-bezier(0, 0, 0.2, 1)`,
                ...dialogStyleOverrides,
              }}
              {...dialogOverrides}
            >
              {isModalOpen ? children(handleClose) : null}
            </div>
          </div>
        </div>
      </ModalPortal>
    </>
  );
};
