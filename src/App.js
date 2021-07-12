import React, { useState } from 'react';
import AddClaimForm from './components/AddClaimForm';
import ClaimModel from './models/ClaimModel';

let i = 1;
const claimsMocks = [
  new ClaimModel(i++, "12.07.2021, 14:32", "Яблоки Алисы", "Вася", "8-999-777-66-33", "Склонен уходить в запой. Не очень надёжен", "12345"),
  new ClaimModel(i++, "12.07.2021, 15:12", "Стулья на дом", "Юра", "8-999-773-61-23", "Юра - нормальный пацан. Чоткий. Да и стулья у заказчика не жидкие. Сами берём оптом.", "23141"),
  new ClaimModel(i++, "13.07.2021, 16:40", "Шпалы и рельсы", "Аркадий Вениаминович", "8-999-996-61-23", "Сотрудничаем 20 лет. Без нареканий.", "4151"),
  new ClaimModel(i++, "13.07.2021, 17:15", "Ураний и Плутоний", "Транс Радиал Логистик Партнерс", "8-921-999-12-23", "Нужен грузовик со свинцовой обивкой и конвоем", "67313"),
  new ClaimModel(i++, "14.07.2021, 11:24", "Бетон оптом", "Семён", "8-912-777-88-77", "Нужна бетономешалка", "81214"),
];

const App = () => {

  const [claims, setClaims] = useState(claimsMocks);

  const handleAddClaim = claim => {
    claim.appNumber = i++;
    claim.datetime = new Date().toLocaleString().slice(0, -3);
    setClaims([...claims, claim]);
  };

  console.log(claims);


  return (
    <main className="container">
      <h1 className="visually-hidden">Система ведения заявок для логистов в автогрузоперевозках</h1>

      <div className="form-place">
        <section>
          <h2>Создать заявку</h2>
          <AddClaimForm onAdd={handleAddClaim} />
        </section>
      </div>

    </main>
  );
}

export default App;
