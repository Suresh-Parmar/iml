import axios from "axios";
import { BASE_URL } from '@/utilities/API';
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestBody = await request.json();
  const response = await axios.post(`${BASE_URL}/payment_request`, requestBody);
  const data = await response.data;
  return NextResponse.json({ data });
}