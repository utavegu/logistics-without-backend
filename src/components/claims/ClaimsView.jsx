import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ClaimsTable from './ClaimsTable';
import Filters from '../options/Filters';
import Search from '../options/Search';
import s from './ClaimsView.module.css';


const ClaimsView = ({claims, onEdit: handleSelectClaim, onDelete: handleDeleteClaim}) => {

  const [filtredClaims, setFiltredClaims] = useState(claims);
  const [queryString, setQueryString] = useState('');

  useEffect(
    () => {
      setFiltredClaims(claims);
    },
    [claims]
  );

  const handleGetFilters = (filtersState) => {
    const multifilter = claims
      .filter(claim => (filtersState.date === "all" || claim.datetime.slice(0, -7) === filtersState.date))
      .filter(claim => (filtersState.firm === "all" || claim.firmName === filtersState.firm))
      .filter(claim => (filtersState.carrier === "all" || claim.fullname === filtersState.carrier));

    setFiltredClaims(multifilter);
  };

  const isFoundInField = claim => field => claim[field].toLowerCase().indexOf(queryString.toLowerCase().trim()) > -1;
  const foundClaims = filtredClaims.filter(claim => isFoundInField(claim)('comments') || isFoundInField(claim)('phone') || isFoundInField(claim)('ati'));


  return (
    <>
      <section className={s.options}>
        <h3 className="visually-hidden">Фильтры и поиск</h3>
        <Filters claims={claims} onGetFilters={handleGetFilters} />
        <Search queryString={queryString} setQueryString={setQueryString} />
      </section>
      <ClaimsTable
        claims={foundClaims}
        handleSelectClaim={handleSelectClaim}
        handleDeleteClaim={handleDeleteClaim}
      />
    </>
  )
}

ClaimsView.propTypes = {
  claims: PropTypes.arrayOf(PropTypes.object),
  handleSelectClaim: PropTypes.func,
  handleDeleteClaim: PropTypes.func,
};

export default ClaimsView;

