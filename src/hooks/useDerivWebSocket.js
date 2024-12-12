import { useState, useEffect, useCallback } from 'react'
import useDerivAccounts from './useDerivAccounts'


const WS_URL = `${import.meta.env.VITE_WS_URL}?app_id=${import.meta.env.VITE_APP_ID}`


const useDerivWebSocket = () => {
    const [socket, setSocket] = useState(null)
    const [settings, setSettings] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isConnected, setIsConnected] = useState(false)
    const { defaultAccount } = useDerivAccounts()

    // Initialize WebSocket connection
    useEffect(() => {
        if (defaultAccount?.token) {
            const ws = new WebSocket(WS_URL)

            // Set socket immediately so it's available
            setSocket(ws)

            ws.onopen = () => {
                console.log('WebSocket connected, readyState:', ws.readyState)
                setIsConnected(true)
                ws.send(JSON.stringify({
                    authorize: defaultAccount.token
                }))
            }

            ws.onclose = () => {
                setIsConnected(false)
            }

            ws.onmessage = (msg) => {
                const response = JSON.parse(msg.data)
                console.log('WebSocket message:', response)

                if (response.msg_type === 'authorize') {
                    if (response.error) {
                        console.error('Authorization failed:', response.error)
                    } else {
                        console.log('Authorization successful')
                        ws.send(JSON.stringify({
                            get_settings: 1
                        }))
                    }
                }
                else if (response.msg_type === 'get_settings') {
                    setSettings(response.get_settings)
                    setIsLoading(false)
                } else if (response.msg_type === 'set_settings') {
                    ws.send(JSON.stringify({
                        get_settings: 1
                    }))
                }
            }

            return () => {
                if (ws) {
                    ws.close()
                }
            }
        }
    }, [defaultAccount])

    // Function to request account settings
    const getSettings = useCallback(() => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                get_settings: 1
            }))
        }
    }, [socket])

    // Function to send any WebSocket request
    const sendRequest = useCallback((request) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(request))
        }
    }, [socket])

    return {
        socket,
        settings,
        isLoading,
        isConnected,
        getSettings,
        sendRequest
    }
}

export default useDerivWebSocket 
