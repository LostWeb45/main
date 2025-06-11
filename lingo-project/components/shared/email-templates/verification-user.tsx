interface Props {
  code: string;
}

export function VerificationUserTemplate({ code }: Props) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f9f9f9;">
      <div style="max-width: 500px; margin: auto; background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
        <h2 style="color: #333;">Подтверждение почты</h2>
        <p style="font-size: 16px; color: #555;">
          Вы зарегистрировались на сайте <strong>LinGo</strong>.
        </p>
        <p style="font-size: 16px; color: #555;">
          Введите этот код на сайте для подтверждения почты:
        </p>
        <div style="font-size: 32px; font-weight: bold; color: #000; text-align: center; letter-spacing: 4px; margin: 24px 0;">
          ${code}
        </div>
        <div style="text-align: center;">
          <a
          href="http://localhost:3000/api/auth/verify?code=${code}"
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
          Подтвердить почту
        </a>
        </div>
        <p style="font-size: 14px; color: #999;">Если вы не запрашивали подтверждение, просто проигнорируйте это письмо.</p>
      </div>
    </div>
  `;
}
