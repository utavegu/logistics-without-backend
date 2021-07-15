import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ClaimsTable from './ClaimsTable';
import Filters from './Filters';
import Search from './Search';

/*
ISSUES:
  - Оптимизировать поиск
  - Подумать над лишними пробросами через переменные в хэндлГетФильтрз
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

  const handleGetFilters = (filtersState) => {
    // С одной стороны - лишние пробросы через переменные, с другой - так читабельнее... Подумаю ещё над этим
    const dateFilter = claim => (filtersState.date === "all" || claim.datetime.slice(0, -7) === filtersState.date);
    const firmFilter = claim => (filtersState.firm === "all" || claim.firmName === filtersState.firm);
    const carrierFilter = claim => (filtersState.carrier === "all" || claim.fullname === filtersState.carrier);

    const multifilter = claims
      .filter(dateFilter)
      .filter(firmFilter)
      .filter(carrierFilter);

    setFiltredClaims(multifilter);
  };


  const foundClaims = filtredClaims
    .slice()
    .filter(claim => 
      claim.comments.toLowerCase().indexOf(queryString.toLowerCase().trim()) > -1
      ||
      claim.phone.toLowerCase().indexOf(queryString.toLowerCase().trim()) > -1
      ||
      claim.ati.toLowerCase().indexOf(queryString.toLowerCase().trim()) > -1
    );


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

