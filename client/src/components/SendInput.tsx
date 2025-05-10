import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui";
import {SendHorizontal} from "lucide-react";
import {ChangeEvent} from "react";

type sendInputProps = {
    avatar: string;
    placeholder?: string;
    value: string;
    onChange: (text: string) => void;
    onSend: () => void;
}

const SendInput = (props: sendInputProps) => {

    const { avatar, placeholder, value, onChange, onSend } = props;

    const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
        onChange(e.target.value);
    }

    return <div
        className='w-full flex items-start my-2'>
        <Avatar className='cursor-pointer'>
            <AvatarImage className='bg-white' src={avatar} alt='avatar'/>
            <AvatarFallback delayMs={600}>?</AvatarFallback>
        </Avatar>
        <textarea className='flex-1 px-3 py-2 rounded-xl resize-none mx-3 text-black outline-0 text-sm' value={value}
                  onChange={handleOnChange} rows={1} autoFocus
                  placeholder={placeholder}/>
        <button type='button' onClick={onSend} disabled={value == ""}
                className='p-2 rounded-full transition hover:bg-[rgba(255,255,255,.3)]'>
            <SendHorizontal size={24} color='#ffffff'/>
        </button>
    </div>
}

export default SendInput