import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/utilities/API";

const AUTHENTICATION_URL = "login";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const credentialsFromRequestHeaders = request.headers.get("access_token");
  const response = await axios.post(`${BASE_URL}/${AUTHENTICATION_URL}`, requestBody, {
    headers: {
      "access_token": credentialsFromRequestHeaders,
    },
  });
  const data = await response.data;
  return NextResponse.json({ data });
}