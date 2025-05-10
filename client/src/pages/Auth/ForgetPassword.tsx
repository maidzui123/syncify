import { LOGIN_TYPE } from "@/constants/enum/auth.ts";
import Lottie from "lottie-react";
import Resources from "@/constants/resource.ts";
import { Countdown, OTP } from "@/components";
import { motion } from "motion/react";
import { Button, Input } from "@/components/ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { AUTH_URL } from "@/constants/api.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store.ts";
import { setAuthData } from "@/redux/reducers/authReducer";
import { useToast } from "@/hooks/use-toast";
import { setLoading } from "@/redux/reducers/loadingReducer";
import { set, SubmitHandler, useForm } from "react-hook-form";
import { forgetPasswordDef } from "@/constants/types/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgetPasswordSchema } from "@/utils/validate";

type ForgetPasswordProps = {
  handleBack: () => void;
  onDone: () => void;
};

const ForgetPassword = (props: ForgetPasswordProps) => {
  const { handleBack, onDone } = props;

  const auth = useSelector((state: RootState) => state.auth.value);
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgetPasswordDef>({
    resolver: yupResolver(forgetPasswordSchema),
  });

  const handleForgetPassword: SubmitHandler<forgetPasswordDef> = (data) => {
    dispatch(setLoading(true));

    axios
      .post(AUTH_URL.SEND_OTP_FOR_RESET_PASS_URL, {
        email: data.email,
      })
      .then(
        (res) => {
          dispatch(setLoading(false));
          if (res.status == 200) {
            dispatch(
              setAuthData({
                email: data.email,
                })
            );
            onDone();
            toast({
              title: t("toast:forget_password_success"),
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
      className="flex flex-col items-center relative pb-8 pt-4 px-16 rounded-xl bg-white h-[360px] aspect-[1.5] shadow shadow-gray-500"
      initial={{ x: 999, opacity: 0 }}
      onSubmit={handleSubmit(handleForgetPassword)}
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
      <div className="w-[120px]">
        <Lottie animationData={Resources.lottie.email} />
      </div>
      <h3 className="font-bold text-2xl mb-4">{t("title:enter_email")}</h3>
      <Input {...register("email")} id="email" type="email" required />
      <p className="text-red-500 text-xs h-4 align-middle">
        {errors.email?.message}
      </p>{" "}
      <div className="w-full flex justify-center">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <Button className="w-full mt-4" type="submit">
            {t("button:confirm")}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default ForgetPassword;
