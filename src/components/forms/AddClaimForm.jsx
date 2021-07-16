import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import s from './Forms.module.css';


const AddClaimForm = ({onAdd: handleAddClaim, setModalActive}) => {

  const initialFormState = {
    appNumber: null,
    datetime: '',
    firmName: '',
    fullname: '',
    phone: '',
    comments: '',
    ati: '',
  };

  const [claimData, setClaimData] = useState(initialFormState);

  const firstInput = useRef(null);
  useEffect(() => {
    if (firstInput.current !== null) firstInput.current.focus();
  }, [handleAddClaim])

  const handleInputChange = ({target}) => {
    setClaimData({ ...claimData, [target.name]: target.value });
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    handleAddClaim(claimData);
    setClaimData(initialFormState);
    setModalActive(false);
  };

  
  return (
    <form className={s.claim_form} onSubmit={handleSubmit}>

      <p>
        <label htmlFor="firmName">Название фирмы клиента</label>
        <input
          type="text"
          id="firmName"
          name="firmName"
          value={claimData.firmName}
          onChange={handleInputChange}
          required
          ref={firstInput}
        />
      </p>

      <p>
        <label htmlFor="fullname">ФИО перевозчика</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          value={claimData.fullname}
          onChange={handleInputChange}
          required
        />
      </p>

      <p>
        <label htmlFor="phone">Контактный телефон перевозчика</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={claimData.phone}
          onChange={handleInputChange}
          pattern="^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$"
          required
        />
      </p>

      <textarea
        name="comments"
        cols="30"
        rows="10"
        value={claimData.comments}
        placeholder="Комментарии"
        onChange={handleInputChange}
      ></textarea>

      <p>
        <label htmlFor="ati">ATI код сети перевозчика</label>
        <input
          type="text"
          id="ati"
          name="ati"
          value={claimData.ati}
          onChange={handleInputChange}
        />
      </p>

      <button className="button" type="submit">Создать заявку</button>

    </form>
  )
}

AddClaimForm.propTypes = {
  handleAddClaim: PropTypes.func,
};

export default AddClaimForm;

