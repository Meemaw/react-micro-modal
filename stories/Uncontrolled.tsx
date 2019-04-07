import { storiesOf } from '@storybook/react';
import React from 'react';

import { StoryUncontrolledModal } from './components';

storiesOf('react-micro-modal', module)
  .add('Default', () => <StoryUncontrolledModal />)
  .add('Modal closing animation', () => (
    <StoryUncontrolledModal closeOnAnimationEnd={true} />
  ))
  .add("Doesn't close on escape click", () => (
    <StoryUncontrolledModal closeOnEscapeClick={false} />
  ))
  .add("Doesn't close on document click", () => (
    <StoryUncontrolledModal closeOnOverlayClick={false} />
  ))
  .add('Disable focusing first element on afterOpen', () => (
    <StoryUncontrolledModal disableFocus={true} />
  ))
  .add('Custom className', () => (
    <StoryUncontrolledModal
      modalOverlayClassName="background--red"
      modalClassName="story--modal"
    />
  ))
  .add('Custom animations', () => (
    <StoryUncontrolledModal
      closeOnAnimationEnd={true}
      modalOverlayClassName="custom-animation"
    />
  ));
