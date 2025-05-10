import {
  Button,
  Input,
  Label,
  // Select,
  // SelectContent,
  // SelectItem,
  // SelectTrigger,
  // SelectValue,
  // Switch
} from "@/components/ui";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks";
import { AUTH_SCREEN, LOGIN_TYPE, REGISTER_TYPE } from "@/constants/enum/auth";
import { signInSchema, signUpSchema } from "@/utils/validate";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Resources from "@/constants/resource";
import { signInDef, signUpDef } from "@/constants/types/auth";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import { useToast } from "@/hooks/use-toast";
import OTPForm from "@/pages/Auth/OTPForm";
import ForgetPassword from "@/pages/Auth/ForgetPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import {useDispatch, useSelector} from "react-redux";
import { setAuthData } from "@/redux/reducers/authReducer";
import NewUserInfo from "@/pages/Auth/NewUserInfo";
import { setLoading } from "@/redux/reducers/loadingReducer";
import {RootState} from "@/redux/store";
// import {localeType, setLocale} from "@/redux/reducers/localeReducer";
// import {RootState} from "@/redux/store";

type signInProps = {
  changeForm: () => void;
  toForgotPasswordScreen: () => void;
};

type signUpProps = {
  changeForm: () => void;
  toOtpScreen: () => void;
};

const SignInForm = (props: signInProps) => {
  const { changeForm, toForgotPasswordScreen } = props;

  const { toast } = useToast();
  const { t } = useTranslation();
  const { logIn } = useAuth();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signInDef>({
    resolver: yupResolver(signInSchema),
  });

  const handleSignIn: SubmitHandler<signInDef> = (data) => {
    dispatch(setLoading(true));
    logIn(LOGIN_TYPE.EMAIL, data).then(() => {
      dispatch(setLoading(false));
    });
  };

  const handleSignInGG = async () => {
    dispatch(setLoading(true));
    const res = await logIn(LOGIN_TYPE.GOOGLE);
    dispatch(setLoading(false));
    if (res) {
      toast({
        title: t("toast:sign_in_success"),
      });
    } else {
      toast({
        title: t("toast:sign_in_fail"),
      });
    }
  };

  return (
    <motion.form
      className="flex-1 h-full py-20 px-16"
      onSubmit={handleSubmit(handleSignIn)}
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { duration: 1 } }}
    >
      <h1 className="text-3xl font-bold">{t("title:sign_in")}</h1>
      <div className="mt-4">
        <Label className="mb-1" htmlFor="email">
          Email
        </Label>
        <Input {...register("email")} id="email" type="email" required />
        <p className="text-red-500 text-xs h-4 align-middle">
          {errors.email?.message}
        </p>
      </div>
      <div className="mt-2">
        <Label className="mb-1" htmlFor="password">
          {t("label:password")}
        </Label>
        <Input {...register("password")} id="password" type="password" />
        <p className="text-red-500 text-xs h-4 align-middle">
          {errors.password?.message}
        </p>
      </div>
      <div className="flex justify-end">
        <Link
          to=""
          onClick={toForgotPasswordScreen}
          className="p-0 text-sm text-blue-400 hover:text-red-600"
        >
          {t("label:forgot_password") + "?"}
        </Link>
      </div>
      <Button className="w-full mt-4" type="submit">
        {t("button:sign_in")}
      </Button>
      <div className="mt-4 flex flex-row items-center">
        <hr className="flex-1" />
        <div className="mx-4 align-middle leading-none text-sm">
          {t("label:or")}
        </div>
        <hr className="flex-1" />
      </div>
      <Button
        variant="outline"
        className="w-full mt-4 "
        type="button"
        onClick={handleSignInGG}
      >
        <img width={24} src={Resources.icon.google} alt="" />
        <p>{t("button:sign_in_with_gg")}</p>
      </Button>
      <div className="flex justify-center items-center">
        <p className="mr-1 text-sm">{t("label:dont_have_account") + "?"}</p>
        <Button
          className="p-0 text-blue-400 hover:text-red-600 text-sm"
          variant="link"
          onClick={changeForm}
        >
          {t("label:sign_up")}
        </Button>
      </div>
    </motion.form>
  );
};

