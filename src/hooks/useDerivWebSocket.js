import { useState, useEffect, useCallback } from 'react'
import useDerivAccounts from './useDerivAccounts'

const DERIV_SOCKET_URL = 'wss://qa10.deriv.dev/websockets/v3?app_id=9999'

const useDerivWebSocket = () => {
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const { defaultAccount } = useDerivAccounts()

    // Initialize WebSocket connection
    useEffect(() => {
        const ws = new WebSocket(DERIV_SOCKET_URL)

        ws.onopen = () => {
            console.log('[open] Connection established')
            setIsConnected(true)

            // Authorize with token immediately after connection
            if (defaultAccount?.token) {
                ws.send(JSON.stringify({
                    authorize: defaultAccount.token
                }))
            }
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log('[message] Data received:', data)

            // Handle authorization response
            if (data.msg_type === 'authorize') {
                if (data.error) {
                    console.error('Authorization failed:', data.error)
                } else {
                    console.log('Authorization successful:', data)
                    // You can store additional user info here if needed
                }
            }
        }

        ws.onclose = (event) => {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`)
            } else {
                console.log('[close] Connection died')
            }
            setIsConnected(false)
        }

        ws.onerror = (error) => {
            console.error('[error] WebSocket error:', error)
        }

        setSocket(ws)

        // Cleanup on unmount
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close()
            }
        }
    }, [defaultAccount])

    // Function to send messages through WebSocket
    const sendRequest = useCallback((request) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(request))
        } else {
            console.error('WebSocket is not connected')
        }
    }, [socket])

    // Keep connection alive with ping
    useEffect(() => {
        if (!isConnected) return

        const pingInterval = setInterval(() => {
            sendRequest({ ping: 1 })
        }, 30000) // Send ping every 30 seconds

        return () => clearInterval(pingInterval)
    }, [isConnected, sendRequest])

    return {
        socket,
        isConnected,
        sendRequest
    }
}

export default useDerivWebSocket 
