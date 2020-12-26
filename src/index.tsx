/* eslint-disable no-underscore-dangle */
import React from 'react';

import { focusFirstNode, handleTabPress } from './focus';
import { ModalPortal, ModalPortalProps } from './Portal';
import { DIALOG_BASE_STYLE, OVERLAY_BASE_STYLE } from './styles';

type State = {
  isClosing: boolean;
  open: boolean;
};

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

function getInitialState(props: MicroModalProps): State {
  return {
    isClosing: false,
    open: props.openInitially || false,
  };
}

const ESCAPE_KEY = 'Escape' as const;
const TAB_KEY = 'Tab' as const;

const openContainerRefStack: React.RefObject<HTMLDivElement>[] = [];

function getLastOpenContainer(): React.RefObject<HTMLDivElement> {
  return openContainerRefStack[openContainerRefStack.length - 1];
}

export class MicroModal extends React.PureComponent<MicroModalProps, State> {
  // eslint-disable-next-line react/state-in-constructor
  readonly state: State = getInitialState(this.props);

  // eslint-disable-next-line react/static-property-placement
  static defaultProps: MicroModalProps = {
    disableFirstElementFocus: false,
    closeOnEscapePress: true,
    closeOnOverlayClick: true,
    closeOnAnimationEnd: false,
    openInitially: false,
    children: () => null,
  };

  // eslint-disable-next-line react/destructuring-assignment
  isControlled = this.props.open !== undefined;

  modalRef = React.createRef<HTMLDivElement>();

  containerRef = React.createRef<HTMLDivElement>();

  lastElement?: HTMLElement;

  componentDidMount() {
    const { openInitially, disableFirstElementFocus } = this.props;
    if (openInitially) {
      this.addEventListeners();
      if (!disableFirstElementFocus) {
        setTimeout(() => this.focusFirstNode(), 0);
      }
    }
  }

  static getDerivedStateFromProps(props: MicroModalProps, state: State) {
    if (props.open !== undefined && props.open !== state.open) {
      return { open: true, isClosing: !props.open };
    }
    return null;
  }

  componentDidUpdate(prevProps: MicroModalProps) {
    const { closeOnAnimationEnd } = this.props;
    const { open, isClosing } = this.state;
    if ((this.isControlled && prevProps.open !== open) || isClosing) {
      if (isClosing) {
        if (closeOnAnimationEnd) {
          this.closeOnAnimationEnd(this._handleCloseAnimationEnd);
        } else {
          this._handleCloseAnimationEnd();
        }
      } else {
        this.onAfterOpen();
      }
    }
  }

  private closeOnAnimationEnd = (handleClose: () => void): void => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const containerElement = this.containerRef.current!;

    containerElement.addEventListener('animationend', function handler() {
      handleClose();
      containerElement.removeEventListener('animationend', handler, false);
    });
  };

  private handleOpen = () => {
    this.setState({ open: true }, this.onAfterOpen);
  };

  private onAfterOpen = () => {
    this.lastElement = document.activeElement as HTMLElement;
    openContainerRefStack.push(this.containerRef);
    this.addEventListeners();
    this.focusFirstNode();
  };

  private addEventListeners = () => {
    document.addEventListener('keydown', this.onKeydown);
    const { closeOnOverlayClick } = this.props;
    if (closeOnOverlayClick) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.modalRef.current!.addEventListener('click', this.onClick);
    }
  };

  private startClosingUncontrolled = () => {
    this.setState({ isClosing: true }, () => {
      this.closeOnAnimationEnd(this._handleCloseAnimationEnd);
    });
  };

  handleClose = (): void => {
    const { handleClose, closeOnAnimationEnd } = this.props;

    if (this.isControlled) {
      if (handleClose) {
        handleClose();
      } else if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(
          '[react-micro-modal]: cannot close modal -- handleClose prop is required in controlled mode'
        );
      }
    } else if (closeOnAnimationEnd) {
      this.startClosingUncontrolled();
    } else {
      this._handleCloseAnimationEnd();
    }
  };

  private _handleCloseAnimationEnd = () => {
    this.setState({ open: false, isClosing: false }, this.onAfterClose);
  };

  private onAfterClose = () => {
    this.removeEventListeners();
    openContainerRefStack.pop();
    if (this.lastElement) {
      this.lastElement.focus();
      this.lastElement = undefined;
    }
  };

  private removeEventListeners = () => {
    document.removeEventListener('keydown', this.onKeydown);

    const { closeOnOverlayClick } = this.props;
    if (closeOnOverlayClick) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.modalRef.current!.removeEventListener('click', this.onClick);
    }
  };

  private onClick = (event: MouseEvent) => {
    if (
      event.target &&
      this.containerRef.current &&
      !this.containerRef.current.contains(event.target as Node)
    ) {
      this.handleClose();
      event.preventDefault();
    }
  };

  private onKeydown = (event: KeyboardEvent) => {
    if (this.containerRef === getLastOpenContainer()) {
      const { closeOnEscapePress } = this.props;
      if (event.key === ESCAPE_KEY && closeOnEscapePress) {
        event.stopPropagation();
        this.handleClose();
      }
      if (event.key === TAB_KEY) {
        handleTabPress(this.containerRef, event);
      }
    }
  };

  private getOverlayAnimationName = (ariaHidden: 'false' | 'true') => {
    return ariaHidden === 'false' ? 'modal-fade-in' : 'modal-fade-out';
  };

  private getDialogAnimationName = (ariaHidden: 'false' | 'true') => {
    return ariaHidden === 'false' ? 'modal-slide-in' : 'modal-slide-out';
  };

  private focusFirstNode() {
    const { disableFirstElementFocus } = this.props;
    if (disableFirstElementFocus) {
      return;
    }

    focusFirstNode(this.containerRef);
  }

  private renderContent = (): React.ReactNode => {
    const { open, isClosing } = this.state;
    const ariaHidden = open && !isClosing ? 'false' : 'true';

    const {
      parent,
      children,
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
    } = this.props;

    return (
      <ModalPortal parent={parent}>
        <div
          ref={this.modalRef}
          aria-hidden={ariaHidden}
          style={{ display: open ? 'block' : 'none', ...rootStyleOverrides }}
          {...rootOverrides}
        >
          <div
            style={{
              ...OVERLAY_BASE_STYLE,
              animation: `${this.getOverlayAnimationName(
                ariaHidden
              )} 0.3s cubic-bezier(0, 0, 0.2, 1)`,
              ...overlayStyleOverrides,
            }}
            {...overlayOverrides}
          >
            <div
              ref={this.containerRef}
              role="dialog"
              aria-modal="true"
              style={{
                ...DIALOG_BASE_STYLE,
                animation: `${this.getDialogAnimationName(
                  ariaHidden
                )} 0.3s cubic-bezier(0, 0, 0.2, 1)`,
                ...dialogStyleOverrides,
              }}
              {...dialogOverrides}
            >
              {open ? children(this.handleClose) : null}
            </div>
          </div>
        </div>
      </ModalPortal>
    );
  };

  render() {
    const { trigger } = this.props;
    return (
      <>
        {this.renderContent()}
        {trigger !== undefined && trigger(this.handleOpen)}
      </>
    );
  }
}
