import React, { useEffect, useState } from 'react';
// import ClaimModel from './models/ClaimModel'; В моделз тоже подчистить, когда всё закончу
import AddClaimForm from './components/AddClaimForm';
import EditClaimForm from './components/EditClaimForm';
import ClaimsView from './components/ClaimsView';

// import useREST from './hooks/useREST';

/*
ISSUES
  - Обработка при удалении и получении заявок
  - Текст ошибки
  - Функцию запроса на сервер, прелоадер и статусное сообщение - в утил

  - Еррор с сервера вместе с данными, заголовки в гет и делит...

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



  /* Работа с бэком. Приборка */
/*
  const {data, isLoading: loading, hasError: error} = useREST(SERVER_LINK + "users");
  console.log("ДАННЫЕ: " + data);
  console.log("LOADING: " + loading);
  console.log("ERROR " + error);
  console.log("--------------------------------------");
  */



  // Можно в один объект - респонс стэйт
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  // GET
  const loadActualClaims = async () => {

    /*
		fetch(SERVER_LINK + "users")
			.then(response => response.json())
			.then(claims => {
				setClaims(claims.data);
			})
    */

      setSendLoading(true);
      try {
        // Параметры не нужны для гет, а для делит не нужны хедерс и боди. Но поэкспериментируй и попробуй сделать гет/делит с хедерсами. И подумай что тут сделать с боди можно в этих двух методах
        const response = await fetch(SERVER_LINK + "users", {
          method: "GET",
          
          headers: { "Content-Type": "application/json" },
          
          // body: JSON.stringify(''), не канает. Значит нужно будет условно отрисовывать isHasBody
          // Пока из того, что меняется - это тип запроса и наличие тела у него. И наличие данных у гет
          
        });
        if (response.ok) {

          // 2 строчки, характерные только для ГЕТ
          let data = await response.json();
          setClaims(data.data);

          setSendSuccess(true);
          setTimeout(() => {
            setSendSuccess(false);
          }, 3000);
        };
        if (!response.ok) {
          throw new Error(response.statusText);
        }
      } catch (error) {
        setSendError(error);
        setTimeout(() => {
          setSendError(null);
        }, 3000);
        console.dir(error);
      } finally {
        setSendLoading(false);
      }

	};

  useEffect(() => {
    loadActualClaims();
  }, [])
  
  // POST
  const handleAddClaim = async (claim) => {
    const body = {
      appNumber: claim.appNumber,
      datetime: new Date().toLocaleString().slice(0, -3),
      firmName: claim.firmName,
      fullname: claim.fullname,
      phone: claim.phone,
      comments: claim.comments,
      ati: claim.phone,
    };

    // Кстати, общую часть-то можно, наверное, вот отсюда начинать.
    setSendLoading(true);
    try {
      // Параметры не нужны для гет, а для делит не нужны хедерс и боди. Но поэкспериментируй и попробуй сделать гет/делит с хедерсами. И подумай что тут сделать с боди можно в этих двух методах
      const response = await fetch(SERVER_LINK + "user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        setSendSuccess(true);
        setTimeout(() => {
          setSendSuccess(false);
        }, 3000);
      };
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      setSendError(error);
      setTimeout(() => {
        setSendError(null);
      }, 3000);
      console.dir(error);
    } finally {
      setSendLoading(false);
    }

    loadActualClaims();
  };

  // PATCH
  const handleUpdateClaim = async (id, updatedClaim) => {
    setEditing(false)

    const body = {
      appNumber: updatedClaim.appNumber,
      datetime: updatedClaim.datetime,
      firmName: updatedClaim.firmName,
      fullname: updatedClaim.fullname,
      phone: updatedClaim.phone,
      comments: updatedClaim.comments,
      ati: updatedClaim.phone,
    };

    setSendLoading(true);
    try {
      const response = await fetch(SERVER_LINK + `user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        setSendSuccess(true);
        setTimeout(() => {
          setSendSuccess(false);
        }, 3000);
      };
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      setSendError(error);
      setTimeout(() => {
        setSendError(null);
      }, 3000);
      console.dir(error);
    } finally {
      setSendLoading(false);
    }

    loadActualClaims();
  }

  // DELETE
  const handleDeleteClaim = id => {
    setEditing(false);

    fetch(SERVER_LINK + `user/${id}`, {
      method: 'DELETE'
    });

    loadActualClaims();
  };


  return (
    <main className="container">
      <h1 className="visually-hidden">Система ведения заявок для логистов в автогрузоперевозках</h1>

      <section>
        <h2>Таблица заявок</h2>
        {claims ? 
          <ClaimsView claims={claims} onEdit={handleSelectClaim} onDelete={handleDeleteClaim} /> 
        : 
          <p>Загрузка...</p>
        }
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
