import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ClaimsTable from './ClaimsTable';
import Filters from './Filters';
import Search from './Search';

/*
ISSUES:
  1) Сделать сброс фильтров при добавлении / удалении / редактировании
  2) Возможно хэндлГетФильтрс стоит переделать
  3) Да тут всё теперь стоит переделать >_<
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
    console.log(filtersState);
    // Что-то пошло не так... Может оллДэйт и пр. тоже наверх продёрнуть и вместо клэймс подставлять? Или вообще не продёргивать, а прямо сюда эту функцию вынести и наоборот опускать вниз...

    filtersState.date === "all" ? setFiltredClaims(claims) : setFiltredClaims(
      claims.slice().filter(claim => claim.datetime.slice(0, -7) === filtersState.date)
    )
    &&
    filtersState.firm === "all" ? setFiltredClaims(claims) : setFiltredClaims(
      claims.slice().filter(claim => claim.firmName === filtersState.firm)
    )
    &&
    filtersState.carrier === "all" ? setFiltredClaims(claims) : setFiltredClaims(
      claims.slice().filter(claim => claim.fullname === filtersState.carrier)
    )
  };

  /*
  Блин, вспоминай как это делать... =/

  // Фильтр по ТИПУ ЖИЛЬЯ
  function filterHousingType(element) {
    return housingType.value === 'any' ? true : element.offer.type === housingType.value;
  }

  // Фильтр по КОЛИЧЕСТВУ КОМНАТ
  function filterHousingRooms(element) {
    return housingRooms.value === 'any' ? true : element.offer.rooms === Number(housingRooms.value);
  }

  // Фильтр по ЧИСЛУ ГОСТЕЙ
  function filterHousingGuests(element) {
    return housingGuests.value === 'any' ? true : element.offer.guests === Number(housingGuests.value);
  }

  // ФУНКЦИЯ, объединяющая работу всех фильров
  function multyfilter(data) {
    return data
      .filter(function (element) {
        return (
          filterHousingType(element) &&
          filterHousingRooms(element) &&
          filterHousingGuests(element)
        );
      })
  }
  */



  // Поиск допилить по ATI и телефону ещё. По номеру заявки? По радиобаттону... Или можно через двойное(тройное) "или" искать по другим двум поляем ещё. А потом отдавать уникальный массив, без повторений. Хотя с такими полями какие уж там повторения...
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

