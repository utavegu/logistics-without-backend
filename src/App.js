import React, { useEffect, useState } from 'react';
import AddClaimForm from './components/AddClaimForm';
import EditClaimForm from './components/EditClaimForm';
import ClaimsView from './components/ClaimsView';
import ClaimModel from './models/ClaimModel'; // В моделз тоже подчистить, когда всё закончу
// import useREST from './hooks/useREST'; ТОЖЕ ГРОХНУТЬ

/*
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

  const [claims, setClaims] = useState(null); // Если в хук, то дата. А ты тут и останешься клэймзом. А для тебя вообще нужен будет стейт? Вроде нет... лишние перерисовки. Поэкспериментирую. Можно же деструктурировать прямо из хука и в дочерний компонент отдавать данные по тому же принципу, через &&.
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendLoading, setSendLoading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(initialFormState);

  // Подумывал эту функцию и 4 верхних стейта (предварительно собрав их в 1 объект) вынести в отдельный хук, но пусть будет так - уже вполне компактно получилось. Вообще неплохая идея, вроде. Но давай сначала заканчивай с поиском и фильтрами, далее если буду успевать, отрефакторю. (useServerCRUD)
  // Только обязательно засеки количество перерисовок в каждом случае (с хуком и как сейчас), потыкавшись по всем КРУД-функциям
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
    setEditing(false)
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
        {claims && <ClaimsView claims={claims} onEdit={handleSelectClaim} onDelete={handleDeleteClaim} />}
      </section>

      {/* СТАТУСЫ */}
      {/* Тут вам точно не место, чтобы разметку не двигали. Думаю, вас стоит вырвать из потока вообще и дать вам отдельную коробку. Коробку отображать по конструкции вида:
      sendLoading || sendError || sendSuccess || "общий контейнер"
      */}
      {sendLoading && <p style={{backgroundColor: "yellow"}}>Loading...</p>}
      {sendError && <p style={{backgroundColor: "red"}}>Error!</p>}
      {sendSuccess && <p style={{backgroundColor: "green"}}>Success!</p>}

      <div className="form-place">
        {editing ? (
          <section>
            <h2>Редактировать пользователя</h2>
            <EditClaimForm
              editing={editing}
              setEditing={setEditing}
              currentClaim={currentClaim}
              onUpdate={handleUpdateClaim}
            />
          </section>
        ) : (
          <section>
            <h2>Создать новую заявку</h2>
            <AddClaimForm onAdd={handleAddClaim} />
          </section>
        )}
      </div>

    </main>
  );
}

export default App;
