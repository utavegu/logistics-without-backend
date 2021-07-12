import React from 'react';
import PropTypes from 'prop-types';
import ClaimsTable from './ClaimsTable';

const ClaimsView = ({claims, onEdit: handleSelectClaim, onDelete: handleDeleteClaim}) => {
  /* ----- КОМПОНЕНТ ДЛЯ ФИЛЬТРОВ И ПОИСКА ----- */
  // Заявкам делать слайс на этом уровне
  return (
    <>
      <ClaimsTable claims={claims} handleSelectClaim={handleSelectClaim} handleDeleteClaim={handleDeleteClaim} />
    </>
  )
}

ClaimsView.propTypes = {
  claims: PropTypes.arrayOf(PropTypes.object),
  handleSelectClaim: PropTypes.func,
  handleDeleteClaim: PropTypes.func,
};

export default ClaimsView

