import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/*
ISSUES
  1) То же самое, что и в форме добавления заявки
*/

const EditClaimForm = ({editing, setEditing, currentClaim, onUpdate: handleUpdateClaim}) => {

  const [targetClaim, setTargetClaim] = useState(currentClaim)

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
    handleUpdateClaim(targetClaim.appNumber, targetClaim)
  }


  return (
    <form onSubmit={handleSubmit}>

      <p>
        <label>Название фирмы клиента</label>
        <input
          type="text"
          name="firmName"
          value={targetClaim.firmName}
          onChange={handleInputChange}
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

      <button type="submit">Подтвердить изменения</button>
      <button type="button" onClick={() => setEditing(false)}>Отмена</button>
      
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