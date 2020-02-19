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

const ESCAPE_KEY: 'Escape' = 'Escape';
const TAB_KEY: 'Tab' = 'Tab';

const openContainerRefStack: React.RefObject<HTMLDivElement>[] = [];

function getLastOpenContainer(): React.RefObject<HTMLDivElement> {
  return openContainerRefStack[openContainerRefStack.length - 1];
}

class MicroModal extends React.PureComponent<Props, State> {
  readonly state: State = getInitialState(this.props);

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

  componentDidMount() {
    if (this.props.openInitially) {
      this.addEventListeners();
      if (!this.props.disableFirstElementFocus) {
        this.focusFirstNode();
      }
    }
  }

  isControlled = this.props.open !== undefined;
  modalRef = React.createRef<HTMLDivElement>();
  containerRef = React.createRef<HTMLDivElement>();
  lastElement?: HTMLElement;

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.open !== undefined && props.open !== state.open) {
      return { open: true, isClosing: !props.open };
    }
    return null;
  }

  componentDidUpdate(prevProps: Props) {
    if ((this.isControlled && prevProps.open !== this.state.open) || this.state.isClosing) {
      if (this.state.isClosing) {
        if (this.props.closeOnAnimationEnd) {
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
    if (this.props.closeOnOverlayClick) {
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
    if (this.isControlled) {
      if (this.props.handleClose) {
        this.props.handleClose();
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn('[React-micro-modal]: cannot close modal - handleClose prop is not passed.');
      }
    } else if (this.props.closeOnAnimationEnd) {
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

  private focusFirstNode() {
    if (this.props.disableFirstElementFocus) {
      return;
    }

    focusFirstNode(this.containerRef);
  }

  private removeEventListeners = () => {
    document.removeEventListener('keydown', this.onKeydown);
    if (this.props.closeOnOverlayClick) {
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
      if (event.key === ESCAPE_KEY && this.props.closeOnEscapePress) {
        event.stopPropagation();
        this.handleClose();
      }
      if (event.key === TAB_KEY) {
        handleTabPress(this.containerRef, event);
      }
    }
  };

  private renderContent = (
    open: boolean,
    isClosing: boolean,
    renderChildren: (handleClose: () => void) => React.ReactNode,
    overlayStyle: React.CSSProperties,
    parentSelector: (() => HTMLElement) | undefined,
  ): React.ReactNode => {
    const ariaHidden = open && !isClosing ? 'false' : 'true';
    const baseModalClassName = open ? `modal modal-slide is-open` : `modal modal-slide`;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const customModalClassName = this.props.modalClassName!.trim();

    const modalClassName = customModalClassName
      ? `${baseModalClassName} ${customModalClassName}`
      : baseModalClassName;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const customModalOverlayClassName = this.props.modalOverlayClassName!.trim();

    const baseModalOverlayClassName = this.props.modalOverlayClassName
      ? `modal-overlay ${customModalOverlayClassName}`
      : 'modal-overlay';

    return (
      <ModalPortal parentSelector={parentSelector} id={this.props.id}>
        <div
          className={modalClassName}
          aria-hidden={ariaHidden}
          ref={this.modalRef}
          id={this.props.id}
          data-testid={this.props.id || 'micro-modal'}
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
              style={{ ...CONTAINER_BASE_STYLE, ...this.props.containerStyles }}
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
    const { trigger, children, modalOverlayStyles, parentSelector } = this.props;
    const { open, isClosing } = this.state;

    return (
      <React.Fragment>
        {this.renderContent(
          open,
          isClosing,
          children,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          modalOverlayStyles!,
          parentSelector,
        )}
        {trigger !== undefined && trigger(this.handleOpen)}
      </React.Fragment>
    );
  }
}

export default MicroModal;
