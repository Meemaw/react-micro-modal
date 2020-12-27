# react-micro-modal

_Accessible, lightweight and configurable modal component with a11y-enabled inspired by [Micromodal.js](https://github.com/Ghosh/micromodal)._

## Installation

---

- NPM: `npm install react-micro-modal`
- Yarn: `yarn add react-micro-modal`

---

## General usage

react-micro-modal can be used as a controlled or uncontrolled component. If state of modal being closed/open is not important to other components, uncontrolled API is prefered (less code and containd state) using the `trigger` prop [example](https://github.com/Meemaw/react-micro-modal/#example). If the modal has to be controlled from elsewhere, controlled API is required using the `open` prop. You should not mix the two, as it may cause the modal to not function properly.

```js
import MicroModal from 'react-micro-modal';

<MicroModal
  /*
    Boolean describing if the modal should be shown or not. (REQUIRED if used as a controlled component)
  */
  open={false}
  /*
    Function that is passed to the children to close the modal. (if used as a controlled component)
  */
  handleClose={() => props.setModalOpen(false)}
  /*
    Function that recieves a handleOpen function and should render a modal trigger. (REQUIRED if used as a uncontrolled component)
  */
  trigger={(handleOpen) => <div onClick={handleOpen}>Open!</div>}
  /*
    Boolean describing if the modal should be open on first render. (if used as a uncontrolled component, else just use open)
  */
  openInitially={false}
  /*
    Function that recieves a handleClose function and should render the modal content.
  */
  children={(handleClose) => <button onClick={handleClose}>Close!</button>}
  /*
    Boolean indicating whether to close modal on escape keypress
  */
  closeOnEscapePress={true}
  /*
    Boolean indicating whether to close modal on document click (outside of modal content)
  */
  closeOnOverlayClick={false}
  /*
    Boolean indicating whether focus should be given to first element in modal after it got open
  */
  disableFirstElementFocus={false}
  /*
    Boolean indicating whether an animation should be used when closing the modal. Animation has to be applied as the modal is waiting for the "animationend" DOM event. Basic animation is provided and can be imported from "react-micro-modal/dist/index.css".
  */
  closeOnAnimationEnd={false}
  /*
    Overrides props for base elements. Accepting any props a native 'div' elements accepts
  */
  overrides={{
    Root: {
      className: 'root-class-name',
      style: { zIndex: 150 },
    },
    Overlay: {
      className: 'overlay-class-name',
      style: { zIndex: 150 },
    },
    Dialog: {
      className: 'dialog-class-name',
      style: { zIndex: 150 },
    },
  }}
/>;
```
