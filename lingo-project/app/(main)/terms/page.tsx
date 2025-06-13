import React from "react";
import Head from "next/head";
import { Container } from "@/components/shared";

const AgreementPage: React.FC = () => {
  return (
    <Container>
      <title>Пользовательское соглашение — LinGo</title>
      <meta
        name="description"
        content="Пользовательское соглашение сервиса LinGo"
      />

      <h1 className="text-4xl font-bold mb-6 border-b-4 border-[#3A5F9D] pb-2">
        Пользовательское соглашение
      </h1>
      <section className="space-y-6 text-lg leading-relaxed">
        <p>
          Добро пожаловать в LinGo! Используя наш сервис, вы соглашаетесь с
          условиями данного соглашения.
        </p>
        <div>
          <h2 className="text-2xl font-semibold mb-2">1. Общие положения</h2>
          <p>
            LinGo — сервис для организации и поиска досуга вместе. Пользователь
            обязуется соблюдать правила, описанные в данном соглашении.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            2. Использование сервиса
          </h2>
          <p>
            Вы можете создавать события, участвовать в мероприятиях,
            переписываться в чате и использовать другие функции сервиса в рамках
            законодательства.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            3. Модерация мероприятий
          </h2>
          <p>
            Все создаваемые мероприятия проходят модерацию администраторами.
            Мероприятия могут быть отредактированы, одобрены или отклонены.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">4. Уведомления</h2>
          <p>
            Вы можете получать уведомления через нашего Telegram-бота о начале
            переписки и других важных событиях.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">5. Конфиденциальность</h2>
          <p>
            Мы заботимся о вашей конфиденциальности и обрабатываем ваши данные в
            соответствии с политикой конфиденциальности.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">6. Ответственность</h2>
          <p>
            Пользователь несет ответственность за соблюдение правил и
            использование сервиса согласно законодательству.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            7. Изменения соглашения
          </h2>
          <p>
            LinGo оставляет за собой право изменять условия данного соглашения.
            Изменения публикуются на этой странице.
          </p>
        </div>
        <p>Спасибо, что выбираете LinGo!</p>
      </section>
    </Container>
  );
};

export default AgreementPage;
