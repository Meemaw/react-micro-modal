import React from 'react';

import { focusFirstNode, handleTabPress } from './focus';
import ModalPortal, { PortalBaseProps } from './Portal';
import { CONTAINER_BASE_STYLE, OVERLAY_BASE_STYLE } from './styles';

const initialState = Object.freeze({
  open: false,
  isClosing: false
});

type State = typeof initialState;

type OptionalProps = {
  closeOnEscapeClick?: boolean;
  closeOnOverlayClick?: boolean;
  modalOverlayStyle?: React.CSSProperties;
  disableFocus?: boolean;
  closeOnAnimationEnd?: boolean;
  modalClassName?: string;
  modalOverlayClassName?: string;
};

interface Props extends PortalBaseProps, OptionalProps {
  children: (handleClose: () => void) => React.ReactNode;
  trigger?: (handleOpen: () => void) => React.ReactNode;
  open?: boolean;
  handleClose?: () => void;
  id?: string;
}

const ESCAPE_KEY: 'Escape' = 'Escape';
const TAB_KEY: 'Tab' = 'Tab';

let openContainerRefStack: React.RefObject<HTMLDivElement>[] = [];

function getLastOpenContainer(): React.RefObject<HTMLDivElement> {
  return openContainerRefStack[openContainerRefStack.length - 1];
}

class MicroModal extends React.PureComponent<Props, State> {
  readonly state: State = initialState;

  static defaultProps: OptionalProps = {
    disableFocus: false,
    modalOverlayStyle: {},
    closeOnEscapeClick: true,
    closeOnOverlayClick: true,
    closeOnAnimationEnd: false,
    modalOverlayClassName: '',
    modalClassName: ''
  };

  isControlled = this.props.open !== undefined;
  modalRef = React.createRef<HTMLDivElement>();
  containerRef = React.createRef<HTMLDivElement>();
  focusedElement?: HTMLElement;

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.open !== undefined && props.open !== state.open) {
      return { open: true, isClosing: !props.open };
    }
    return null;
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (this.isControlled && prevProps.open !== this.state.open) ||
      this.state.isClosing
    ) {
      if (this.state.isClosing) {
        if (this.props.closeOnAnimationEnd) {
          this.closeOnAnimationEnd(this._handleCloseAnimationEnd);
        } else {
          this._handleCloseAnimationEnd();
        }
      } else {
        openContainerRefStack.push(this.containerRef);
        this.onAfterOpen();
      }
    }
  }

  private closeOnAnimationEnd = (handleClose: () => void): void => {
    const containerElement = this.containerRef.current!;

    containerElement.addEventListener('animationend', function handler() {
      handleClose();
      containerElement.removeEventListener('animationend', handler, false);
    });
  };

  private handleOpen = (): void => {
    openContainerRefStack.push(this.containerRef);
    this.setState({ open: true }, this.onAfterOpen);
  };

  private onAfterOpen = (): void => {
    this.addEventListeners();
    this.focusFirstNode();
  };

  private addEventListeners = (): void => {
    document.addEventListener('keydown', this.onKeydown);
    if (this.props.closeOnOverlayClick) {
      this.modalRef.current!.addEventListener('click', this.onClick);
    }
  };

  private startClosingUncontrolled = (): void => {
    this.setState({ isClosing: true }, () => {
      this.closeOnAnimationEnd(this._handleCloseAnimationEnd);
    });
  };

  handleClose = (): void => {
    if (this.isControlled) {
      if (this.props.handleClose) {
        this.props.handleClose();
      } else {
        console.warn(
          '[React-micro-modal]: cannot close modal - handleClose prop is not passed.'
        );
      }
    } else if (this.props.closeOnAnimationEnd) {
      this.startClosingUncontrolled();
    } else {
      this._handleCloseAnimationEnd();
    }
  };

  private _handleCloseAnimationEnd = (): void => {
    this.setState({ open: false, isClosing: false }, this.onAfterClose);
  };

  private onAfterClose = (): void => {
    openContainerRefStack.pop();
    if (openContainerRefStack.length > 0) {
      focusFirstNode(getLastOpenContainer());
    }
    this.removeEventListeners();
    this.focusedElement = undefined;
  };

  private focusFirstNode(): void {
    if (this.props.disableFocus) {
      return;
    }

    this.focusedElement = focusFirstNode(this.containerRef);
  }

  private removeEventListeners = (): void => {
    document.removeEventListener('keydown', this.onKeydown);
    if (this.props.closeOnOverlayClick) {
      this.modalRef.current!.removeEventListener('click', this.onClick);
    }
  };

  private onClick = (event: MouseEvent): void => {
    if (
      event.target &&
      this.containerRef.current &&
      !this.containerRef.current.contains(event.target as Node)
    ) {
      this.handleClose();
      event.preventDefault();
    }
  };

  private onKeydown = (event: KeyboardEvent): void => {
    if (this.containerRef === getLastOpenContainer()) {
      if (event.key === ESCAPE_KEY && this.props.closeOnEscapeClick) {
        this.handleClose();
      }
      if (event.key === TAB_KEY) {
        this.focusedElement = handleTabPress(this.containerRef, event);
      }
    }
  };

  private getOverlayZIndex(): number {
    return openContainerRefStack.findIndex(r => r === this.containerRef);
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

    const customModalClassName = this.props.modalClassName!.trim();

    const modalClassName = customModalClassName
      ? `${baseModalClassName} ${customModalClassName}`
      : baseModalClassName;

    const customModalOverlayClassName = this.props.modalOverlayClassName!.trim();

    const baseModalOverlayClassName = this.props.modalOverlayClassName
      ? `modal-overlay ${customModalOverlayClassName}`
      : 'modal-overlay';

    const { zIndex, ...restOverlayStyle } = overlayStyle;

    return (
      <ModalPortal parentSelector={parentSelector}>
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
              zIndex: zIndex || this.getOverlayZIndex(),
              ...restOverlayStyle
            }}
          >
            <div
              className="modal-container"
              style={CONTAINER_BASE_STYLE}
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
    const { trigger, children, modalOverlayStyle, parentSelector } = this.props;
    const { open, isClosing } = this.state;

    return (
      <React.Fragment>
        {this.renderContent(
          open,
          isClosing,
          children,
          modalOverlayStyle!,
          parentSelector
        )}
        {trigger !== undefined && trigger(this.handleOpen)}
      </React.Fragment>
    );
  }
}

export default MicroModal;
