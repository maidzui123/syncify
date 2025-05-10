import { useState, useEffect, useRef } from 'react'

type CounterProps = {
    initValue: number,
    onFinish: () => void
}

const Countdown = (props: CounterProps) => {
    
    const { initValue, onFinish } = props
    
    const [time, setTime] = useState<number>(initValue)

    const counterRef=  useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        counterRef.current = setInterval(() => {
            if(time > 0) {
                setTime(time - 1)
            }else{
                clearInterval(counterRef.current!);
                onFinish();
            }
        }, 1000);
        return () => {
            clearInterval(counterRef.current!)
        }
    }, [onFinish, time]);
    
    return <div className='text-orange-300'>
        {time}s
    </div>
}

export default Countdown