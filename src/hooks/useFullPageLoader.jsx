import React, {useState} from 'react'
import FullPageLoader from '../components/PageLoader/pageloader.js'

export const useFullPageLoader = () => {
    const [loading, setLoading] = useState(false)
    return [
        loading ? <FullPageLoader/> : null,
        () => setLoading(true),
        () => setLoading(false)
    ]
}
