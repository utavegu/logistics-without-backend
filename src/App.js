import React, { useEffect, useState } from 'react';
// import ClaimModel from './models/ClaimModel'; В моделз тоже подчистить, когда всё закончу
import AddClaimForm from './components/AddClaimForm';
import EditClaimForm from './components/EditClaimForm';
import ClaimsView from './components/ClaimsView';
// import useREST from './hooks/useREST'; ТОЖЕ ГРОХНУТЬ

/*
ISSUES
  - Текст ошибки?
  - Функцию запроса на сервер, прелоадер и статусное сообщение - в утил

  - Обработку ошибок и загрузки для взаимодействия с сервером +-
  - Моки на сервер и генерацию айдишника туда же
  - На сервере имена эндпоинтов тоже поменять... юзерс блин

  - DRY!
  
  - Секшинам классы
*/

const SERVER_LINK = "http://localhost:4000/api/"

const initialFormState = {
  appNumber: null,
  datetime: "",
  firmName: "",
  fullname: "",
  phone: "",
  comments: "",
  ati: "",
};

const App = () => {

  const [claims, setClaims] = useState(null);
  const [editing, setEditing] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(initialFormState);

  const handleSelectClaim = claim => {
    setEditing(true);
    setCurrentClaim({
      appNumber: claim.appNumber,
      datetime: claim.datetime,
      firmName: claim.firmName,
      fullname: claim.fullname,
      phone: claim.phone,
      comments: claim.comments,
      ati: claim.ati,
    });
  };

  // Можно в один объект - респонс стэйт
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  // Может, всё-таки, в useServerCRUD и в hooks? + три стейта выше в один объект и туда же. Хотя не вижу смысла усложнять, вроде и так вполне компактно получилось..
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


  // GET
  const loadActualClaims = () => {
    createRequest(SERVER_LINK + "claims", "GET");
	};

  useEffect(() => {
    loadActualClaims();
  }, [])
  
  // POST
  const handleAddClaim = claim => {
    const body = {
      appNumber: claim.appNumber,
      datetime: new Date().toLocaleString().slice(0, -3),
      firmName: claim.firmName,
      fullname: claim.fullname,
      phone: claim.phone,
      comments: claim.comments,
      ati: claim.ati,
    };
    createRequest(SERVER_LINK + "claim", "POST", body);
    loadActualClaims();
  };

  // PATCH
  const handleUpdateClaim = (id, updatedClaim) => {
    setEditing(false)
    const body = {
      appNumber: updatedClaim.appNumber,
      datetime: updatedClaim.datetime,
      firmName: updatedClaim.firmName,
      fullname: updatedClaim.fullname,
      phone: updatedClaim.phone,
      comments: updatedClaim.comments,
      ati: updatedClaim.ati,
    };
    createRequest(SERVER_LINK + `claim`, "PATCH", body);
    loadActualClaims();
  }

  // DELETE
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
