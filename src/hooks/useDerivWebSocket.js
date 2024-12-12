import { useState, useEffect, useCallback, useRef } from 'react'
import useDerivAccounts from './useDerivAccounts'

const WS_URL = `${import.meta.env.VITE_WS_URL}?app_id=${import.meta.env.VITE_APP_ID}`

// Singleton WebSocket instance
let globalWs = null
let responseHandlers = new Set()

const useDerivWebSocket = () => {
    const [socket, setSocket] = useState(null)
    const [settings, setSettings] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isConnected, setIsConnected] = useState(false)
    const { defaultAccount } = useDerivAccounts()
    const [wsResponse, setWsResponse] = useState(null)
    const handleResponseRef = useRef(null)

    // Create the response handler
    useEffect(() => {
        handleResponseRef.current = (response) => {
            setWsResponse(response)

            if (response.msg_type === 'authorize') {
                if (response.error) {
                    console.error('Authorization failed:', response.error)
                } else {
                    console.log('Authorization successful')
                    setIsConnected(true)
                    globalWs.send(JSON.stringify({
                        get_settings: 1
                    }))
                }
            }
            else if (response.msg_type === 'get_settings') {
                setSettings(response.get_settings)
                setIsLoading(false)
            }
        }
    }, [])

    // Initialize WebSocket connection
    useEffect(() => {
        if (!defaultAccount?.token) {
            console.log('No default account or token available', defaultAccount)
            return
        }

        console.log('Initializing WebSocket with URL:', WS_URL)
        console.log('Using token:', defaultAccount.token)

        const initializeWebSocket = () => {
            if (!globalWs) {
                console.log('Creating new WebSocket connection')
                globalWs = new WebSocket(WS_URL)

                globalWs.onopen = () => {
                    console.log('WebSocket connected, readyState:', globalWs.readyState)
                    setIsConnected(true)
                    console.log('Sending authorize request with token:', defaultAccount.token)
                    globalWs.send(JSON.stringify({
                        authorize: defaultAccount.token
                    }))
                }

                globalWs.onerror = (error) => {
                    console.error('WebSocket error:', error)
                }

                globalWs.onclose = () => {
                    console.log('WebSocket connection closed')
                    globalWs = null
                    responseHandlers.forEach(handler => handler({ type: 'connection', status: 'disconnected' }))
                    setIsConnected(false)
                }

                globalWs.onmessage = (msg) => {
                    const response = JSON.parse(msg.data)
                    console.log('Raw WebSocket message:', response)
                    responseHandlers.forEach(handler => handler(response))
                }
            }

            responseHandlers.add(handleResponseRef.current)
            setSocket(globalWs)

            if (globalWs.readyState === WebSocket.OPEN) {
                setIsConnected(true)
                console.log('WebSocket already open, sending authorize request')
                globalWs.send(JSON.stringify({
                    authorize: defaultAccount.token
                }))
            }
        }

        initializeWebSocket()

        return () => {
            if (handleResponseRef.current) {
                responseHandlers.delete(handleResponseRef.current)
                if (responseHandlers.size === 0 && globalWs) {
                    console.log('Cleaning up WebSocket connection')
                    globalWs.close()
                    globalWs = null
                }
            }
        }
    }, [defaultAccount])

    const sendRequest = useCallback((request) => {
        if (globalWs?.readyState === WebSocket.OPEN) {
            globalWs.send(JSON.stringify(request))
        } else {
            console.error('WebSocket is not connected')
        }
    }, [])

    return {
        socket,
        settings,
        isLoading,
        isConnected,
        sendRequest,
        wsResponse
    }
}

export default useDerivWebSocket 
