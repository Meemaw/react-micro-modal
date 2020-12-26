/* eslint-disable jsx-a11y/control-has-associated-label */
import './index.css';
import React, { useState } from 'react';
import type { Meta } from '@storybook/react';

import { MicroModal, MicroModalProps } from '../src';

export default {
  title: 'Uncontrolled Micro Modal',
} as Meta;

type StoryModalProps = Omit<MicroModalProps, 'children'>;

export const Default = () => <StoryModal />;

export const InitiallyOpen = () => <StoryModal openInitially />;
InitiallyOpen.story = {
  name: 'Initially open',
};

export const ModalClosingAnimation = () => <StoryModal closeOnAnimationEnd />;
ModalClosingAnimation.story = {
  name: 'Closing animation',
};

export const NotClosingOnEscape = () => (
  <StoryModal closeOnEscapePress={false} />
);
NotClosingOnEscape.story = {
  name: 'Not closing on escape key press',
};

export const NotClosingOnDocumentClick = () => (
  <StoryModal closeOnOverlayClick={false} />
);
NotClosingOnDocumentClick.story = {
  name: 'Not closing on document click',
};

export const FirstElementFocusDisabled = () => (
  <StoryModal disableFirstElementFocus />
);
FirstElementFocusDisabled.story = {
  name: 'Not focusing first element on modal open',
};

export const CustomStylingThroughClassname = () => (
  <StoryModal
    overrides={{
      Overlay: {
        className: 'background--red',
      },
      Dialog: {
        className: 'story--modal',
      },
    }}
  />
);
CustomStylingThroughClassname.story = {
  name: 'Custom styling through className',
};

export const CustomStylingThroughJsx = () => (
  <StoryModal
    overrides={{
      Dialog: {
        style: {
          background: 'red',
          maxWidth: '100%',
        },
      },
    }}
  />
);
CustomStylingThroughJsx.story = {
  name: 'Custom styling through JSX',
};

export const CustomAnimations = () => (
  <StoryModal
    closeOnAnimationEnd
    overrides={{
      Root: { className: 'modal-slide' },
      Overlay: { className: 'modal-overlay custom-animation' },
      Dialog: { className: 'modal-container' },
    }}
  />
);
CustomAnimations.story = {
  name: 'Custom animations',
};

export const WithCustomZIndex = () => (
  <>
    <MicroModal
      trigger={(handleOpen) => (
        <div className="trigger-wrapper">
          <div>
            <button onClick={handleOpen} type="button">
              Open modal
            </button>
          </div>
        </div>
      )}
      overrides={{ Overlay: { style: { zIndex: 160 } } }}
    >
      {(handleClose) => (
        <StoryModalContent
          handleClose={handleClose}
          overrides={{ Overlay: { style: { zIndex: 160 } } }}
        />
      )}
    </MicroModal>
    <input
      placeholder="I should be under the overlay"
      style={{ zIndex: 150, position: 'absolute' }}
    />
  </>
);
WithCustomZIndex.story = {
  name: 'With custom z-index',
};

export const AsToast = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setTimeout(() => setOpen(false), 2000);
        }}
      >
        Show toast!
      </button>
      <MicroModal
        open={open}
        closeOnAnimationEnd
        overrides={{
          Overlay: {
            className: 'custom-animation',
            style: {
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            },
          },
          Dialog: {
            style: {
              marginTop: '16px',
              marginRight: '16px',
            },
          },
        }}
      >
        {(_) => {
          return <div>I&apos;m a toast, closing in 2 seconds!</div>;
        }}
      </MicroModal>
    </>
  );
};
AsToast.story = {
  name: 'As toast',
};

const StoryModal = (props: StoryModalProps) => (
  <MicroModal
    trigger={(handleOpen) => (
      <div className="trigger-wrapper">
        <div>
          <button type="button" onClick={handleOpen}>
            Open modal
          </button>
        </div>
      </div>
    )}
    {...props}
  >
    {(handleClose) => <StoryModalContent handleClose={handleClose} />}
  </MicroModal>
);

type StoryModalContentProps = StoryModalProps & {
  handleClose: () => void;
};

const StoryModalContent = ({
  handleClose,
  ...rest
}: StoryModalContentProps) => {
  return (
    <>
      <header className="modal--header">
        <h2 className="heading">react-micro-modal 🔥</h2>
        <button
          type="button"
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
            trigger={(handleOpen) => (
              <button
                type="button"
                style={{ backgroundColor: '#00449e', color: '#fff' }}
                onClick={handleOpen}
              >
                Continue
              </button>
            )}
            {...rest}
          >
            {(nestedHandleClose) => (
              <div>
                <p>I&apos;m a nested modal</p>
                <button type="button" onClick={nestedHandleClose}>
                  Close
                </button>
              </div>
            )}
          </MicroModal>
          <button type="button" onClick={handleClose}>
            Close
          </button>
        </div>

        <a
          href="https://github.com/Meemaw/react-micro-modal/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github" />
        </a>
      </footer>
    </>
  );
};
