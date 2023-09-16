import axios from "axios";
import { BASE_URL } from '@/utilities/API';
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestFormData = await request.formData();
  const credentialsFromRequestHeaders = request.headers.get("access_token");
  const collectionFromRequestHeaders = request.headers.get("collection");
  const response = await axios.post(`http://170.187.248.187:8098/student_creation_excel`, requestFormData, {
    headers: {
      "access_token": credentialsFromRequestHeaders || "",
      'Content-Type': 'multipart/form-data',
      "collection": collectionFromRequestHeaders || "",
    },
  });
  const data = await response.data;
  return NextResponse.json({ data });
}