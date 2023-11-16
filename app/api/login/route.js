import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore/lite";

import { auth, db } from "@/app/firebaseConfig";

const collectionName = "users";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (email && password) {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      if (userCredential) {
        while (1) {
          const docRef = await getDoc(
            doc(db, collectionName, userCredential.user.uid)
          );
          if (docRef)
            return NextResponse.json({
              error: null,
              data: { id: userCredential.user.uid, ...docRef.data() },
            });
        }
      } else
        return NextResponse.json({
          error: "Credentils doesn't match",
          data: null,
        });
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data", data: null });
  }
}
