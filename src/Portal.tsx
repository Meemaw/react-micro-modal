import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';

export interface PortalBaseProps {
  parentSelector?: () => HTMLElement;
  id?: string;
}

interface Props extends PortalBaseProps {
  children: React.ReactNode;
}

// eslint-disable-next-line import/no-mutable-exports
export let portalIndex = 1;

function portalNode(id?: string): HTMLDivElement {
  const el = document.createElement('div');
  // eslint-disable-next-line no-plusplus
  el.className = id ? `${id}-portal` : `micro-modal-portal-${portalIndex++}`;
  return el;
}

const ModalPortal: React.FC<Props> = ({ id, parentSelector, children }) => {
  const node = useMemo(() => portalNode(id), [id]);

  const getParent = (): HTMLElement => {
    return parentSelector ? parentSelector() : document.body;
  };

  useEffect(() => {
    getParent().appendChild(node);
    return () => {
      getParent().removeChild(node);
    };
  }, []);

  return ReactDOM.createPortal(children, node);
};

export default ModalPortal;
