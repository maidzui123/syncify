import i18n, {t} from "i18next";
import {
    Avatar,
    AvatarFallback,
    AvatarImage, Button,
    Input, Label, Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui";
import {Modal} from "@/components/index.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {monthsEnglish, monthsVietnamese} from "@/constants/datetime";
import dayjs from "dayjs";
import axios from "axios";
import {MEDIA_URL, PROFILE_URL} from "@/constants/api";
import {useToast} from "@/hooks/use-toast";
import {setUserInfo} from "@/redux/reducers/authReducer";
import {convertBlobToFile} from "@/utils/convert";

type editProfileModalProps = {
    open: boolean;
    onClose: () => void;
}

const EditProfileModal = (props: editProfileModalProps) => {

    const { open, onClose } = props;
    const userData = useSelector((state: RootState) => state.auth.value.user)

    const [displayName, setDisplayName] = useState<string>(userData?.displayName ?? "")
    const [date, setDate] = useState<string>(userData?.date ?? "")
    const [month, setMonth] = useState<string>(userData?.month ?? "")
    const [year, setYear] = useState<string>(userData?.year ?? "")
    const [bio, setBio] = useState<string>(userData?.bio ?? "")
    const [cldLink, setCldLink] = useState<string>(userData?.avatar ?? "")

    const fileInputRef = useRef<HTMLInputElement>(null)

    const { toast } = useToast()
    const dispatch = useDispatch()

    useEffect(() => {
        if(userData){
            const converted = dayjs(userData.dob)
            setDate(converted.date().toString())
            setMonth((converted.month() + 1).toString())
            setYear(converted.year().toString())
        }
    }, [userData]);

    const handleUpdateProfile = () => {
        axios.patch(PROFILE_URL.UPDATE_PROFILE_URL, {
            dob: `${year}-${month}-${date}`,
            displayName,
            bio,
            avatar: cldLink,
        }).then(res => {
            if(res.status == 200){
                axios.get(PROFILE_URL.GET_PROFILE_URL).then(res => {
                    if(res.status == 200){
                        dispatch(setUserInfo(res.data))
                    }
                })
                toast({
                    title: t("toast:update_profile_success")
                })
                onClose()
            }else{
                toast({
                    title: t("toast:update_profile_fail")
                })
            }
        })
    }

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            const url = URL.createObjectURL(e.target.files[0])
            const result = await fetch(url);
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

    return <Modal height={620} width={720} open={open} onClose={onClose} showHeader title={t("title:edit_profile")} showBottom style={{ backgroundColor: '#181818', color: 'white' }} renderBottom={() => <Button className='bg-blue-500 text-white' onClick={handleUpdateProfile}>{t("button:save")}</Button>}>
        <div className='flex flex-col items-center w-full'>
            <Avatar className='cursor-pointer h-32 w-32' onClick={() => fileInputRef.current!.click()}>
                <AvatarImage className='bg-white' src={cldLink} alt='avatar'/>
                <AvatarFallback delayMs={600}>?</AvatarFallback>
            </Avatar>
            <div className='w-full grid gap-4 grid-cols-3 grid-rows-3 mt-3 items-end'>
                <div className='flex flex-col col-span-3 row-span-1'>
                    <Label className='mb-1' htmlFor='displayname'>{t("label:display_name")}</Label>
                    <Input id='displayname' type='text' value={displayName} onChange={(e) => setDisplayName(e.target.value)}/>
                </div>
                <div className='flex flex-col col-span-1 row-span-1'>
                    <Label className='mb-1'>{t("label:date_of_birth")}</Label>
                    <Select name='date' value={date} onValueChange={(value) => setDate(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            {Array(31).fill(0).map((_, index) => {
                                return <SelectItem key={index} value={String(index + 1)}>{index + 1}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col col-span-1 row-span-1'>
                    <Select name='month' value={month} onValueChange={(value) => setMonth(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            {(i18n.language == 'vi' ? monthsVietnamese : monthsEnglish).map(((item,index) => {
                                return <SelectItem key={index} value={String(index + 1)}>{item}</SelectItem>
                            }))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col col-span-1 row-span-1'>
                    <Select name='year' value={year} onValueChange={(value) => setYear(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            {Array(100).fill(0).map((_, index) => {
                                const year = (dayjs(new Date()).year() - index).toString()
                                return <SelectItem key={index} value={year}>{year}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col col-span-3 row-span-1'>
                    <Label className='mb-1' htmlFor='bio'>{t("label:biography")}</Label>
                    <textarea id='bio' className='resize-none rounded p-2 bg-transparent border' value={bio} onChange={(e) => setBio(e.target.value)}/>
                </div>
            </div>
        </div>
        <input className='hidden' ref={fileInputRef} type='file' accept="image/*" onChange={handleImageChange}/>
    </Modal>
}

export default EditProfileModal;