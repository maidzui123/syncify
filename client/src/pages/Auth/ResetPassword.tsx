import Lottie from "lottie-react";
import Resources from "@/constants/resource.ts";
import { motion } from "motion/react";
import { Button, Input } from "@/components/ui";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { AUTH_URL } from "@/constants/api.ts";
import { useDispatch} from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { setLoading } from "@/redux/reducers/loadingReducer";
import { useForm, SubmitHandler } from "react-hook-form";
import { resetPasswordDef } from "@/constants/types/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/utils/validate";
import { Label } from "@/components/ui";

type resetPasswordProps = {
  onDone: () => void;
  handleBack: () => void;
};

const ResetPassword = (props: resetPasswordProps) => {
  const { onDone, handleBack } = props;

  const { toast } = useToast();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordDef>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const handleResetPassword: SubmitHandler<resetPasswordDef> = (data) => {
    dispatch(setLoading(true));

    axios
      .post(AUTH_URL.RESET_PASSWORD_URL, {
        password: data.password,
      })
      .then(
        (res) => {
          dispatch(setLoading(false));
          if (res.status == 200) {
            onDone();
            toast({
              title: t("toast:reset_password_success"),
            });
          }
        },
        (res) => {
          toast({
            title: res.message,
          });
        }
      );
  };

  return (
    <motion.form
      className="flex flex-col items-center relative pb-8 pt-4 px-16 rounded-xl bg-white h-[500px] aspect-[1.5] shadow shadow-gray-500"
      initial={{ x: 999, opacity: 0 }}
      onSubmit={handleSubmit(handleResetPassword)}
      animate={{ x: 0, opacity: 1, transition: { duration: 0.6 } }}
      exit={{ x: -999, opacity: 0, transition: { duration: 0.6 } }}
    >
      <div
        className="absolute top-3 left-3 p-3 rounded-2xl cursor-pointer hover:bg-gray-300"
        onClick={handleBack}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-corner-down-left"
        >
          <polyline points="9 10 4 15 9 20" />
          <path d="M20 4v7a4 4 0 0 1-4 4H4" />
        </svg>
      </div>
      <div className="w-[120px] mb-4">
        <Lottie animationData={Resources.lottie.resetPass} />
      </div>
      <h3 className="font-bold text-2xl">{t("title:reset_password")}</h3>
      <div className="mt-4 w-full">
        <Label className="mb-1" htmlFor="password">
          {t("label:new_password")}
        </Label>
        <Input
          {...register("password")}
          id="password"
          type="password"
          required
        />
        <p className="text-red-500 text-xs h-4 align-middle">
          {errors.password?.message}
        </p>
      </div>
      <div className="mt-2 w-full">
        <Label className="mb-1" htmlFor="confirmPassword">
          {t("label:confirm_password")}
        </Label>
        <Input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
        />
        <p className="text-red-500 text-xs h-4 align-middle">
          {errors.confirmPassword?.message}
        </p>
      </div>
      <Button className="w-full mt-4" type="submit">
        {t("button:confirm")}
      </Button>
    </motion.form>
  );
};

export default ResetPassword;
