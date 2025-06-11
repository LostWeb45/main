export const ForgotPassword = ({ code }: { code: string }) => `
  <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f9f9f9;">
    <div style="max-width: 500px; margin: auto; background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
      <h2 style="color: #333;">Восстановление пароля</h2>
      <p style="font-size: 16px; color: #555;">
        Вы запросили восстановление пароля на сайте <strong>LinGo</strong>.
      </p>
      <p style="font-size: 16px; color: #555;">
        Нажмите на кнопку для перехода на форму восстановления:
      </p>
      <div style="font-size: 32px; font-weight: bold; color: #000; text-align: center; letter-spacing: 4px; margin: 24px 0;">
        ${code}
      </div>
      <div style="text-align: center;">
      <a
          href="http://82.202.128.170:3000/reset-password?code=${code}"
          style="
            display: inline-block;
            background-color: #3A5F9D;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 24px;
            font-size: 16px;
            transition: background-color 0.2s ease-in-out;
            text-align: center;
          "
        >
          Восстановить пароль
        </a>
      </div>
      <p style="font-size: 14px; color: #999;">Если вы не запрашивали восстановление, просто проигнорируйте это письмо.</p>
    </div>
  </div>
`;
