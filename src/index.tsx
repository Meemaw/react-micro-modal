import React from 'react';

import { focusFirstNode, handleTabPress } from './focus';
import ModalPortal, { PortalBaseProps } from './Portal';
import { CONTAINER_BASE_STYLE, OVERLAY_BASE_STYLE } from './styles';

type State = { open: boolean; isClosing: boolean };

function getInitialState(props: Props): State {
  if (props.trigger !== undefined && props.open !== undefined) {
    console.warn(
      '[React-micro-modal]: both trigger and open prop provided. React-micro-modal wont function properly. Please use trigger for uncontrolled component and open for controlled component.'
    );
  }
  return {
    open: props.open === undefined ? false : props.open,
    isClosing: false
  };
}

type OptionalProps = {
  closeOnEscapeClick?: boolean;
  closeOnOverlayClick?: boolean;
  modalOverlayStyle?: React.CSSProperties;
  disableFocus?: boolean;
  closeOnAnimationEnd?: boolean;
};

interface Props extends PortalBaseProps, OptionalProps {
  children: (handleClose: () => void) => React.ReactNode;
  trigger?: (handleOpen: () => void) => React.ReactNode;
  open?: boolean;
  handleClose?: () => void;
  id?: string;
}

const ESCAPE_KEY_CODE = 27;
const TAB_KEY_CODE = 9;

let openContainerRefStack: React.RefObject<HTMLDivElement>[] = [];

function getLastOpenContainer(): React.RefObject<HTMLDivElement> {
  return openContainerRefStack[openContainerRefStack.length - 1];
}

class MicroModal extends React.PureComponent<Props, State> {
  readonly state: State = getInitialState(this.props);

  static defaultProps: OptionalProps = {
    disableFocus: false,
    modalOverlayStyle: {},
    closeOnEscapeClick: true,
    closeOnOverlayClick: true,
    closeOnAnimationEnd: false
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

  closeOnAnimationEnd = (handleClose: () => void) => {
    const containerElement = this.containerRef.current!;

    containerElement.addEventListener('animationend', function handler() {
      handleClose();
      containerElement.removeEventListener('animationend', handler, false);
    });
  };

  handleOpen = () => {
    openContainerRefStack.push(this.containerRef);
    this.setState({ open: true }, this.onAfterOpen);
  };

  onAfterOpen = () => {
    this.addEventListeners();
    this.focusFirstNode();
  };

  addEventListeners = () => {
    document.addEventListener('keydown', this.onKeydown);
    if (this.props.closeOnOverlayClick) {
      this.modalRef.current!.addEventListener('click', this.onClick);
    }
  };

  startClosingUncontrolled = () => {
    this.setState({ isClosing: true }, () => {
      this.closeOnAnimationEnd(this._handleCloseAnimationEnd);
    });
  };

  handleClose = () => {
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

  _handleCloseAnimationEnd = () => {
    this.setState({ open: false, isClosing: false }, this.onAfterClose);
  };

  onAfterClose = () => {
    openContainerRefStack.pop();
    if (openContainerRefStack.length > 0) {
      focusFirstNode(getLastOpenContainer());
    }
    this.removeEventListeners();
    this.focusedElement = undefined;
  };

  focusFirstNode() {
    if (this.props.disableFocus) {
      return;
    }

    this.focusedElement = focusFirstNode(this.containerRef);
  }

  removeEventListeners = () => {
    document.removeEventListener('keydown', this.onKeydown);
    if (this.props.closeOnOverlayClick) {
      this.modalRef.current!.removeEventListener('click', this.onClick);
    }
  };

  onClick = (event: MouseEvent) => {
    if (
      event.target &&
      this.containerRef.current &&
      !this.containerRef.current.contains(event.target as Node)
    ) {
      this.handleClose();
      event.preventDefault();
    }
  };

  onKeydown = (event: KeyboardEvent) => {
    if (this.containerRef === getLastOpenContainer()) {
      if (event.keyCode === ESCAPE_KEY_CODE && this.props.closeOnEscapeClick) {
        this.handleClose();
      }

      if (event.keyCode === TAB_KEY_CODE) {
        this.focusedElement = handleTabPress(this.containerRef, event);
      }
    }
  };

  getOverlayZIndex(): number {
    return openContainerRefStack.findIndex(r => r === this.containerRef);
  }

  renderContent = (
    open: boolean,
    isClosing: boolean,
    renderChildren: (handleClose: () => void) => React.ReactNode,
    overlayStyle: React.CSSProperties,
    parentSelector: (() => HTMLElement) | undefined
  ) => {
    const ariaHidden = open && !isClosing ? 'false' : 'true';
    const className = open ? 'modal modal-slide is-open' : 'modal modal-slide';
    const { zIndex, ...restOverlayStyle } = overlayStyle;

    return (
      <ModalPortal parentSelector={parentSelector}>
        <div
          className={className}
          aria-hidden={ariaHidden}
          ref={this.modalRef}
          id={this.props.id}
          data-testid={this.props.id || 'micro-modal'}
          style={{ display: open ? 'block' : 'none' }}
        >
          <div
            className="modal-overlay"
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
