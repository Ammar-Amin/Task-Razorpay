import React, { useState } from 'react';
import axios from 'axios';
import { useStatus } from '../context/StatusContext';

const VerifyOtp = ({ setToken }) => {
    const [mobile, setMobile] = useState('+919098989999');
    const [otp, setOtp] = useState('8899');
    const [loading, setLoading, error, setError] = useStatus()

    const verify = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post('https://api.testbuddy.live/v1/auth/verifyotp', {
                mobile,
                otp,
            });
            // console.log(response)

            if (response.data && response.data.token) {
                setToken(response.data.token);
                console.log('Bearer Token Created Successfully:', response.data.token);
            } else {
                console.error('Verification failed, no token received.');
                setError("Verification failed, Invalid Otp.")
            }
            setLoading(false)
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError(error.response.data.message)
            setLoading(false)
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
            <input
                type="text"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="mb-2 p-2 border outline-none bg-slate-800 rounded"
            />
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4 p-2 border outline-none bg-slate-800 rounded"
            />
            <button
                onClick={verify}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
            {error && <span className='my-4'>{error}</span>}
        </div>
    );
};

export default VerifyOtp;
