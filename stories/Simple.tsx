import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import MicroModal from '../src/index';

storiesOf('Micro modal', module)
  .add('Simple modal - controlled', () => (
    <div>
      <ControlledModalExample />
    </div>
  ))
  .add('Simple modal - uncontrolled', () => (
    <MicroModal
      closeOnAnimationEnd={true}
      trigger={handleOpen => (
        <div>
          <input placeholder="TODO" />
          <div onClick={handleOpen}>Open modal!</div>
        </div>
      )}
    >
      {handleClose => (
        <ModalContent
          buttonText="Close uncontrolled modal"
          handleClose={handleClose}
        />
      )}
    </MicroModal>
  ))
  .add('Nested modal', () => (
    <MicroModal
      closeOnAnimationEnd={true}
      trigger={handleOpen => (
        <div id="modal-parent" onClick={handleOpen}>
          Open modal!
        </div>
      )}
    >
      {handleClose => (
        <MicroModal
          closeOnAnimationEnd={true}
          trigger={handleOpen => (
            <div>
              <div onClick={handleOpen}>Open nested modal!</div>
              <a href="www.google.com">href</a>
              <button onClick={handleClose}>Close modal</button>
            </div>
          )}
        >
          {handleClose => (
            <MicroModal
              closeOnAnimationEnd={true}
              trigger={handleOpen => (
                <div>
                  <div onClick={handleOpen}>Open nested modal 2</div>
                  <a href="www.google.com">nested href</a>
                  <button onClick={handleClose}>Close nested modal</button>
                </div>
              )}
            >
              {handleClose => (
                <ModalContent
                  buttonText="Close nested modal"
                  handleClose={handleClose}
                />
              )}
            </MicroModal>
          )}
        </MicroModal>
      )}
    </MicroModal>
  ));

const ModalContent = ({
  handleClose,
  buttonText
}: {
  handleClose: () => void;
  buttonText: string;
}) => (
  <div>
    <p>Modal content</p>
    <a href="www.google.com" target="_blank">
      Random link
    </a>
    <input placeholder="Write text..." />
    <button onClick={handleClose}>{`${buttonText}-1`}</button>
    <button onClick={handleClose}>{`${buttonText}-1`}</button>
  </div>
);

const ControlledModalExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <input placeholder="TODO" />
      <button onClick={_ => setOpen(true)}>Open modal</button>
      <MicroModal
        open={open}
        handleClose={() => setOpen(false)}
        closeOnAnimationEnd={true}
      >
        {_ => (
          <ModalContent
            handleClose={() => setOpen(false)}
            buttonText="Close controlled modal"
          />
        )}
      </MicroModal>
    </div>
  );
};
