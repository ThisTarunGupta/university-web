import { NextResponse } from "next/server";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";

import { auth, db } from "@/app/firebaseConfig";

const collectionName = "users";

export async function POST(req) {
  const { email, password } = await req.json();
  if (email && password) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password.trim()
    );
    if (userCredential) {
      const docRef = await getDoc(
        doc(db, collectionName, userCredential.user.uid)
      );
      return docRef
        ? NextResponse.json({
            error: null,
            data: { id: userCredential.user.uid, ...docRef.data() },
          })
        : NextResponse.json({
            error: "Credentils doesn't match",
            data: null,
          });
    } else
      return NextResponse.json({
        error: "Credentils doesn't match",
        data: null,
      });
  } else return NextResponse.json({ error: "Invalid data", data: null });
}
