import {useState, useRef, ChangeEvent} from 'react';
import {motion} from "motion/react";
import AvatarEditor from 'react-avatar-editor'
import Resources from "@/constants/resource";
import {Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button, Slider} from "@/components/ui";
import {SubmitHandler, useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {userInfoDef, userInfoSchema} from "@/utils/validate";
import i18n, { t } from 'i18next'
import dayjs from "dayjs";
import {countriesVietnamese, countriesEnglish} from "@/constants/countries";
import {monthsEnglish, monthsVietnamese} from "@/constants/datetime";
// import {useToast} from "@/hooks/use-toast"
import {Modal} from '@/components'
import axios from 'axios';
import { MEDIA_URL, PROFILE_URL} from "@/constants/api";
import {convertBlobToFile} from "@/utils/convert";
import {setNewUser, setUserInfo} from "@/redux/reducers/authReducer";
import { useDispatch } from "react-redux";
import {setLoading} from "@/redux/reducers/loadingReducer";

type newUserInfoProps = {
    handleBack: () => void,
}

const NewUserInfo = (props: newUserInfoProps) => {

    const {handleBack} = props;

    const [image, setImage] = useState<string | File>(Resources.avatar.default);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
    const [imageScale, setImageScale] = useState<number[]>([10])
    const [cldLink, setCldLink] = useState<string>()

    const fileInputRef = useRef<HTMLInputElement>(null)
    const cropRef = useRef(null)
    const debounceTimeOut = useRef<NodeJS.Timeout | null>(null)

    const dispatch = useDispatch();

    const {register, handleSubmit, formState: {errors}, control} = useForm<userInfoDef>({
        resolver: yupResolver(userInfoSchema)
    });

    const handleSubmitUserInfo: SubmitHandler<userInfoDef> = (data) => {
        dispatch(setLoading(true))
        axios.patch(PROFILE_URL.UPDATE_PROFILE_URL, {
            dob: `${data.year}-${data.month}-${data.date}`,
            country: data.country,
            gender: data.gender,
            avatar: cldLink,
            displayName: data.displayName,
            tel: data.tel
        }).then(res => {
            dispatch(setLoading(false))
            if(res.status == 200){
                dispatch(setUserInfo(res.data))
                dispatch(setNewUser(false))
            }
        })
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setImage(URL.createObjectURL(e.target.files[0]));
            setEditModalOpen(true);
        }
    };

    const handleSave = async () => {
        if (cropRef.current) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            const dataUrl = cropRef.current.getImage().toDataURL();
            setImage(dataUrl);
            setEditModalOpen(false)
            const result = await fetch(dataUrl);
            const blob = await result.blob();
            const imageFile = convertBlobToFile(blob)
            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("type", "image")
            formData.append("folderName", 'avatar')
            axios.post(MEDIA_URL.UPDATE_MEDIA_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                setCldLink(res.data.url)
            }, err => {
                console.error(err)
            })
        }
    };

    const handleChangeImageSize = (value: number[]) => {
        if(debounceTimeOut.current){
            clearTimeout(debounceTimeOut.current);
        }
        debounceTimeOut.current = setTimeout(() => {
            setImageScale(value)
        }, 50);
    }

    return <motion.div
        className="flex flex-col items-center relative pb-8 pt-4 px-10 rounded-xl bg-white h-[420px] aspect-[1.3] shadow shadow-gray-500"
        initial={{x: 999, opacity: 0}} animate={{x: 0, opacity: 1, transition: {duration: .6}}}
        exit={{x: -999, opacity: 0, transition: {duration: .6}}}
    >
        <div className='absolute top-3 left-3 p-3 rounded-2xl cursor-pointer hover:bg-gray-300'
             onClick={handleBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="lucide lucide-corner-down-left">
                <polyline points="9 10 4 15 9 20"/>
                <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
            </svg>
        </div>
        <div className="absolute top-[-100px] left-[calc(50% - 100px) rounded-full overflow-hidden cursor-pointer group border-4 border-blue-400 bg-white">
            <img className="w-[180px] h-[180px]"
                 src={image as string} alt=""/>
            <div className='w-full h-full absolute top-0 left-0 bg-black opacity-0 group-hover:opacity-60'/>
            <div
                className='w-full h-full flex absolute top-0 left-0 justify-center items-center opacity-0 group-hover:opacity-100'
                onClick={() => fileInputRef.current!.click()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                     stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className="lucide lucide-upload">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" x2="12" y1="3" y2="15"/>
                </svg>
            </div>
            <input className='hidden' ref={fileInputRef} type='file' accept="image/*" onChange={handleImageChange}/>
        </div>
        <form className="w-full pt-[112px] grid grid-cols-4 grid-rows-3 gap-3" onSubmit={handleSubmit(handleSubmitUserInfo)}>
            <div className='col-span-3 row-span-1'>
                <Label className='mb-1' htmlFor='displayName'>{t("label:display_name")}</Label>
                <Input {...register('displayName')} id='displayName' type='text' className={errors.displayName ? "border-red-500" : undefined} max={50}/>
            </div>
            <div className='col-span-1 row-span-1'>
                <Label className='mb-1' htmlFor='tag'>#Tag</Label>
                <Input {...register('tag')} id='tag' type='text' className={errors.tag ? "border-red-500" : undefined} max={4} placeholder={`(${t("placeholder:optional")})`}/>
            </div>
            <div className='col-span-1 row-span-1'>
                <Label className='mb-1'>{t("label:date_of_birth")}</Label>
                <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={errors.date ? "border-red-500 w-full" : "w-full"}>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {Array(31).fill(0).map((_, index) => {
                                    return <SelectItem key={index} value={String(index + 1)}>{index + 1}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className='flex col-span-1 row-span-1 items-end'>
                <Controller
                    name="month"
                    control={control}
                    render={({ field }) => (
                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={errors.month ? "border-red-500 w-full" : "w-full"}>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {(i18n.language == 'vi' ? monthsVietnamese : monthsEnglish).map(((item,index) => {
                                    return <SelectItem key={index} value={String(index + 1)}>{item}</SelectItem>
                                }))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className='flex col-span-1 row-span-1 items-end'>
                <Controller
                    name='year'
                    control={control}
                    render={({ field }) => (
                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={errors.year ? "border-red-500 w-full" : "w-full"}>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {Array(100).fill(0).map((_, index) => {
                                    const year = (dayjs(new Date()).year() - index).toString()
                                    return <SelectItem key={index} value={year}>{year}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className='col-span-1 row-span-1'>
                <Label className='mb-1' htmlFor='username'>{t("label:gender")}</Label>
                <Controller
                    name='gender'
                    control={control}
                    render={({ field }) => (
                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={errors.gender ? "border-red-500 w-full" : "w-full"}>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">{t("label:male")}</SelectItem>
                                <SelectItem value="Female">{t("label:female")}</SelectItem>
                                <SelectItem value="Other">{t("label:other")}</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className='col-span-2 row-span-1 items-end'>
                <Label className='mb-1' htmlFor='tel'>{t("label:tel")}</Label>
                <Input {...register('tel')} id='tel' type='tel' className={errors.tel ? "border-red-500" : ""}/>
            </div>
            <div className='col-span-2 row-span-1'>
                <Label className='mb-1' htmlFor='username'>{t("label:country")}</Label>
                <Controller
                    name='country'
                    control={control}
                    render={({ field }) => (
                        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={errors.country ? "border-red-500 w-full" : "w-full"}>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {(i18n.language === "vi" ? countriesVietnamese : countriesEnglish).map((item, index) => {
                                    return <SelectItem key={index} value={item.code}>{item.name}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <Button type='submit' className='order-last col-span-4 justify-self-end'>{t("button:complete")}</Button>
        </form>
        <Modal width={480} open={editModalOpen} onClose={() => setEditModalOpen(false)} showHeader showBottom renderBottom={
            () => <Button onClick={handleSave}>{t("button:upload")}</Button>
        }>
            <AvatarEditor
                ref={cropRef}
                image={image}
                style={{ width: '400px', height: '400px' }}
                border={50}
                borderRadius={999}
                color={[0, 0, 0, 0.72]}
                scale={imageScale[0] / 10}
                rotate={0}
            />
            <Slider className='my-6 w-[400px]' defaultValue={[10]} max={50} min={10} step={1} onValueChange={handleChangeImageSize}/>
        </Modal>
    </motion.div>
}

export default NewUserInfo;