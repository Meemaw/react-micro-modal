import { storiesOf } from '@storybook/react';
import React from 'react';

import { StoryUncontrolledModal } from './components';

storiesOf('react-micro-modal', module)
  .add('Default', () => <StoryUncontrolledModal />)
  .add('Initially open', () => <StoryUncontrolledModal openInitially={true} />)
  .add('Animate modal closing', () => (
    <StoryUncontrolledModal closeOnAnimationEnd={true} />
  ))
  .add("Doesn't close on escape click", () => (
    <StoryUncontrolledModal closeOnEscapePress={false} />
  ))
  .add("Doesn't close on document click", () => (
    <StoryUncontrolledModal closeOnOverlayClick={false} />
  ))
  .add('Disable first element focus on modal open', () => (
    <StoryUncontrolledModal disableFirstElementFocus={true} />
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
