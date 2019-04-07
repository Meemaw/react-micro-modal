import React from 'react';
import ReactDOM from 'react-dom';

export interface PortalBaseProps {
  parentSelector?: () => HTMLElement;
}

interface Props extends PortalBaseProps {
  children: React.ReactNode;
}

function portalNode(): HTMLDivElement {
  const el = document.createElement('div');
  el.className = `modal-portal-${portalIndex++}`;
  return el;
}

export let portalIndex = 1;

class ModalPortal extends React.Component<Props> {
  node = portalNode();

  componentDidMount() {
    this.getParent().appendChild(this.node);
  }

  componentWillUnmount() {
    this.getParent().removeChild(this.node);
  }

  getParent = (): HTMLElement => {
    return this.props.parentSelector
      ? this.props.parentSelector()
      : document.body;
  };

  render() {
    return ReactDOM.createPortal(this.props.children, this.node);
  }
}

export default ModalPortal;
