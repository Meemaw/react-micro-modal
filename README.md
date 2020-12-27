# react-micro-modal

[![npm](https://img.shields.io/npm/v/react-micro-modal.svg)](https://www.npmjs.com/package/react-micro-modal) [![](https://badgen.net/bundlephobia/minzip/react-micro-modal)](https://bundlephobia.com/result?p=react-micro-modal) ![CI](https://github.com/Meemaw/react-micro-modal/workflows/CI/badge.svg) [![codecov](https://codecov.io/gh/Meemaw/react-micro-modal/branch/master/graph/badge.svg?token=xdrppK2PPf)](https://codecov.io/gh/Meemaw/react-micro-modal) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

_Accessible, lightweight and configurable modal component with a11y-enabled inspired by [Micromodal.js](https://github.com/Ghosh/micromodal)._

### [Release notes](https://github.com/Meemaw/react-micro-modal/releases) | [Documentation](https://github.com/Meemaw/react-micro-modal/tree/master/docs)

---

- NPM: `npm install react-micro-modal`
- Yarn: `yarn add react-micro-modal`

---

## Features

- Micro bundle - 1.9 KB 📦
- a11y friendly 👓
- Supports nested modals
- Focuses on the first focusable element within the modal
- Traps focus inside the modal
- Closes on document click
- Closes on `Escape` keypress
- Usage as controlled or uncontrolled component

## Example

Here is a minimal uncontrolled modal example in 3 lines of code.

```tsx
import React from 'react';
import { render } from 'react-dom';
import MicroModal from 'react-micro-modal';

const App = () => {
  return (
    <MicroModal trigger={(open) => <div onClick={open}>Open!</div>}>
      {(close) => <button onClick={close}>Close!</button>}
    </MicroModal>
  );
};

render(<App />, document.getElementById('root'));
```

## Live Playground

For more examples of micro-modal in action, go to https://meemaw.github.io/react-micro-modal.

OR

To run that demo on your own computer:

- Clone this repository
- `yarn install`
- `yarn storybook`
- Visit http://localhost:9001/
