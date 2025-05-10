import {useState, useRef, ChangeEvent, KeyboardEvent, useEffect} from 'react'
import {motion} from "motion/react"

type OTPProps = {
    fieldNum: number,
    onComplete: (otp: string) => void
}

const OTP = (props: OTPProps) => {

    const { fieldNum, onComplete } = props;

    const [OTP, setOTP] = useState<string[]>(Array(fieldNum).fill(""))

    useEffect(() => {
        if (OTP.every(digit => digit.trim() != '')) {
            onComplete(OTP.join(""));
        }
    }, [OTP])

    const inputRef = useRef<HTMLInputElement[]>([]);

    const handleInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value
        if(value != " "){
            e.target.value = value.toUpperCase()
            setOTP(prev => {
                const newOTP = [...prev];
                newOTP[index] = e.target.value;
                return newOTP;
            })
            if (e.target.value && index < fieldNum - 1) {
                inputRef.current[index + 1].focus();
            }
        }else{
            e.target.value = ""
        }
    }

    const handleDelete = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (inputRef.current[index - 1] && e.key == 'Backspace' && index > 0 && !inputRef.current[index].value) {
            inputRef.current[index - 1].focus();
        }
    }

    return <div className='w-full flex justify-between py-8'>
        {OTP.map((_, index) => (
            <motion.input
                key={index}
                type='text'
                className='w-9 h-10 text-center border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                maxLength={1}
                ref={(el: HTMLInputElement) => inputRef.current[index] = el}
                value={OTP[index]}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleDelete(e, index)}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { duration: .5, delay: 1 / fieldNum * (index + 1) } }}
            />
        ))}
    </div>
}

export default OTP