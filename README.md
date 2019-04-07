# react-micro-modal

[![npm](https://img.shields.io/npm/v/react-micro-modal.svg)](https://www.npmjs.com/package/react-micro-modal) [![size](http://img.badgesize.io/https://cdn.jsdelivr.net/npm/react-micro-modal/dist/react-micro-modal.umd.js?compression=gzip)](http://img.badgesize.io/https://cdn.jsdelivr.net/npm/react-micro-modal/dist/react-micro-modal.umd.js?compression=gzip) [![Build Status](https://travis-ci.org/Meemaw/react-micro-modal.svg?branch=master)](https://travis-ci.org/Meemaw/react-micro-modal) [![Coverage Status](https://coveralls.io/repos/github/Meemaw/react-micro-modal/badge.svg?branch=master)](https://coveralls.io/github/Meemaw/react-micro-modal?branch=master) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

_Accessible, lightweight and configurable modal component with a11y-enabled inspired by [Micromodal.js](https://github.com/Ghosh/micromodal)._

### [Release notes](https://github.com/Meemaw/react-micro-modal/releases) | [Documentation](https://github.com/Meemaw/react-micro-modal/tree/master/docs)

---

- NPM: `npm install react-micro-modal`
- Yarn: `yarn add react-micro-modal`

---

## Features

- Micro bundle - 2.38 KB 📦 
- a11y friendly 👓
- Supports nested modals
- Focuses on the first focusable element within the modal
- Traps focus inside the modal
- Closes on document click
- Closes on `Escape` keypress
- Usage as controlled or uncontrolled component


## Example

Here is a minimal uncontrolled modal example in 3 lines of code.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import MicroModal from 'react-micro-modal';

const App = () => {
  return (
    <MicroModal
      trigger={handleOpen => <div onClick={handleOpen}>Open!</div>}
      children={handleClose => <button onClick={handleClose}>Close!</button>}
    />
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

## Live Playground

For more examples of micro-modal in action, go to https://meemaw.github.io/react-micro-modal.

OR

To run that demo on your own computer:

- Clone this repository
- `npm install`
- `npm run storybook`
- Visit http://localhost:9001/
