import React, { useEffect, useState } from 'react';
import ClaimModel from './models/ClaimModel';
import AddClaimForm from './components/AddClaimForm';
import EditClaimForm from './components/EditClaimForm';
import ClaimsView from './components/ClaimsView';

/*
ISSUES
  1) Секшинам классы
  2) Обработку ошибок и загрузки для взаимодействия с сервером
  3) Моки на сервер и генерацию айдишника туда же
  4) Ссылки в константы. Или даже только их общую часть, а там конкатенацией или шаблонной строкой прилепишь
  5) На сервере имена эндпоинтов тоже поменять... юзерс блин
*/

// let i = 1; --- для версии без бэка

/*
const claimsMocks = [
  new ClaimModel(i++, "12.07.2021, 14:32", "Яблоки Алисы", "Вася", "8-999-777-66-33", "Склонен уходить в запой. Не очень надёжен.", "12345"),
  new ClaimModel(i++, "12.07.2021, 15:12", "Стулья на дом", "Юра", "8-999-773-61-23", "Юра - нормальный пацан. Чоткий. Да и стулья у заказчика не жидкие. Сами берём оптом.", "23141"),
  new ClaimModel(i++, "13.07.2021, 16:40", "Шпалы и рельсы", "Аркадий Вениаминович", "8-999-996-61-23", "Сотрудничаем 20 лет. Без нареканий.", "4151"),
  new ClaimModel(i++, "13.07.2021, 17:15", "Ураний и Плутоний", "Транс Радиал Логистик Партнерс", "8-921-999-12-23", "Нужен грузовик со свинцовой обивкой и конвоем.", "67313"),
  new ClaimModel(i++, "14.07.2021, 11:24", "Бетон оптом", "Семён", "8-912-777-88-77", "Нужна бетономешалка.", "81214"),
];
*/

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

  const [claims, setClaims] = useState([]);
  // const [claims, setClaims] = useState(claimsMocks); --- для версии без бэка
  const [editing, setEditing] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(initialFormState);

  const loadActualClaims = () => {
		fetch("http://localhost:4000/api/users")
			.then(response => response.json())
			.then(claims => {
				setClaims(claims.data);
			})
	};

  useEffect(() => {
    loadActualClaims();
  }, [])
  

  const handleAddClaim = claim => {
    // claim.appNumber = i++;
    claim.datetime = new Date().toLocaleString().slice(0, -3);
    // setClaims([...claims, claim]); --- для версии без бэка

    // БЭК (пока без лоадинга и обработки ошибок):
    const body = {
      // appNumber: claim.appNumber, // пока так, в идеале на сервере аналогичным образом
      datetime: claim.datetime,
      firmName: claim.firmName,
      fullname: claim.fullname,
      phone: claim.phone,
      comments: claim.comments,
      ati: claim.phone,
    };

    fetch("http://localhost:4000/api/user", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    loadActualClaims();
  };

  const handleDeleteClaim = id => {
    setEditing(false);
    // setClaims(claims.filter(claim => claim.appNumber !== id)); --- для версии без бэка
  
    // БЭК (пока без лоадинга и обработки ошибок):
    fetch(`http://localhost:4000/api/user/${id}`, {
      method: 'DELETE'
    })

    loadActualClaims();
  };

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

  const handleUpdateClaim = (id, updatedClaim) => {
    setEditing(false)
    // setClaims(claims.map(claim => (claim.appNumber === id ? updatedClaim : claim))) --- для версии без бэка
    console.log(updatedClaim);
  }


  return (
    <main className="container">
      <h1 className="visually-hidden">Система ведения заявок для логистов в автогрузоперевозках</h1>

      <section>
        <h2>Таблица заявок</h2>
        <ClaimsView claims={claims} onEdit={handleSelectClaim} onDelete={handleDeleteClaim} />
      </section>

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
