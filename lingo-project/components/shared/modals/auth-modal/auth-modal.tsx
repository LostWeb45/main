import { Button } from "@/components/ui";
import { DialogContent, Dialog } from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import React from "react";
import { LoginForm } from "./forms/login-form";
import { RegisterForm } from "./forms/register-form";
import { ForgotPasswordForm } from "./forms/forgot-password";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
  const [type, setType] = React.useState<"login" | "register" | "forgot">(
    "login"
  );

  const onSwitchType = (newType?: "login" | "register" | "forgot") => {
    if (newType) {
      setType(newType);
    } else {
      setType(type === "login" ? "register" : "login");
    }
  };

  const handleClose = () => {
    onClose();
    setType("login");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
     <DialogContent className="w-[550px] bg-white sm:p-10">
        {type === "login" && <LoginForm onClose={handleClose} />}
        {type === "register" && <RegisterForm onClose={handleClose} />}
        {type === "forgot" && <ForgotPasswordForm />}

        <hr />

        <div className="flex gap-2">
          <Button
            className="gap-2 h-12 flex-1"
            variant={"ghost"}
            onClick={() =>
              signIn("yandex", {
                callbackUrl: "/?logined",
                redirect: true,
              })
            }
          >
            <img
              src="/images/Yandex_icon.svg"
              className="w-[35px] h-[35px]"
              alt="yandex"
            />
          </Button>
          <Button
            className="gap-2 h-12 flex-1"
            variant={"ghost"}
            onClick={() =>
              signIn("vk", {
                callbackUrl: "http://localhost:3000",
                redirect: true,
              })
            }
          >
            <img src="/images/vk.svg" alt="vk" className="w-[30px] h-[30px]" />
          </Button>
        </div>

        {type !== "forgot" ? (
          <div className="flex flex-col gap-2 ">
            <Button
              variant={"outline"}
              onClick={() => onSwitchType()}
              type="button"
              className="h-12"
            >
              <p className="text-[#667198]">
                {type === "login" ? "Регистрация" : "Войти"}
              </p>
            </Button>

            {type === "login" && (
              <Button
                variant={"secondary"}
                onClick={() => onSwitchType("forgot")}
                className="text-md h-12 mt-2 bg-[#f5f4f7] text-[#2b5696] underline-offset-2 cursor-pointer "
              >
                Забыли пароль?
              </Button>
            )}
          </div>
        ) : (
          <Button
            variant={"outline"}
            onClick={() => onSwitchType("login")}
            type="button"
            className="h-12"
          >
            <p className="text-[#667198]">Войти</p>
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
