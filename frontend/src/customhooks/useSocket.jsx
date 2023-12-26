import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

const useSocket = (endpoint) => {
    const [socket, setSocket] = useState(null)
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        const newSocket = io(endpoint)

        newSocket.on('connected', () => {
            setConnected(true)
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [endpoint])

    const emmit = (event, data) => {
        if (socket) {
            socket.emmit(event, data)
        }
    }

    const on = (event, callback) => {
        if (socket) socket.on(event, callback)
    }

    const off = (event, callback) => {
        if (socket)socket.off(event,callback)
    }

    return {connected,emmit,on,off}
}

export default useSocket
