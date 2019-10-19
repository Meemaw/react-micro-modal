import './index.css';
import React, { useState } from 'react';

import MicroModal, { BaseProps } from '../src';

export default {
  title: 'Uncontrolled Micro Modal',
};

export const Default = () => <StoryModal />;

export const InitiallyOpen = () => <StoryModal openInitially={true} />;
InitiallyOpen.story = {
  name: 'Initially open',
};

export const ModalClosingAnimation = () => <StoryModal closeOnAnimationEnd={true} />;
ModalClosingAnimation.story = {
  name: 'Closing animation',
};

export const NotClosingOnEscape = () => <StoryModal closeOnEscapePress={false} />;
NotClosingOnEscape.story = {
  name: 'Not closing on escape key press',
};

export const NotClosingOnDocumentClick = () => <StoryModal closeOnOverlayClick={false} />;
NotClosingOnDocumentClick.story = {
  name: 'Not closing on document click',
};

export const FirstElementFocusDisabled = () => <StoryModal disableFirstElementFocus={true} />;
FirstElementFocusDisabled.story = {
  name: 'Not focusing first element on modal open',
};

export const CustomStylingThroughClassname = () => (
  <StoryModal modalOverlayClassName="background--red" modalClassName="story--modal" />
);
CustomStylingThroughClassname.story = {
  name: 'Custom styling through className',
};

export const CustomStylingThroughJsx = () => (
  <StoryModal containerStyles={{ background: 'red', maxWidth: '100%' }} />
);
CustomStylingThroughJsx.story = {
  name: 'Custom styling through JSX',
};

export const CustomAnimations = () => (
  <StoryModal closeOnAnimationEnd={true} modalOverlayClassName="custom-animation" />
);
CustomAnimations.story = {
  name: 'Custom animations',
};

export const AsToast = () => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <button
        onClick={() => {
          setOpen(true);
          setTimeout(() => setOpen(false), 2000);
        }}
      >
        Show toast!
      </button>
      <MicroModal
        open={open}
        modalOverlayClassName="custom-animation"
        closeOnAnimationEnd={true}
        modalOverlayStyles={{
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
        }}
        containerStyles={{
          marginTop: '16px',
          marginRight: '16px',
        }}
      >
        {_ => {
          return <div>I'm a toast, closing in 2 seconds!</div>;
        }}
      </MicroModal>
    </React.Fragment>
  );
};
AsToast.story = {
  name: 'As toast',
};

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
          Try hitting the <code>tab</code> or <code>shift+tab</code> key* and notice how the focus
          stays within the modal itself. To close modal hit the <code>esc</code> button, click on
          the overlay or just click the close button.
        </p>
      </section>

      <footer className="modal--footer">
        <div>
          <MicroModal
            trigger={handleOpen => (
              <button style={{ backgroundColor: '#00449e', color: '#fff' }} onClick={handleOpen}>
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
