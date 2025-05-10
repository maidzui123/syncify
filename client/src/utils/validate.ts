import {object, string, InferType, ref } from 'yup';
import i18n from '@/configs/locale/i18n'

export const signInSchema = object({
    email: string()
        .required(i18n.t("error:require_email"))
        .email(i18n.t("error:invalid_email")),
    password: string()
        .required(i18n.t("error:require_password"))
        .min(8, i18n.t("error:password_at_least_8"))
        .matches(/[A-Z]/, i18n.t('error:password_at_least_1_upcase'))
        .matches(/[1-9]/, i18n.t('error:password_at_least_1_number'))
        .matches(/[@#$%^&*!.]/, i18n.t('error:password_at_least_1_special_characters'))
})

export const signUpSchema = signInSchema.shape({
    username: string()
        .required(i18n.t("error:require_username"))
        .max(50, i18n.t("error:username_too_long")),
    confirmPassword: string()
        .required(i18n.t("error:require_confirm_password"))
        .min(8, i18n.t("error:password_at_least_8"))
        .matches(/[A-Z]/, i18n.t('error:password_at_least_1_upcase'))
        .matches(/[1-9]/, i18n.t('error:password_at_least_1_number'))
        .matches(/[@#$%^&*!.]/, i18n.t('error:password_at_least_1_special_characters'))
        .oneOf([ref('password')], i18n.t('error:confirm_password_incorrect'))
})

export const forgetPasswordSchema = object({
    email: string()
        .required(i18n.t("error:require_email"))
        .email(i18n.t("error:invalid_email"))
})

export const resetPasswordSchema = object({
    password: string()
        .required(i18n.t("error:require_password"))
        .min(8, i18n.t("error:password_at_least_8"))
        .matches(/[A-Z]/, i18n.t('error:password_at_least_1_upcase'))
        .matches(/[1-9]/, i18n.t('error:password_at_least_1_number'))
        .matches(/[@#$%^&*!.]/, i18n.t('error:password_at_least_1_special_characters')),
    confirmPassword: string()
        .required(i18n.t("error:require_confirm_password"))
        .min(8, i18n.t("error:password_at_least_8"))
        .matches(/[A-Z]/, i18n.t('error:password_at_least_1_upcase'))
        .matches(/[1-9]/, i18n.t('error:password_at_least_1_number'))
        .matches(/[@#$%^&*!.]/, i18n.t('error:password_at_least_1_special_characters'))
        .oneOf([ref('password')], i18n.t('error:confirm_password_incorrect'))
})

export const userInfoSchema = object({
    displayName: string().required(i18n.t("error:require_display_name")).max(50),
    tag: string().max(4),
    date: string().required(i18n.t("error:require_date_of_birth")),
    month: string().required(i18n.t("error:require_month_of_birth")),
    year: string().required(i18n.t("error:require_year_of_birth")),
    gender: string().required(i18n.t("error:require_gender")),
    country: string().required(i18n.t("error:require_country")),
    tel: string().required(i18n.t("error:require_tel")).matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, i18n.t("error:require_tel")),
})

export const changePasswordSchema = object({
    currentPassword: string()
        .required(i18n.t("error:require_password"))
        .min(8, i18n.t("error:password_at_least_8"))
        .matches(/[A-Z]/, i18n.t('error:password_at_least_1_upcase'))
        .matches(/[1-9]/, i18n.t('error:password_at_least_1_number'))
        .matches(/[@#$%^&*!.]/, i18n.t('error:password_at_least_1_special_characters')),
    newPassword: string()
        .required(i18n.t("error:require_password"))
        .min(8, i18n.t("error:password_at_least_8"))
        .matches(/[A-Z]/, i18n.t('error:password_at_least_1_upcase'))
        .matches(/[1-9]/, i18n.t('error:password_at_least_1_number'))
        .matches(/[@#$%^&*!.]/, i18n.t('error:password_at_least_1_special_characters'))
        .notOneOf([ref('currentPassword')], i18n.t('error:password_cannot_same')),
    confirmPassword: string()
        .required(i18n.t("error:require_confirm_password"))
        .oneOf([ref('newPassword')], i18n.t('error:confirm_password_incorrect'))
})

export type signInDef = InferType<typeof signInSchema>
export type signUpDef = InferType<typeof signUpSchema>
export type userInfoDef = InferType<typeof userInfoSchema>
export type changePasswordDef = InferType<typeof changePasswordSchema>