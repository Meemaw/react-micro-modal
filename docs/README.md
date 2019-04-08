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
  trigger={handleOpen => <div onClick={handleOpen}>Open!</div>}
  /*
    Boolean describing if the modal should be open on first render. (if used as a uncontrolled component, else just use open)
  */
  openInitially={false}
  /*
    Function that recieves a handleClose function and should render the modal content.
  */
  children={handleClose => <button onClick={handleClose}>Close!</button>}
  /*
    String identifying the micro-modal element
  */
  id="my-micro-modal"
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
    String className to be applied to the modal element
  */
  modalClassName="custom-modal-class"
  /*
    String className to be applied to the modal overlay element
  */
  modalOverlayClassName="custom-modal-class"
  /*
    CSSProperties to be applied to the modal overlay element
  */
  modalOverlayStyles={{ background: 'red' }}
  /*
    CSSProperties to be applied to the modal container element
  */
  containerStyles={{ background: 'red' }}
/>;
```
