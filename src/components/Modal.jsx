import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import s from './Modal.module.css';

function Modal({active, setActive, children, setEditing}) {
  const closeModalButton = React.useRef(null);

  const handleFocus = () => {
    closeModalButton.current.focus();
  }

  const closeModal = () => {
    setActive(false);
    setEditing(false);
  }

  const closeByButton = (evt) => {
    if (evt.key === "Escape" || evt.key === "Esc") {
      closeModal();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", closeByButton, false);
    return () => {
      document.removeEventListener("keydown", closeByButton, false);
    }
  }, []);

  return (
    <div
      className={active ? `${s.overlay} ${s.active}` : `${s.overlay}`}
      onClick={closeModal}
    >
      <div
        className={active ? `${s.modal} ${s.active}` : `${s.modal}`}
        onClick={evt => evt.stopPropagation()}
      >
        <span onFocus={handleFocus} tabIndex="0" aria-hidden="true"></span>
        <button
          className={s.close_modal_button}
          onClick={closeModal}
          ref={closeModalButton}
          style={{cursor: "pointer", fontSize: "24px"}}
        >
          Х
        </button>
          {children}
        <span onFocus={handleFocus} tabIndex="0" aria-hidden="true"></span>
      </div>
    </div>
  )
}

Modal.propTypes = {
  active: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
}

export default Modal
