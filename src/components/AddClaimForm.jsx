import React, { useState } from 'react';
import PropTypes from 'prop-types';

/*
ISSUES:
  1) Перепроверить типы данных в инишиал стейт (по итогу)
  2) Паттерн для телефона (пока не надо, мешает отладке)
  3) Зафиксировать текстарею и проставить ей разные параметры для разных ширин
  4) АТИ - скорее всего текст, а не урл. Потом просто вставлять его в заготовленный энчор
  5) Связать лэйблы и инпуты
  6) Стилизация
*/

const AddClaimForm = ({onAdd: handleAddClaim}) => {

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

  const handleInputChange = ({target}) => {
    setClaimData({ ...claimData, [target.name]: target.value });
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    handleAddClaim(claimData);
    setClaimData(initialFormState);
  };


  return (
    <form onSubmit={handleSubmit}>

      <p>
        <label>Название фирмы клиента</label>
        <input
          type="text"
          name="firmName"
          value={claimData.firmName}
          onChange={handleInputChange}
          required
        />
      </p>

      <p>
        <label>ФИО перевозчика</label>
        <input
          type="text"
          name="fullname"
          value={claimData.fullname}
          onChange={handleInputChange}
          required
        />
      </p>

      <p>
        <label>Контактный телефон перевозчика</label>
        <input
          type="tel"
          name="phone"
          value={claimData.phone}
          onChange={handleInputChange}
          required
        />
      </p>

      <textarea
        name="comments"
        id=""
        cols="30"
        rows="10"
        value={claimData.comments}
        placeholder="Комментарии"
        onChange={handleInputChange}
      ></textarea>

      <p>
        <label>ATI код сети перевозчика</label>
        <input
          type="text"
          name="ati"
          value={claimData.ati}
          onChange={handleInputChange}
        />
      </p>

      <button type="submit">Создать заявку</button>

    </form>
  )
}

AddClaimForm.propTypes = {
  handleAddClaim: PropTypes.func,
};

export default AddClaimForm;
