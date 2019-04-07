import React from 'react';

import MicroModal from '../src';

type ContentProps = {
  handleClose: () => void;
};

const StoryModalContent = ({ handleClose }: ContentProps) => {
  return (
    <React.Fragment>
      <header className="modal--header">
        <h2 className="heading">react-micro-modal 🔥</h2>
        <button
          onClick={handleClose}
          className="fas fa-times"
          style={{ border: 0, background: 'transparent' }}
        />
      </header>

      <section>
        <p>Acessible react modal component.</p>
        <p>
          Try hitting the <code>tab</code> or <code>shift+tab</code> key* and
          notice how the focus stays within the modal itself. To close modal hit
          the <code>esc</code> button, click on the overlay or just click the
          close button.
        </p>
      </section>

      <footer className="modal--footer">
        <div>
          <MicroModal
            trigger={handleOpen => (
              <button
                style={{ backgroundColor: '#00449e', color: '#fff' }}
                onClick={handleOpen}
              >
                Continue
              </button>
            )}
          >
            {handleClose => (
              <div>
                <p>I'm a nested modal</p>
                <button onClick={handleClose}>Close</button>
              </div>
            )}
          </MicroModal>
          <button onClick={handleClose}>Close</button>
        </div>

        <a href="https://github.com/Meemaw/react-micro-modal/" target="_blank">
          <i className="fab fa-github" />
        </a>
      </footer>
    </React.Fragment>
  );
};

type StoryModalProps = {
  closeOnEscapeClick?: boolean;
  closeOnOverlayClick?: boolean;
  modalOverlayStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  disableFocus?: boolean;
  closeOnAnimationEnd?: boolean;
  modalClassName?: string;
  modalOverlayClassName?: string;
};

const StoryUncontrolledModal = (props: StoryModalProps) => (
  <MicroModal
    trigger={handleOpen => (
      <button role="button" onClick={handleOpen}>
        Open modal
      </button>
    )}
    {...props}
  >
    {handleClose => <StoryModalContent handleClose={handleClose} />}
  </MicroModal>
);

export { StoryModalContent, StoryUncontrolledModal };
