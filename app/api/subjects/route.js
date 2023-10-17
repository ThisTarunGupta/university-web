import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore/lite";

import { db } from "@/app/firebaseConfig";

const collectionName = "subjects";

const isAdmin = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() && docSnap.data().admin ? true : false;
};

export async function GET(req) {
  const data = [];
  const querySnapshot = await getDocs(collection(db, collectionName));
  if (!querySnapshot)
    return NextResponse.json({
      error: "Error in reading subjects",
      data: null,
    });

  if (querySnapshot.empty)
    return NextResponse.json({ error: "No subjects found", data: null });
  querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

  return NextResponse.json({ error: null, data });
}

export async function POST(req) {
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    const { name, subjectId, slug, credits } = await req.json();
    if (name && subjectId && slug && credits) {
      const docRef = await addDoc(collection(db, collectionName), {
        name: name.trim(),
        subjectId: subjectId.trim(),
        slug: slug.trim(),
        credits,
      });
      return docRef
        ? NextResponse.json({ error: null, data: docRef.id })
        : NextResponse.json({ error: "Error in adding subject", data: null });
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}

export async function PUT(req) {
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    const { id, name, subjectId, slug, credits } = await req.json();
    if (id && name && subjectId && slug && credits) {
      await setDoc(doc(db, collectionName, id), {
        name: name.trim(),
        subjectId: subjectId.trim(),
        slug: slug.trim(),
        credits,
      });

      return NextResponse.json({ error: null, data: null });
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}

export async function DELETE(req) {
  const searchParams = new URL(req.url).searchParams;
  if (await isAdmin(searchParams.get("uid"))) {
    const id = searchParams.get("id");
    if (id) {
      await deleteDoc(doc(db, collectionName, id));

      return NextResponse.json({ error: null, data: null });
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}
