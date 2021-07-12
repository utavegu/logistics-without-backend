import React, { useState } from 'react';
import ClaimModel from './models/ClaimModel';
import AddClaimForm from './components/AddClaimForm';
import EditClaimForm from './components/EditClaimForm';
import ClaimsView from './components/ClaimsView';


/*
ISSUES
  1) Секшинам классы
*/

let i = 1;

const claimsMocks = [
  new ClaimModel(i++, "12.07.2021, 14:32", "Яблоки Алисы", "Вася", "8-999-777-66-33", "Склонен уходить в запой. Не очень надёжен", "12345"),
  new ClaimModel(i++, "12.07.2021, 15:12", "Стулья на дом", "Юра", "8-999-773-61-23", "Юра - нормальный пацан. Чоткий. Да и стулья у заказчика не жидкие. Сами берём оптом.", "23141"),
  new ClaimModel(i++, "13.07.2021, 16:40", "Шпалы и рельсы", "Аркадий Вениаминович", "8-999-996-61-23", "Сотрудничаем 20 лет. Без нареканий.", "4151"),
  new ClaimModel(i++, "13.07.2021, 17:15", "Ураний и Плутоний", "Транс Радиал Логистик Партнерс", "8-921-999-12-23", "Нужен грузовик со свинцовой обивкой и конвоем", "67313"),
  new ClaimModel(i++, "14.07.2021, 11:24", "Бетон оптом", "Семён", "8-912-777-88-77", "Нужна бетономешалка", "81214"),
];

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

  const [claims, setClaims] = useState(claimsMocks);
  const [editing, setEditing] = useState(false);
  const [currentClaim, setCurrentClaim] = useState(initialFormState);

  const handleAddClaim = claim => {
    claim.appNumber = i++;
    claim.datetime = new Date().toLocaleString().slice(0, -3);
    setClaims([...claims, claim]);
  };

  const handleDeleteClaim = id => {
    setEditing(false);
    setClaims(claims.filter(claim => claim.appNumber !== id));
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
    setClaims(claims.map(claim => (claim.appNumber === id ? updatedClaim : claim)))
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
