import { collection, getDocs } from "firebase/firestore/lite";
import { NextResponse } from "next/server";

import { db } from "@/app/firebaseConfig";

export async function GET(req) {
  const data = {};
  const querySnapshot = await getDocs(collection(db, "exams"));
  if (!querySnapshot)
    return NextResponse.json({
      error: "Error in reading exams",
      data: null,
    });

  if (querySnapshot.empty)
    return NextResponse.json({ error: "No exams found", data: null });
  querySnapshot.forEach((doc) => (data[doc.id] = doc.data()));

  return NextResponse.json({ error: null, data });
}
