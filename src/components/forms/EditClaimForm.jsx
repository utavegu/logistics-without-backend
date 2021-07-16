import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import s from './Forms.module.css';


const EditClaimForm = ({editing, setEditing, currentClaim, onUpdate: handleUpdateClaim, setModalActive}) => {

  const [targetClaim, setTargetClaim] = useState(currentClaim)

  const firstInput = useRef(null);
  useEffect(() => {
    if (firstInput.current !== null) firstInput.current.focus();
  }, [handleUpdateClaim])

  useEffect(
    () => {
      setTargetClaim(currentClaim);
    },
    [editing, currentClaim]
  )

  const handleInputChange = ({target}) => {
    setTargetClaim({ ...targetClaim, [target.name]: target.value })
  }

  const handleSubmit = evt => {
    evt.preventDefault()
    handleUpdateClaim(targetClaim)
  }

  const handleCancel = () => {
    setModalActive(false);
    setEditing(false);
  }

  
  return (
    <form className={s.claim_form} onSubmit={handleSubmit}>

      <p>
        <label htmlFor="firmName">Название фирмы клиента</label>
        <input
          type="text"
          id="firmName"
          name="firmName"
          value={targetClaim.firmName}
          onChange={handleInputChange}
          ref={firstInput}
        />
      </p>

      <p>
        <label htmlFor="fullname">ФИО перевозчика</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          value={targetClaim.fullname}
          onChange={handleInputChange}
        />
      </p>

      <p>
        <label htmlFor="phone">Контактный телефон перевозчика</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={targetClaim.phone}
          onChange={handleInputChange}
        />
      </p>

      <textarea
        name="comments"
        id=""
        cols="30"
        rows="10"
        value={targetClaim.comments}
        onChange={handleInputChange}
        placeholder="Комментарии"
      ></textarea>

      <p>
        <label htmlFor="ati">ATI код сети перевозчика</label>
        <input
          type="text"
          id="ati"
          name="ati"
          value={targetClaim.ati}
          onChange={handleInputChange}
        />
      </p>

      <div className={s.button_block}>
        <button className="button" type="submit">Подтвердить изменения</button>
        <button className="button" type="button" onClick={handleCancel}>Отмена</button>
      </div>
      
    </form>
  )
}

EditClaimForm.propTypes = {
  editing: PropTypes.bool,
  setEditing: PropTypes.func,
  currentClaim: PropTypes.object,
  handleUpdateClaim: PropTypes.func,
};

export default EditClaimForm;
