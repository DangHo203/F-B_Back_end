import { Router } from "express";
import { createPaymentUrl, queryPaymentResult, refundPayment, vnpayReturn, vnpayIPN, renderOrderList, renderCreatePayment, renderQuerydr, renderRefund } from './vnpayController';

const router = Router();

// Các routes GET
router.get('/', renderOrderList);
router.get('/create_payment_url', renderCreatePayment);
router.get('/querydr', renderQuerydr);
router.get('/refund', renderRefund);
router.get('/vnpay_return', vnpayReturn);
router.get('/vnpay_ipn', vnpayIPN);

// Các routes POST
router.post('/create_payment_url', createPaymentUrl);
router.post('/querydr', queryPaymentResult);
router.post('/refund', refundPayment);


export default router;

