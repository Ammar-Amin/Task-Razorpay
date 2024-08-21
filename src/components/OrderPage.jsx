import React, { useState } from 'react';
import axios from 'axios';
import { useStatus } from '../context/StatusContext';

const OrderPage = ({ token, razorKey, setPayStatus }) => {
    const [orderData, setOrderData] = useState({
        packageId: '6613d6fbbf1afca9aa1b519e',
        pricingId: '662caa2d50bf43b5cef75232',
        finalAmount: '441',
        couponCode: 'NEET25',
    });

    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading, error, setError] = useStatus()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError(null)
        setOrderId(null)

        try {
            const response = await axios.post(
                'https://api.testbuddy.live/v1/order/create',
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response)

            if (response.data && response.data._id) {
                setOrderId(response.data._id);
                console.log('Order ID:', response.data._id);
                // Initiate Razor Payment
                handleRazorPayment(orderId);
            } else {
                console.error('Failed to create order.');
                setError("Failed to create order.")
            }
            setLoading(false)
        } catch (error) {
            console.error('Error creating order:', error);
            setError(error.response.statusText)
            setLoading(false)
        }
    };

    const handleRazorPayment = async (orderId) => {
        try {
            const options = {
                key: razorKey,
                amount: orderData.finalAmount * 100, // amount in paise (e.g., 441 INR => 44100 paise)
                currency: 'INR',
                name: 'Thesis Ace Writer',
                description: 'Test Transaction',
                order_id: orderId, // Pass the order ID here
                handler: async function (response) {
                    console.log('Payment successful:', response);
                    // we are not getting payment signature in res.
                    await verifyPayment(response, orderId);
                    setPayStatus(true)
                },
                prefill: {
                    name: 'Ammar Amin',
                    email: 'user@example.com',
                    contact: '0123456789',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error initiating Razorpay payment:', error);
            setError("Error initiating Razorpay payment")
        }
    };

    const verifyPayment = async (paymentResponse, orderId) => {

        try {
            const verificationResponse = await axios.post(
                'https://api.testbuddy.live/v1/order/verify',
                {
                    transactionId: orderId,
                    razorpayPaymentId: paymentResponse.razorpay_payment_id,
                    razorpaySignature: paymentResponse.razorpay_signature,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(verificationResponse)

            if (verificationResponse.data.success) {
                console.log('Payment verified successfully:', verificationResponse.data);
            } else {
                console.error('Payment verification failed.');
                setError('Payment verification failed.')
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            setError('Error verifying payment')
        }
    };


    const handleReset = () => {
        setOrderData({
            packageId: '6613d6fbbf1afca9aa1b519e',
            pricingId: '662caa2d50bf43b5cef75232',
            finalAmount: '441',
            couponCode: 'NEET25',
        })
        setError(null)
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Create Your Order</h1>
            <form onSubmit={handleOrderSubmit} className="w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                        Package ID:
                    </label>
                    <input
                        type="text"
                        name="packageId"
                        value={orderData.packageId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border outline-none bg-slate-800 rounded"
                        placeholder="Enter Package ID"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                        Pricing ID:
                    </label>
                    <input
                        type="text"
                        name="pricingId"
                        value={orderData.pricingId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border outline-none bg-slate-800 rounded"
                        placeholder="Enter Pricing ID"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                        Final Amount:
                    </label>
                    <input
                        type="number"
                        name="finalAmount"
                        value={orderData.finalAmount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border outline-none bg-slate-800 rounded"
                        placeholder="Enter Final Amount"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-bold mb-2">
                        Coupon Code:
                    </label>
                    <input
                        type="text"
                        name="couponCode"
                        value={orderData.couponCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border outline-none bg-slate-800 rounded"
                        placeholder="Enter Coupon Code (Optional)"
                    />
                </div>
                <button
                    type="submit"
                    className="block mx-auto mt-6 bg-blue-600 py-2 px-4 rounded hover:bg-blue-700"
                >
                    {!loading ? "Submit Order" : "Submitting..."}
                </button>
            </form>
            {orderId && (
                <div className="mt-4 flex flex-col gap-4 text-center">
                    <p>Order Created Successfully!</p>
                    <span>Order ID: {" "}
                        <span className="font-bold p-2 rounded">{orderId}</span>
                    </span>
                </div>
            )}
            {error && (<div className='my-4 text-center'>
                <span>{error}</span>
                <button className='mt-3 block mx-auto px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700' onClick={handleReset}>Reset Data</button>
            </div>)}
        </div>
    );
};

export default OrderPage;
