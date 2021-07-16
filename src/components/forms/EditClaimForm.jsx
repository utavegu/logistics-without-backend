import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import s from './Forms.module.css';

/*
ISSUES
  1) То же самое, что и в форме добавления заявки
*/

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
        <label>Название фирмы клиента</label>
        <input
          type="text"
          name="firmName"
          value={targetClaim.firmName}
          onChange={handleInputChange}
          ref={firstInput}
        />
      </p>

      <p>
        <label>ФИО перевозчика</label>
        <input
          type="text"
          name="fullname"
          value={targetClaim.fullname}
          onChange={handleInputChange}
        />
      </p>

      <p>
        <label>Контактный телефон перевозчика</label>
        <input
          type="tel"
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
        <label>ATI код сети перевозчика</label>
        <input
          type="text"
          name="ati"
          value={targetClaim.ati}
          onChange={handleInputChange}
        />
      </p>

      <button className="button" type="submit">Подтвердить изменения</button>
      <button className="button" type="button" onClick={handleCancel}>Отмена</button>
      
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
