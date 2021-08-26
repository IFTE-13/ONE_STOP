import { useEffect, useContext, useRef } from 'react'
import { patchData } from '../utils/fetchData'
import { DataContext } from '../store/GlobalState'
import { updateItem } from '../store/Actions'

const PayPalBtn = ({ order }) => {
    const refPayPalBtn = useRef()
    const { state, dispatch } = useContext(DataContext)
    const { auth, orders } = state

    useEffect(() => {
        paypal.Buttons({
            createOrder: function (data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: order.total
                        }
                    }]
                });
            },
            onApprove: function (data, actions) {
                // This function captures the funds from the transaction.
                dispatch({ type: 'NOTIFY', payload: { loading: true } })

                return actions.order.capture().then(function (details) {

                    patchData(`order/payment/${order._id}`, {
                        paymentId: details.payer.payer_id
                    }, auth.token)
                        .then(res => {
                            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                            dispatch(updateItem(orders, order._id, {
                                ...order,
                                paid: true, dateOfPayment: details.create_time,
                                paymentId: details.payer.payer_id, method: 'Paypal'
                            }, 'ADD_ORDERS'))

                            return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                        })
                    // This function shows a transaction success message to your buyer.
                });
            }
        }).render(refPayPalBtn.current);
    }, [auth.token, dispatch, order, orders])

    return (
        <div ref={refPayPalBtn}></div>
    )
}

export default PayPalBtn;