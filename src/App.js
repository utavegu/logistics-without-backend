import React, { useEffect, useState } from 'react';
import AddClaimForm from './components/AddClaimForm';
import EditClaimForm from './components/EditClaimForm';
import ClaimsView from './components/ClaimsView';
import ClaimModel from './models/ClaimModel';
import Modal from './components/Modal';
import { Status } from './common'

/*
ISSUES
  - Стилизация
  - Оставшийся рефакторинг
  - DRY! +-
  - Секшинам классы
  - Манкитестинг
*/

const SERVER_LINK = "http://localhost:4000/api/"
const initialFormState = new ClaimModel(null, "", "", "", "", "", "");
// А ещё у меня есть смутные воспоминания, что с батареей атрибутов можно как-то более лучше работать... рест-спред... но тот ли это случай. Вот если 1 раз задать объект, а потом какое-то одно свойство переопределять, тогда да... а тут вряд ли.

const App = () => {
  const [claims, setClaims] = useState(null);
  const [editing, setEditing] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(initialFormState);
  const [modalActive, setModalActive] = useState(false);
  const [responseState, setResponseState] = useState({
    success: false,
    loading: false,
    error: null,
  });

  // Вынес это дело в кастомный хук (лежит в hooks), в рамках рефакторинга, но переделывать на него уже не стал, так как опасаюсь всё разломать перед сдачей проекта. Так тоже вполне компактно получилось.
  const createRequest = async (link, type, body = null) => {
    const options = {
      method: type,
      headers: { "Content-Type": "application/json" },
    }
    if (body) options.body = JSON.stringify(body);
    setResponseState(prev => ({...prev, loading: true}));
    try {
      const response = await fetch(link, options);
      if (response.ok) {
        if (type === "GET") {
          let data = await response.json();
          setClaims(data.data);
        }
        setResponseState(prev => ({...prev, success: true}));
        setTimeout(() => {
          setResponseState(prev => ({...prev, success: false}));
        }, 1000);
      };
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      setResponseState(prev => ({...prev, error: error}));
      console.dir(error);
    } finally {
      setResponseState(prev => ({...prev, loading: false}));
    }
  }

  const handleSelectClaim = claim => {
    setEditing(true);
    setModalActive(true);
    setCurrentClaim(new ClaimModel(claim.appNumber, claim.datetime, claim.firmName, claim.fullname, claim.phone, claim.comments, claim.ati));
  };


  const loadActualClaims = () => {
    createRequest(SERVER_LINK + "claims", "GET");
	};

  useEffect(() => {
    loadActualClaims();
  }, [])
  
  const handleAddClaim = claim => {
    // Вот тут можно через рест-спред одно поле заменить. Подумаю об этом позже.
    const body = new ClaimModel(claim.appNumber, new Date().toLocaleString().slice(0, -3), claim.firmName, claim.fullname, claim.phone, claim.comments, claim.ati);
    createRequest(SERVER_LINK + "claim", "POST", body);
    loadActualClaims();
  };

  const handleUpdateClaim = claim => {
    setEditing(false);
    setModalActive(false);
    const body = new ClaimModel(claim.appNumber, claim.datetime, claim.firmName, claim.fullname, claim.phone, claim.comments, claim.ati);
    createRequest(SERVER_LINK + `claim`, "PATCH", body);
    loadActualClaims();
  }

  const handleDeleteClaim =  id => {
    setEditing(false);
    createRequest(SERVER_LINK + `claim/${id}`, "DELETE");
    loadActualClaims();
  };


  return (
    <main className="container">
      <h1 className="visually-hidden">Система ведения заявок для логистов в автогрузоперевозках</h1>

      <section>
        <h2>Таблица заявок</h2>
        <button onClick={() => setModalActive(true)}>Создать новую заявку</button>
        {claims 
        && 
        <ClaimsView
          claims={claims}
          onEdit={handleSelectClaim}
          onDelete={handleDeleteClaim}
        />}
      </section>

      <Modal active={modalActive} setActive={setModalActive} setEditing={setEditing}>
        {editing ? (
          <section>
            <h2>Редактировать заявку</h2>
            <EditClaimForm
              editing={editing}
              setEditing={setEditing}
              currentClaim={currentClaim}
              onUpdate={handleUpdateClaim}
              setModalActive={setModalActive}
            />
          </section>
        ) : (
          <section>
            <h2>Создать новую заявку</h2>
            <AddClaimForm onAdd={handleAddClaim} setModalActive={setModalActive} />
          </section>
        )}
      </Modal>

      {Status(responseState.loading, responseState.error, responseState.success)}

    </main>
  );
}

export default App;
