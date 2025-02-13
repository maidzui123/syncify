import { useState, useEffect } from 'react'
import {io} from "socket.io-client";
import {SOCKET_URL} from "@/constants/api";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

export const socket = io(SOCKET_URL, {
    autoConnect: false
})

const useSocket = () => {
    const [socketId,setSocketId] = useState<string | undefined>('')
    const userData = useSelector((state: RootState) => state.auth.value)

    useEffect(() => {
        initSocket()
    }, []);

    const initSocket = () => {
        if(socket){
            socket.io.opts.extraHeaders = {
                Authorization: `Bearer ${userData.accessToken}`,
            };
            socket.on('connect', () => {
                console.log('Connected to socket server')
                socket.emit('userConnect')
                setSocketId(socket!.id)
            })
            socket.connect()
        }
    }

    return {
        socketId,
    }
}

export default useSocket