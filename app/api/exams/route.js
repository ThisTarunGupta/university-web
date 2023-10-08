import { doc, getDoc } from "firebase/firestore/lite";
import { NextResponse } from "next/server";

import { db } from "@/app/firebaseConfig";

export async function GET(req) {
  const docSnap = await getDoc(doc(db, "exams", "maxMarks"));
  return docSnap.exists()
    ? NextResponse.json({ error: null, data: docSnap.data() })
    : NextResponse.json({ error: null, data: null });
}
