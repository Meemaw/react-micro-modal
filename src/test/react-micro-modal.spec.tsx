/* eslint-disable jest/valid-title */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import MicroModal from '../index';
import { PORTAL_CLASS_NAME } from '../styles';

import {
  UncontrolledTestModal,
  ControlledTestModal,
  firstFocusableElementText,
  closeModalElementText,
  openModalTriggerText,
} from './__helpers__/components';
import { fireEscapeKey } from './__helpers__/events';

const CONTROLLED_FIXTURE = {
  description: 'Controlled modal',
  ModalComponent: ControlledTestModal,
};

const MODAL_FIXTURES = [
  { description: 'Uncontrolled modal', ModalComponent: UncontrolledTestModal },
  CONTROLLED_FIXTURE,
];

const getPortalRoots = () => {
  return document.body.querySelectorAll(`div.${PORTAL_CLASS_NAME}`);
};

const portalOverlay = (portalRoot: Element) => {
  return portalRoot.querySelector('div > div');
};

describe('Micro modal', () => {
  describe('Nested modal', () => {
    it('Should open and close nested modals on triggers', () => {
      render(
        <MicroModal
          trigger={(handleOpen) => (
            <button type="button" onClick={handleOpen}>
              Open modal
            </button>
          )}
        >
          {(handleClose) => (
            <MicroModal
              trigger={(handleOpen) => (
                <div>
                  <button onClick={handleOpen} type="button">
                    Open nested modal
                  </button>
                  <button onClick={handleClose} type="button">
                    Close modal
                  </button>
                </div>
              )}
            >
              {(nestedModalHandleClose) => (
                <button onClick={nestedModalHandleClose} type="button">
                  Close nested modal
                </button>
              )}
            </MicroModal>
          )}
        </MicroModal>
      );

      expect(getPortalRoots()[0].firstElementChild).toHaveAttribute(
        'aria-hidden',
        'true'
      );

      userEvent.click(screen.getByText('Open modal'));

      expect(getPortalRoots()[0].firstElementChild).toHaveAttribute(
        'aria-hidden',
        'false'
      );

      expect(getPortalRoots()[1].firstElementChild).toHaveAttribute(
        'aria-hidden',
        'true'
      );

      userEvent.click(screen.getByText('Open nested modal'));

      expect(getPortalRoots()[1].firstElementChild).toHaveAttribute(
        'aria-hidden',
        'false'
      );

      userEvent.click(screen.getByText('Close nested modal'));

      expect(getPortalRoots()[1].firstElementChild).toHaveAttribute(
        'aria-hidden',
        'true'
      );

      expect(screen.queryByText('Cloes nested modal')).toBeNull();
      userEvent.click(screen.getByText('Close modal'));

      expect(getPortalRoots()[1]).toBeUndefined();

      expect(screen.queryByText('Close modal')).toBeNull();

      expect(getPortalRoots()[0].firstElementChild).toHaveAttribute(
        'aria-hidden',
        'true'
      );
    });
  });

  describe(CONTROLLED_FIXTURE.description, () => {
    it('Warns user when no handleClose prop in controlled mode', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => null);
      render(<CONTROLLED_FIXTURE.ModalComponent handleClose={undefined} />);
      userEvent.click(screen.getByText(openModalTriggerText));
      fireEscapeKey(document.body);

      expect(warn).toHaveBeenCalledWith(
        '[react-micro-modal]: cannot close modal -- handleClose prop is required in controlled mode'
      );
      warn.mockRestore();
    });
  });

  MODAL_FIXTURES.forEach(({ description, ModalComponent }) => {
    describe(description, () => {
      it('Open modal should close on escape key press', () => {
        render(<ModalComponent />);
        userEvent.click(screen.getByText(openModalTriggerText));
        expect(screen.getByText('Modal content')).toBeInTheDocument();
        fireEscapeKey(document.body);
        expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
      });

      it('Open modal should close on overlay click', () => {
        render(<ModalComponent />);
        userEvent.click(screen.getByText(openModalTriggerText));
        expect(screen.getByText('Modal content')).toBeInTheDocument();
        userEvent.click(portalOverlay(getPortalRoots()[0]) as HTMLDivElement);
        expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
      });

      it('Open modal should not close on escape key press', () => {
        render(<ModalComponent closeOnEscapePress={false} />);
        userEvent.click(screen.getByText(openModalTriggerText));
        expect(screen.getByText('Modal content')).toBeInTheDocument();
        fireEscapeKey(document.body);
        expect(screen.getByText('Modal content')).toBeInTheDocument();
      });

      it('Open modal should not close on overlay click', () => {
        render(<ModalComponent closeOnOverlayClick={false} />);
        userEvent.click(screen.getByText(openModalTriggerText));
        expect(screen.getByText('Modal content')).toBeInTheDocument();
        userEvent.click(portalOverlay(getPortalRoots()[0]) as HTMLDivElement);
        expect(screen.queryByText('Modal content')).toBeInTheDocument();
      });

      it('Should focus first focusable element on open', () => {
        render(<ModalComponent />);
        userEvent.click(screen.getByText(openModalTriggerText));
        expect(screen.getByText(firstFocusableElementText)).toBe(
          document.activeElement
        );
      });

      it('Should focus previous element on shift+tab click', () => {
        render(<ModalComponent />);
        userEvent.click(screen.getByText(openModalTriggerText));
        expect(screen.getByText(firstFocusableElementText)).toBe(
          document.activeElement
        );
        userEvent.tab({ shift: true });
        expect(screen.getByText(closeModalElementText)).toBe(
          document.activeElement
        );
        userEvent.tab();
        expect(screen.getByText(firstFocusableElementText)).toBe(
          document.activeElement
        );
      });

      it('Should focus first focusable element on tab press if focus is lost', () => {
        render(<ModalComponent />);
        userEvent.click(screen.getByText(openModalTriggerText));
        expect(screen.getByText(firstFocusableElementText)).toBe(
          document.activeElement
        );
        const tempFocusedElement = document.createElement('input');
        document.body.appendChild(tempFocusedElement);
        tempFocusedElement.focus();
        expect(tempFocusedElement).toBe(document.activeElement);
        document.body.removeChild(tempFocusedElement);
        userEvent.tab();
        expect(screen.getByText(firstFocusableElementText)).toBe(
          document.activeElement
        );
      });

      it('Open modal should close after closing animation ends', () => {
        render(<ModalComponent closeOnAnimationEnd />);
        userEvent.click(screen.getByText(openModalTriggerText));
        expect(screen.getByText('Modal content')).toBeInTheDocument();

        expect(getPortalRoots()[0].firstElementChild).toHaveAttribute(
          'aria-hidden',
          'false'
        );

        userEvent.click(screen.getByText(closeModalElementText));

        expect(getPortalRoots()[0].firstElementChild).toHaveAttribute(
          'aria-hidden',
          'true'
        );

        expect(screen.getByText('Modal content')).toBeInTheDocument();

        act(() => {
          fireEvent.animationEnd(screen.getByRole('dialog', { hidden: true }));
        });

        expect(getPortalRoots()[0].firstElementChild).toHaveAttribute(
          'aria-hidden',
          'true'
        );
        expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
      });

      it('Should be initially open with first element focues', async () => {
        render(<ModalComponent openInitially />);
        expect(screen.getByText('Modal content')).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByText(firstFocusableElementText)).toBe(
            document.activeElement
          );
        });
      });

      it('Should not focus first element when focus disabled', async () => {
        render(<ModalComponent disableFirstElementFocus />);
        userEvent.click(screen.getByText(openModalTriggerText));
        expect(screen.getByText('Modal content')).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByText(firstFocusableElementText)).not.toBe(
            document.activeElement
          );
        });
      });

      it('Should be able to override element props', () => {
        render(
          <ModalComponent
            overrides={{
              Root: {
                className: 'root-class-name',
                style: { zIndex: 150 },
              },
              Overlay: {
                className: 'overlay-class-name',
                style: { zIndex: 150 },
              },
              Dialog: {
                className: 'dialog-class-name',
                style: { zIndex: 150 },
              },
            }}
          />
        );

        const portalElement = getPortalRoots()[0];
        const rootElement = portalElement.querySelector('div.root-class-name');
        const overlayElement = portalElement.querySelector(
          'div.overlay-class-name'
        );
        const dialogElement = portalElement.querySelector(
          'div.dialog-class-name'
        );

        expect(rootElement).toBeInTheDocument();
        expect(rootElement).toHaveStyle({ zIndex: 150 });
        expect(overlayElement).toBeInTheDocument();
        expect(overlayElement).toHaveStyle({ zIndex: 150 });
        expect(dialogElement).toBeInTheDocument();
        expect(dialogElement).toHaveStyle({ zIndex: 150 });
      });
    });
  });
});