const SignUpForm = (props: signUpProps) => {
  const { changeForm, toOtpScreen } = props;

  const { t } = useTranslation();
  const { signUp } = useAuth();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signUpDef>({
    resolver: yupResolver(signUpSchema),
  });

  const handleSignUp: SubmitHandler<signUpDef> = async (data) => {
    dispatch(setLoading(true));
    const res = await signUp(REGISTER_TYPE.EMAIL, data);
    dispatch(setLoading(false));
    if (res) {
      dispatch(
        setAuthData({
          email: data.email,
        })
      );
      toOtpScreen();
    }
  };

  const handleSignUpGG = async () => {
    await signUp(REGISTER_TYPE.GOOGLE);
  };

  return (
    <motion.form
      className="flex-1 h-full py-8 px-16"
      onSubmit={handleSubmit(handleSignUp)}
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { duration: 1 } }}
    >
      <h1 className="text-3xl font-bold">{t("title:sign_up")}</h1>
      <div className="mt-4">
        <Label className="mb-1" htmlFor="username">
          {t("label:username")}
        </Label>
        <Input {...register("username")} id="username" type="text" required />
        <p className="text-red-500 text-xs h-4 align-middle">
          {errors.username?.message}
        </p>
      </div>
      <div className="mt-1">
        <Label className="mb-1" htmlFor="email">
          Email
        </Label>
        <Input {...register("email")} id="email" type="email" required />
        <p className="text-red-500 text-xs h-4 align-middle">
          {errors.email?.message}
        </p>
      </div>
      <div className="mt-1">
        <Label className="mb-1" htmlFor="password">
          {t("label:password")}
        </Label>
        <Input {...register("password")} id="password" type="password" />
        <p className="text-red-500 text-xs h-4 align-middle">
          {errors.password?.message}
        </p>
      </div>
      <div className="mt-1">
        <Label className="mb-1" htmlFor="confirm_password">
          {t("label:confirm_password")}
        </Label>
        <Input
          {...register("confirmPassword")}
          id="confirm_password"
          type="password"
        />
        <p className="text-red-500 text-xs h-4 align-middle">
          {errors.confirmPassword?.message}
        </p>
      </div>
      <Button className="w-full mt-2" type="submit">
        {t("button:sign_up")}
      </Button>
      <div className="mt-4 flex flex-row items-center">
        <hr className="flex-1" />
        <div className="mx-4 align-middle leading-none text-sm">
          {t("label:or")}
        </div>
        <hr className="flex-1" />
      </div>
      <Button
        variant="outline"
        className="w-full mt-4 "
        type="button"
        onClick={handleSignUpGG}
      >
        <img width={24} src={Resources.icon.google} alt="" />
        <p>{t("button:sign_up_with_gg")}</p>
      </Button>
      <div className="flex justify-center items-center">
        <p className="mr-1 text-sm">{t("label:already_have_account") + "?"}</p>
        <Button
          className="p-0 hover:text-red-600 text-sm"
          variant="link"
          onClick={changeForm}
        >
          {t("label:sign_in")}
        </Button>
      </div>
    </motion.form>
  );
};

const AuthPage = () => {
  const [formType, setFormType] = useState<string>("sign-in");
  const [isForgetPw, setIsForgetPw] = useState(false);
  const [newUserStep, setNewUserStep] = useState<AUTH_SCREEN>(AUTH_SCREEN.AUTH);
  const locale = useSelector((state: RootState) => state.locale.value)
  // const dispatch = useDispatch()

  // const handleChangeLocale = (locale: localeType) => {
  //     dispatch(setLocale(locale))
  // }

  return (
    <div
      className="flex w-screen h-screen justify-center items-center bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${Resources.backgrounds.LoginBG1})` }}
    >
      {/*<div className='absolute top-6 right-8 flex w-[180px] justify-between items-center'>*/}
      {/*    <Select value={locale as unknown as string} onValueChange={(val) => handleChangeLocale(val as unknown as localeType)}>*/}
      {/*        <SelectTrigger className="w-[120px]">*/}
      {/*            <SelectValue/>*/}
      {/*        </SelectTrigger>*/}
      {/*        <SelectContent>*/}
      {/*            <SelectItem value='vi'>Vietnamese</SelectItem>*/}
      {/*            <SelectItem value="en">English</SelectItem>*/}
      {/*        </SelectContent>*/}
      {/*    </Select>*/}
      {/*    <Switch/>*/}
      {/*</div>*/}
      <AnimatePresence>
        {newUserStep == AUTH_SCREEN.AUTH && (
          <motion.div
            className="flex flex-row rounded-xl bg-white h-[580px] aspect-[.85] lg:aspect-[1.7] shadow shadow-gray-500"
            initial={false}
            animate={{ x: 0, opacity: 1, transition: { duration: 1 } }}
            exit={{ x: -999, opacity: 0, transition: { duration: 1 } }}
          >
            <div
              className="w-1/2 h-full rounded-xl hidden lg:flex justify-center items-center"
              style={{
                backgroundImage: `url(${Resources.backgrounds.LoginBG})`,
              }}
            >
              <div className="flex flex-col items-center">
                <img
                  className="w-1/2 aspect-square bg-contain"
                  src={Resources.logo.sincifyLogo}
                  alt=""
                />
                <h1
                  className="text-4xl font-bold mt-2 bg-clip-text text-transparent"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(71,100,227,1) 0%, rgba(82,203,212,1) 100%)",
                    backgroundClip: "text",
                  }}
                >
                  Syncify
                </h1>
              </div>
            </div>
            {formType == "sign-in" ? (
              <SignInForm
                changeForm={() => setFormType("sign-up")}
                toForgotPasswordScreen={() =>
                  setNewUserStep(AUTH_SCREEN.FORGET_PASS)
                }
              />
            ) : (
              <SignUpForm
                changeForm={() => setFormType("sign-in")}
                toOtpScreen={() => setNewUserStep(AUTH_SCREEN.OTP)}
              />
            )}
          </motion.div>
        )}
        {newUserStep == AUTH_SCREEN.OTP && (
          <OTPForm
            handleBack={() => setNewUserStep(AUTH_SCREEN.AUTH)}
            onDone={() =>
              !isForgetPw
                ? setNewUserStep(AUTH_SCREEN.INFO)
                : setNewUserStep(AUTH_SCREEN.RESET_PASS)
            }
          />
        )}
        {newUserStep == AUTH_SCREEN.INFO && (
          <NewUserInfo handleBack={() => setNewUserStep(AUTH_SCREEN.AUTH)} />
        )}
        {newUserStep == AUTH_SCREEN.FORGET_PASS && (
          <ForgetPassword
            handleBack={() => setNewUserStep(AUTH_SCREEN.AUTH)}
            onDone={() => {
              setNewUserStep(AUTH_SCREEN.OTP);
              setIsForgetPw(true);
            }}
          />
        )}

        {newUserStep == AUTH_SCREEN.RESET_PASS && (
          <ResetPassword
            onDone={() => {
              setNewUserStep(AUTH_SCREEN.AUTH);
            }}
            handleBack={() => setNewUserStep(AUTH_SCREEN.AUTH)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;
