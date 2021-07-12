import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ClaimsTable from './ClaimsTable';
import Filters from './Filters';

/*
ISSUES:
  1) Сделать сброс фильтров при добавлении / удалении / редактировании
  2) Возможно хэндлГетФильтрс стоит переделать
*/

const ClaimsView = ({claims, onEdit: handleSelectClaim, onDelete: handleDeleteClaim}) => {

  const [filtredClaims, setFiltredClaims] = useState(claims);

  useEffect(
    () => {
      setFiltredClaims(claims);
    },
    [claims]
  )

  const handleGetFilters = (targetDate) => {
    targetDate === "all" ? setFiltredClaims(claims) : setFiltredClaims(
      claims.slice().filter(claim => claim.datetime.slice(0, -7) === targetDate)
    );
  }

  return (
    <>
      <section>
        <h3>Фильтры</h3>
        <Filters claims={claims} onGetFilters={handleGetFilters} />
      </section>
      <ClaimsTable claims={filtredClaims} handleSelectClaim={handleSelectClaim} handleDeleteClaim={handleDeleteClaim} />
    </>
  )
}

ClaimsView.propTypes = {
  claims: PropTypes.arrayOf(PropTypes.object),
  handleSelectClaim: PropTypes.func,
  handleDeleteClaim: PropTypes.func,
};

export default ClaimsView

