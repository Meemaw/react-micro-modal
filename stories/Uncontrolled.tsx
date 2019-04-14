import { storiesOf } from '@storybook/react';
import React from 'react';

import MicroModal, { BaseProps } from '../src';

storiesOf('react-micro-modal', module)
  .add('Default', () => <StoryModal />)
  .add('Initially open', () => <StoryModal openInitially={true} />)
  .add('Animate modal closing', () => <StoryModal closeOnAnimationEnd={true} />)
  .add("Doesn't close on escape click", () => (
    <StoryModal closeOnEscapePress={false} />
  ))
  .add("Doesn't close on document click", () => (
    <StoryModal closeOnOverlayClick={false} />
  ))
  .add('Disable first element focus on modal open', () => (
    <StoryModal disableFirstElementFocus={true} />
  ))
  .add('Custom styling through className', () => (
    <StoryModal
      modalOverlayClassName="background--red"
      modalClassName="story--modal"
    />
  ))
  .add('Custom styling through jsx', () => (
    <StoryModal containerStyles={{ background: 'red', maxWidth: '100%' }} />
  ))
  .add('Custom animations', () => (
    <StoryModal
      closeOnAnimationEnd={true}
      modalOverlayClassName="custom-animation"
    />
  ));

const StoryModal = (props: BaseProps) => (
  <MicroModal
    trigger={handleOpen => (
      <div className="trigger-wrapper">
        <div>
          <button onClick={handleOpen}>Open modal</button>
        </div>
      </div>
    )}
    {...props}
  >
    {handleClose => <StoryModalContent handleClose={handleClose} />}
  </MicroModal>
);

const StoryModalContent = ({ handleClose }: { handleClose: () => void }) => {
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
