import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface Props {
  className?: string;
}

const TostsParams: React.FC<Props> = ({ className }) => {
  const searParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    let toastMessage = "";

    if (searParams.has("logined")) {
      toastMessage = "Вы успешно вошли в аккаунт";
    }

    if (searParams.has("verified")) {
      toastMessage = "Почта успешно подтверждена";
    }

    if (toastMessage) {
      setTimeout(() => {
        router.replace("/");
        toast.success(toastMessage, {
          duration: 3000,
        });
      });
    }
  }, [router, searParams]);

  return null;
};

export default TostsParams;
