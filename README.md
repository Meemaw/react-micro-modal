# react-micro-modal

[![npm](https://img.shields.io/npm/v/react-micro-modal.svg)](https://www.npmjs.com/package/react-micro-modal) [![Build Status](https://travis-ci.org/Meemaw/react-micro-modal.svg?branch=master)](https://travis-ci.org/Meemaw/react-micro-modal) [![Coverage Status](https://coveralls.io/repos/github/Meemaw/react-micro-modal/badge.svg?branch=master)](https://coveralls.io/github/Meemaw/react-micro-modal?branch=master) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

_Accessible, lightweight and configurable modal component with a11y-enabled._

### [Release notes](https://github.com/Meemaw/react-micro-modal/releases)

---

- NPM: `npm install react-micro-modal`
- Yarn: `yarn add react-micro-modal`

---

## Example

Here is a minimal uncontrolled modal example in 3 lines of code.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import ReactMicroModal from 'react-micro-modal';

const App = () => {
  return (
    <ReactMicroModal
      trigger={handleOpen => <div onClick={handleOpen}>Click me!</div>}
    >
      {handleClose => <button onClick={handleClose}>Close modal</button>}
    </ReactMicroModal>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```
