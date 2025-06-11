import { Context, Telegraf } from "telegraf";
import "dotenv/config";

const BOT_TOKEN = process.env.BOT_TOKEN as string;
const bot = new Telegraf(BOT_TOKEN);

// Функция безопасного ответа на сообщение
async function safeReply(ctx: Context, text: string): Promise<void> {
  try {
    await ctx.reply(text);
  } catch (err: any) {
    if (
      err.response?.statusCode === 403 ||
      err.description?.includes("bot was kicked")
    ) {
      console.warn("Бот был удалён из группы.");
    } else {
      console.error("Ошибка при отправке сообщения:", err);
    }
  }
}

bot.command("start", async (ctx) => {
  const telegramId = ctx.from?.id;
  const firstName = ctx.from?.first_name || "пользователь";

  const message = `
👋 Привет, ${firstName}!

Этот бот будет присылать тебе напоминания о событиях, в которых ты участвуешь.

🔐 Чтобы получать уведомления:
1. Скопируй свой Telegram ID: \`${telegramId}\`
2. Перейди на сайт и вставь его в настройках профиля (в поле "Telegram ID").

После этого ты начнёшь получать уведомления за 1 час до начала событий. 🎉
`;

  await safeReply(ctx, message);
});

// Запуск бота
bot.launch();
console.log("Бот запущен");
