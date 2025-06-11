"use client";

import { Container } from "@/components/shared";
import { useState } from "react";

function LinkGroupToEvent({ eventId = 9 }: { eventId: number }) {
  const [chatId, setChatId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/telegram/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, eventId }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Группа успешно связана с событием!");
      } else {
        setStatus("Ошибка при связывании группы.");
      }
    } catch (err) {
      setStatus("Ошибка сети.");
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <label>
          Введите ID группы Telegram:
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            required
          />
        </label>
        <button type="submit">Связать группу с событием</button>
        {status && <p>{status}</p>}
      </form>
    </Container>
  );
}

export default LinkGroupToEvent;
