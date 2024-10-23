// vnpayController.ts
import { json, Request, Response } from "express";
import moment from "moment";
import crypto from "crypto";
import {
    vnp_HashSecret,
    vnp_Url,
    vnp_ReturnUrl,
    vnp_TmnCode,
    vnp_Api,
} from "./configVNPAY";

import qs from "qs";

// Hàm sắp xếp object theo thứ tự key
const sortObject = (obj: any) => {
    const sorted: any = {};
    const str = Object.keys(obj).sort();
    str.forEach((key) => {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
    return sorted;
};

// Render trang danh sách đơn hàng
export const renderOrderList = (req: Request, res: Response) => {
    res.render("orderlist", { title: "Danh sách đơn hàng" });
};

// Render trang tạo thanh toán
export const renderCreatePayment = (req: Request, res: Response) => {
    res.render("order", { title: "Tạo mới đơn hàng", amount: 10000 });
};

// Render trang truy vấn kết quả thanh toán
export const renderQuerydr = (req: Request, res: Response) => {
    res.render("querydr", { title: "Truy vấn kết quả thanh toán" });
};

// Render trang hoàn tiền giao dịch
export const renderRefund = (req: Request, res: Response) => {
    res.render("refund", { title: "Hoàn tiền giao dịch thanh toán" });
};

// Xử lý tạo URL thanh toán
export const createPaymentUrl = (req: Request, res: Response) => {

    console.log(req.body);
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");

    const ipAddr =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const tmnCode = vnp_TmnCode;
    const secretKey = vnp_HashSecret;
    let vnpUrl = vnp_Url;
    const returnUrl = vnp_ReturnUrl;
    const orderId = moment(date).format("DDHHmmss");
    const amount = req.body.amount;
    const bankCode = req.body.bankCode;
    let locale = req.body.language || "vn";
    const currCode = "VND";

    let vnp_Params: any = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}`,
        vnp_OrderType: "other",
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    };

    if (bankCode) vnp_Params["vnp_BankCode"] = bankCode;
    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });

    return res.status(200).json({ code: "00", data: vnpUrl });
};

// Xử lý trả về kết quả từ VNPay
export const vnpayReturn = (req: Request, res: Response) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = sortObject(vnp_Params);

    const secretKey = vnp_HashSecret;
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
        res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
    } else {
        res.render("success", { code: "97" });
    }
};

// Xử lý IPN (Instant Payment Notification) từ VNPay
export const vnpayIPN = (req: Request, res: Response) => {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];
    const orderId = vnp_Params["vnp_TxnRef"];
    const rspCode = vnp_Params["vnp_ResponseCode"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = sortObject(vnp_Params);

    const secretKey = vnp_HashSecret;
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
        if (rspCode === "00") {
            res.status(200).json({ RspCode: "00", Message: "Success" });
        } else {
            res.status(200).json({ RspCode: "99", Message: "Payment failed" });
        }
    } else {
        res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
    }
};

// Truy vấn kết quả thanh toán
export const queryPaymentResult = (req: Request, res: Response) => {
    // Logic xử lý truy vấn kết quả
};

// Xử lý hoàn tiền giao dịch
export const refundPayment = (req: Request, res: Response) => {
    // Logic xử lý hoàn tiền
};
