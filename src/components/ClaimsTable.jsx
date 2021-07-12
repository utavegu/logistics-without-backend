import React from 'react';
import PropTypes from 'prop-types';

/*
ISSUES:
  1) Поля даты-времени, телефона и тд - настроить нормально (с интерактивой, атрибутами...)
  2) АТИ - в заготовленный энчор просто вставлять код через интерполяцию в шаблонной строке. Всю ссылку, возможно, отображать нет смысла из-за её единообразия и соображений экономии места в таблице
  3) Кнопки сделать иконками. Подписанными через вижуалли-хидден и тайтл
*/

const ClaimsTable = ({claims, handleSelectClaim, handleDeleteClaim}) => {

  const handleConfirmDeleteClaim = id => {
    let answer = window.confirm(`Вы уверены, что хотите удалить заявку ${id}?`);
    if (answer) handleDeleteClaim(id);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Номер заявки</th>
          <th>Дата и время получения заявки от клиента</th>
          <th>Название фирмы клиента</th>
          <th>ФИО перевозчика</th>
          <th>Контактный телефон перевозчика</th>
          <th>Комментарии</th>
          <th>ATI код сети перевозчика</th>
        </tr>
      </thead>
      <tbody>
        {claims.length > 0 ? (
          claims.map(claim => (
            <tr key={claim.appNumber}>
              <td>{claim.appNumber}</td>
              <td>{claim.datetime}</td>
              <td>{claim.firmName}</td>
              <td>{claim.fullname}</td>
              <td>{claim.phone}</td>
              <td>{claim.comments}</td>
              <td><a href={claim.ati}>{claim.ati}</a></td>
              <td>
                <button onClick={() => handleSelectClaim(claim)}>Редактировать</button>
                <button onClick={() => handleConfirmDeleteClaim(claim.appNumber)}>Удалить</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>Заявок нет!</td>
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
