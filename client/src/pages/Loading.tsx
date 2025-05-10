import Lottie from "lottie-react";
import LoadingAnimation from '@/assets/lotties/loading.json'
import {useSelector} from "react-redux";
import { RootState } from "@/redux/store";

const Loading = () => {

    const loading = useSelector((state: RootState) => state.loading.value)

    return <div className='absolute inset-0 z-[999] bg-[rgba(0,0,0,.6)] justify-center items-center' style={{ display: loading ? 'flex' : 'none' }}>
        <div className='flex flex-col items-center'>
            <div className='h-40 w-40'>
                <Lottie animationData={LoadingAnimation}/>
            </div>
            <div className="font-semibold text-2xl text-center text-white">
                <span className='animate-loading inline-block mx-1' style={{ animationDelay: '.1s' }}>L</span>
                <span className='animate-loading inline-block mx-1' style={{ animationDelay: '.2s' }}>O</span>
                <span className='animate-loading inline-block mx-1' style={{ animationDelay: '.3s' }}>A</span>
                <span className='animate-loading inline-block mx-1' style={{ animationDelay: '.4s' }}>D</span>
                <span className='animate-loading inline-block mx-1' style={{ animationDelay: '.5s' }}>I</span>
                <span className='animate-loading inline-block mx-1' style={{ animationDelay: '.6s' }}>N</span>
                <span className='animate-loading inline-block mx-1' style={{ animationDelay: '.7s' }}>G</span>
            </div>
        </div>
    </div>
}

export default Loading;