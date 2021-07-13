import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ClaimsTable from './ClaimsTable';
import Filters from './Filters';
import Search from './Search';

/*
ISSUES:
  1) Сделать сброс фильтров при добавлении / удалении / редактировании
  2) Возможно хэндлГетФильтрс стоит переделать
*/

const ClaimsView = ({claims, onEdit: handleSelectClaim, onDelete: handleDeleteClaim}) => {

  const [filtredClaims, setFiltredClaims] = useState(claims);
  const [queryString, setQueryString] = useState('');

  useEffect(
    () => {
      setFiltredClaims(claims);
    },
    [claims]
  )

  // Время будет, так сделать ещё мультифильтр по фирмам и перевозчикам.
  const handleGetFilters = (targetDate) => {
    targetDate === "all" ? setFiltredClaims(claims) : setFiltredClaims(
      claims.slice().filter(claim => claim.datetime.slice(0, -7) === targetDate)
    );
  };

  // Поиск допилить по ATI и телефону ещё. По радиобаттону. Или можно через двойное или искать по другим двум поляем ещё. А потом отдавать уникальный массив, без повторений. Хотя с такими полями какие уж там повторения...
  const foundClaims = filtredClaims
    .slice()
    .filter(claim => claim.comments.toLowerCase().indexOf(queryString.toLowerCase().trim()) > -1);


  return (
    <>
      <section>
        <h3>Фильтры и поиск</h3>
        <Filters claims={claims} onGetFilters={handleGetFilters} />
        <Search queryString={queryString} setQueryString={setQueryString} />
      </section>
      <ClaimsTable claims={foundClaims} handleSelectClaim={handleSelectClaim} handleDeleteClaim={handleDeleteClaim} />
    </>
  )
}

ClaimsView.propTypes = {
  claims: PropTypes.arrayOf(PropTypes.object),
  handleSelectClaim: PropTypes.func,
  handleDeleteClaim: PropTypes.func,
};

export default ClaimsView

