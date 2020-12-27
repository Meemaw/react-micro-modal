import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { PORTAL_CLASS_NAME } from './styles';

export type ModalPortalProps = {
  children: React.ReactNode;
  parent?: () => HTMLElement;
};

const createPortalRoot = () => {
  const root = document.createElement('div');
  root.className = PORTAL_CLASS_NAME;
  return root;
};

export const ModalPortal = ({ parent, children }: ModalPortalProps) => {
  const node = useMemo(() => createPortalRoot(), []);

  const getParent = () => {
    return parent?.() ?? document.body;
  };

  useEffect(() => {
    getParent().appendChild(node);
    return () => {
      getParent().removeChild(node);
    };
  }, []);

  return createPortal(children, node);
};
