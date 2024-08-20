import axios from 'axios';
import React from 'react'
import { useStatus } from '../context/StatusContext';

const GetRazorKey = ({ token, razorKey, setRazorKey }) => {
    const [loading, setLoading, error, setError] = useStatus()

    const getTheKey = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post(
                'https://api.testbuddy.live/v1/payment/key',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.key) {
                setRazorKey(response.data.key);
                console.log('Razor Key:', response.data.key);
            } else {
                console.error('Failed to retrieve Razor key.');
                setError('Failed to retrieve Razor key.')
            }
            setLoading(false)
        } catch (error) {
            console.error('Error getting Razor key:', error);
            setError(error.response.data.message)
            setLoading(false)
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Now Get Razorpay Key</h1>
            <button
                onClick={getTheKey}
                className="bg-blue-600 py-2 px-4 rounded hover:bg-blue-700"
            >
                {loading ? "Getting..." : "Get Key"}
            </button>
            <div className="mt-7">
                {razorKey && (
                    <span>Your Key: {" "}
                        <span className="bg-slate-700 p-2 rounded">{razorKey}</span>
                    </span>
                )}
                {error && (<span className='my-4'>{error}</span>)}
            </div>
        </div>
    );
}

export default GetRazorKey
