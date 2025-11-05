import { StkPayloadData, StkPushData, StkPushResponse } from "../interfaces/backend.interfaces";
import axios from "axios";
import dotenv from "dotenv";
import moment from "moment";
import { getSafaricomAccessToken } from "./safaricom.auth";
import { log } from "console";

dotenv.config();

export const SendSTKPush = async (StkData: StkPushData) => {

  StkData.PhoneNumber.startsWith("0") ? StkData.PhoneNumber = StkData.PhoneNumber.replace(StkData.PhoneNumber[0], "254") : StkData.PhoneNumber = StkData.PhoneNumber;

  const URL = process.env.MPESA_ENV === "sandbox"
    ? "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    : "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const Timestamp = moment().format("YYYYMMDDHHmmss");
  const Password = Buffer.from(
    `${process.env.MPESA_SHORTCODE as string }${process.env.MPESA_CONSUMER_PASSKEY as string }${Timestamp}`
  ).toString("base64");
  const Token = await getSafaricomAccessToken();

  const Headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${Token}`
  };

  const Payload: StkPayloadData = {
    BusinessShortCode: process.env.MPESA_SHORTCODE as string,
    Password,
    Timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: StkData.Amount,
    PartyA: StkData.PhoneNumber,
    PartyB: process.env.MPESA_SHORTCODE as string,
    PhoneNumber: StkData.PhoneNumber,
    CallBackURL: process.env.CALLBACK_URL as string,
    AccountReference: "FANCY TUNES",
    TransactionDesc: "Payment for order",
  };
  
  let Response = await axios.post(URL, Payload, { headers: Headers });

  return Response.data as StkPushResponse;
}