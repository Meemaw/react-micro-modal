import { CSSProperties } from 'react';

const BASE_CLASS_NAME = 'react-micro-modal';
export const PORTAL_CLASS_NAME = `${BASE_CLASS_NAME}--portal`;

export const OVERLAY_BASE_STYLE: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const DIALOG_BASE_STYLE: CSSProperties = {
  backgroundColor: '#fff',
  padding: '30px',
  maxWidth: '500px',
  maxHeight: '100vh',
  borderRadius: '4px',
  overflowY: 'auto',
  boxSizing: 'border-box',
};
