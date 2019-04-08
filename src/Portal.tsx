import React from 'react';
import ReactDOM from 'react-dom';

export interface PortalBaseProps {
  parentSelector?: () => HTMLElement;
  id?: string;
}

interface Props extends PortalBaseProps {
  children: React.ReactNode;
}

function portalNode(id?: string): HTMLDivElement {
  const el = document.createElement('div');
  el.className = id ? `${id}-portal` : `micro-modal-portal-${portalIndex++}`;
  return el;
}

export let portalIndex = 1;

class ModalPortal extends React.Component<Props> {
  node = portalNode(this.props.id);

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
