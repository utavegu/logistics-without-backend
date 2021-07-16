import React from 'react';
import PropTypes from 'prop-types';
import s from './ClaimsTable.module.css';

const ClaimsTable = ({claims, handleSelectClaim, handleDeleteClaim}) => {

  const handleConfirmDeleteClaim = id => {
    let answer = window.confirm(`Вы уверены, что хотите удалить заявку ${id}?`);
    if (answer) handleDeleteClaim(id);
  }

  return (
    <table className={s.claims_table}>
      <thead>
        <tr>
          <th>№</th>
          <th>Дата получения заявки</th>
          <th>Название фирмы клиента</th>
          <th>ФИО перевозчика</th>
          <th>Контактный телефон перевозчика</th>
          <th>Комментарии</th>
          <th>ATI</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {claims.length > 0 ? (
          claims.map(claim => (
            <tr key={claim.appNumber}>
              <td>{claim.appNumber}</td>
              <td>
                <time dateTime={claim.datetime}>{claim.datetime}</time>
              </td>
              <td>{claim.firmName}</td>
              <td>{claim.fullname}</td>
              <td>
                <a href={`tel:+7${(claim.phone).slice(1)}`}>{claim.phone}</a>
              </td>
              <td className={s.comment_field}>{claim.comments}</td>
              <td>
                <a href={`https://ati.su/firms/${claim.ati}/info`} target="_blank" rel="noreferrer">{claim.ati}</a>
              </td>
              <td>
                <button className="button button-edit" title="Редактировать" onClick={() => handleSelectClaim(claim)}>
                  <span className="visually-hidden">Редактировать</span>
                </button>
                <button className="button button-delete" title="Удалить" onClick={() => handleConfirmDeleteClaim(claim.appNumber)}>
                  <span className="visually-hidden">Удалить</span>
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={8}>Заявок нет!</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

ClaimsTable.propTypes = {
  claims: PropTypes.arrayOf(PropTypes.object),
  handleSelectClaim: PropTypes.func,
  handleDeleteClaim: PropTypes.func,
};

export default ClaimsTable;
