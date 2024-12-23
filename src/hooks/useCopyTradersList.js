import { useEffect, useState } from 'react'
import useDerivWebSocket from './useDerivWebSocket'

const useCopyTradersList = () => {
    const { sendRequest, wsResponse } = useDerivWebSocket()
    const [traders, setTraders] = useState([])
    const [copiers, setCopiers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Make the initial request
        sendRequest({
            copytrading_list: 1,
            // Optional parameters can be added here:
            // sort_fields: ["performance", "monthly_profitable_trades"],
            // sort_order: ["DESC", "DESC"]
        })
    }, [sendRequest])

    useEffect(() => {
        if (!wsResponse) return

        if (wsResponse.msg_type === 'copytrading_list') {
            console.log('Copy Trading List Response:', wsResponse)

            if (wsResponse.error) {
                setError(wsResponse.error.message)
                setIsLoading(false)
                return
            }

            if (wsResponse.copytrading_list) {
                setTraders(wsResponse.copytrading_list.traders)
                setCopiers(wsResponse.copytrading_list.copiers)
                setIsLoading(false)
                setError(null)
            }
        }
    }, [wsResponse])

    return {
        traders,
        copiers,
        isLoading,
        error,
        refreshList: () => sendRequest({ copytrading_list: 1 })
    }
}

export default useCopyTradersList
