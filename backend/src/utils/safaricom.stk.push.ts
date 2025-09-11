import { StkPayloadData, StkPushData, StkPushResponse } from "../interfaces/backend.interfaces";
import axios from "axios";
import dotenv from "dotenv";
import moment from "moment";
import { getSafaricomAccessToken } from "./safaricom.auth";

dotenv.config();

export const SendSTKPush = async (StkData: StkPushData) => {

  const URL = process.env.MPESA_ENV === "sandbox"
    ? "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    : "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const Timestamp = moment().format("YYYYMMDDHHmmss");
  const Password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_CONSUMER_PASSKEY}${Timestamp}`
  ).toString("base64");
  const Token = await getSafaricomAccessToken();

  const Headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Token}`
  };

  const Payload: StkPayloadData = {
    BusinessShortCode: process.env.MPESA_SHORTCODE as string,
    Password,
    Timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: StkData.Amount,
    PartyA: StkData.PhoneNumber,
    PartyB: process.env.MPESA_RECEIVER_NUMBER as string,
    PhoneNumber: StkData.PhoneNumber,
    CallBackURL: process.env.CALLBACK_URL as string,
    AccountReference: "FANCY TUNES",
    TransactionDesc: "Payment for order"
  };

  let Response = await axios.post(URL, Payload, { headers: Headers });

  return Response.data as StkPushResponse;
}