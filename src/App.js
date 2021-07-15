import React, { useEffect, useState } from 'react';
import AddClaimForm from './components/AddClaimForm';
import EditClaimForm from './components/EditClaimForm';
import ClaimsView from './components/ClaimsView';
import ClaimModel from './models/ClaimModel';
import Modal from './components/Modal';

/*
- Статусбар
- Стилизация
- Оставшийся рефакторинг


ISSUES
  - Текст ошибки?
  - Функцию запроса на сервер, прелоадер и статусное сообщение - в утил
  - Обработку ошибок и загрузки для взаимодействия с сервером +-
  - DRY! +-
  - Секшинам классы
  - Манкитестинг
*/

const SERVER_LINK = "http://localhost:4000/api/"
const initialFormState = new ClaimModel(null, "", "", "", "", "", "");
// А ещё у меня есть смутные воспоминания, что с батареей атрибутов можно как-то более лучше работать... рест-спред... но тот ли это случай. Вот если 1 раз задать объект, а потом какое-то одно свойство переопределять, тогда да... а тут вряд ли.

const App = () => {

  const [claims, setClaims] = useState(null);

  // Вот тебя давай всё-таки переделаю в один объект. Ну, кстати, и клэймз туда же можно. Но не нужно. Вы статусы, а клеймз - данные.
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendLoading, setSendLoading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(initialFormState);

  const [modalActive, setModalActive] = useState(false); // Блин, что-то я разошелся. Удаляй их везде по одному и смотри, сломалось или нет. Обязательно после модалки потести, всё ли работает как надо, потом наконец-то стилизуй. Рефакторинг оставшийся на завтра на утро.

  // Вынес это дело в кастомный хук (лежит в hooks), в рамках рефакторинга, но переделывать на него уже не стал, так как опасаюсь всё разломать перед сдачей проекта. Так тоже вполне компактно получилось.
  const createRequest = async (link, type, body = null) => {
    const options = {
      method: type,
      headers: { "Content-Type": "application/json" },
    }
    if (body) options.body = JSON.stringify(body);
    setSendLoading(true);
    try {
      const response = await fetch(link, options);
      if (response.ok) {
        if (type === "GET") {
          let data = await response.json();
          setClaims(data.data);
        }
        setSendSuccess(true);
        setTimeout(() => {
          setSendSuccess(false);
        }, 2000);
      };
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      setSendError(error);
      console.dir(error);
    } finally {
      setSendLoading(false);
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

  const handleUpdateClaim = (id, updatedClaim) => {
    // Так... рудиментарный айдишник от безбэкэндовой версии. Почистить
    // Кстати можно и без апдейтед... нужно больше компактности и рефакторинга
    setEditing(false);
    setModalActive(false);
    const body = new ClaimModel(updatedClaim.appNumber, updatedClaim.datetime, updatedClaim.firmName, updatedClaim.fullname, updatedClaim.phone, updatedClaim.comments, updatedClaim.ati);
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

      {/* СТАТУСЫ */}
      {/* Тут вам точно не место, чтобы разметку не двигали. Думаю, вас стоит вырвать из потока вообще и дать вам отдельную коробку. Коробку отображать по конструкции вида:
      sendLoading || sendError || sendSuccess || "общий контейнер"
      */}
      {sendLoading && <p style={{backgroundColor: "yellow"}}>Loading...</p>}
      {sendError && <p style={{backgroundColor: "red"}}>Error!</p>}
      {sendSuccess && <p style={{backgroundColor: "green"}}>Success!</p>}

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

    </main>
  );
}

export default App;
