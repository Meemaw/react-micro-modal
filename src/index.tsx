/* eslint-disable no-underscore-dangle */
import React from 'react';

import { focusFirstNode, handleTabPress } from './focus';
import ModalPortal, { PortalBaseProps } from './Portal';
import { CONTAINER_BASE_STYLE, OVERLAY_BASE_STYLE } from './styles';

type State = {
  isClosing: boolean;
  open: boolean;
};

function getInitialState(props: Props): State {
  return {
    isClosing: false,
    open: props.openInitially || false,
  };
}

type OptionalProps = {
  closeOnEscapePress?: boolean;
  closeOnOverlayClick?: boolean;
  modalOverlayStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  disableFirstElementFocus?: boolean;
  closeOnAnimationEnd?: boolean;
  modalClassName?: string;
  modalOverlayClassName?: string;
  openInitially?: boolean;
};

export interface BaseProps extends PortalBaseProps, OptionalProps {
  trigger?: (handleOpen: () => void) => React.ReactNode;
  open?: boolean;
  handleClose?: () => void;
}

interface Props extends BaseProps {
  children: (handleClose: () => void) => React.ReactNode;
}

const ESCAPE_KEY = 'Escape' as const;
const TAB_KEY = 'Tab' as const;

const openContainerRefStack: React.RefObject<HTMLDivElement>[] = [];

function getLastOpenContainer(): React.RefObject<HTMLDivElement> {
  return openContainerRefStack[openContainerRefStack.length - 1];
}

class MicroModal extends React.PureComponent<Props, State> {
  // eslint-disable-next-line react/state-in-constructor
  readonly state: State = getInitialState(this.props);

  // eslint-disable-next-line react/static-property-placement
  static defaultProps: OptionalProps = {
    disableFirstElementFocus: false,
    modalOverlayStyles: {},
    containerStyles: {},
    closeOnEscapePress: true,
    closeOnOverlayClick: true,
    closeOnAnimationEnd: false,
    modalOverlayClassName: '',
    modalClassName: '',
    openInitially: false,
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

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.open !== undefined && props.open !== state.open) {
      return { open: true, isClosing: !props.open };
    }
    return null;
  }

  componentDidUpdate(prevProps: Props) {
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
          '[React-micro-modal]: cannot close modal - handleClose prop is not passed.'
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

  private focusFirstNode() {
    const { disableFirstElementFocus } = this.props;
    if (disableFirstElementFocus) {
      return;
    }

    focusFirstNode(this.containerRef);
  }

  private renderContent = (
    open: boolean,
    isClosing: boolean,
    renderChildren: (handleClose: () => void) => React.ReactNode,
    overlayStyle: React.CSSProperties,
    parentSelector: (() => HTMLElement) | undefined
  ): React.ReactNode => {
    const ariaHidden = open && !isClosing ? 'false' : 'true';
    const baseModalClassName = open
      ? `modal modal-slide is-open`
      : `modal modal-slide`;

    const {
      modalClassName,
      modalOverlayClassName,
      id,
      containerStyles,
    } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const customModalClassName = modalClassName!.trim();

    const actualModalClassName = customModalClassName
      ? `${baseModalClassName} ${customModalClassName}`
      : baseModalClassName;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const customModalOverlayClassName = modalOverlayClassName!.trim();

    const baseModalOverlayClassName = modalOverlayClassName
      ? `modal-overlay ${customModalOverlayClassName}`
      : 'modal-overlay';

    return (
      <ModalPortal parentSelector={parentSelector} id={id}>
        <div
          className={actualModalClassName}
          aria-hidden={ariaHidden}
          ref={this.modalRef}
          id={id}
          data-testid={id || 'micro-modal'}
          style={{ display: open ? 'block' : 'none' }}
        >
          <div
            className={baseModalOverlayClassName}
            style={{
              ...OVERLAY_BASE_STYLE,
              ...overlayStyle,
            }}
          >
            <div
              className="modal-container"
              style={{ ...CONTAINER_BASE_STYLE, ...containerStyles }}
              role="dialog"
              aria-modal="true"
              ref={this.containerRef}
              data-testid="micro-modal__container"
            >
              {open ? renderChildren(this.handleClose) : null}
            </div>
          </div>
        </div>
      </ModalPortal>
    );
  };

  render() {
    const {
      trigger,
      children,
      modalOverlayStyles,
      parentSelector,
    } = this.props;
    const { open, isClosing } = this.state;

    return (
      <>
        {this.renderContent(
          open,
          isClosing,
          children,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          modalOverlayStyles!,
          parentSelector
        )}
        {trigger !== undefined && trigger(this.handleOpen)}
      </>
    );
  }
}

export default MicroModal;
