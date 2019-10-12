import { addDecorator, configure } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);

configure(() => require('../stories/index'), module);
