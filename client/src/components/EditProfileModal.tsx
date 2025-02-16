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
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import {useEffect, useState} from "react";
import {monthsEnglish, monthsVietnamese} from "@/constants/datetime";
import dayjs from "dayjs";
import axios from "axios";
import {PROFILE_URL} from "@/constants/api";

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
    const [bio, setBio] = useState(userData?.bio ?? "")

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
        }).then(res => {
            console.log(res)
        })
    }

    return <Modal height={620} width={720} open={open} onClose={onClose} showHeader title={t("title:edit_profile")} showBottom style={{ backgroundColor: '#181818', color: 'white' }} renderBottom={() => <Button className='bg-blue-500 text-white' onClick={handleUpdateProfile}>{t("button:save")}</Button>}>
        <div className='flex flex-col items-center w-full'>
            <Avatar className='cursor-pointer h-32 w-32'>
                <AvatarImage className='bg-white' src={userData?.avatar} alt='avatar'/>
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
    </Modal>
}

export default EditProfileModal;