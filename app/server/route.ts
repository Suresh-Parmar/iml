import axios from "axios";
import { BASE_URL } from '@/utilities/API';
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestBody = await request.json();
  const credentialsFromRequestHeaders = request.headers.get("access_token");
  const response = await axios.post(`${BASE_URL}/crud_ops`, requestBody, {
    headers: {
      "access_token": credentialsFromRequestHeaders || "",
    },
  });
  const data = await response.data;
  return NextResponse.json({ data });
}