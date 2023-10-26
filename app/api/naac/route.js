import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";

import { db } from "@/app/firebaseConfig";

const collectionName = "naac";

const isAdmin = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() && docSnap.data().admin ? true : false;
};

export async function GET(req) {
  const data = {};
  const querySnapshot = await getDocs(collection(db, collectionName));
  if (!querySnapshot)
    return NextResponse.json({
      error: "Error in reading naac",
      data: null,
    });
  querySnapshot.forEach((doc) => (data[doc.id] = doc.data()));

  return (await isAdmin(new URL(req.url).searchParams.get("uid")))
    ? NextResponse.json({ error: null, data })
    : NextResponse.json({ error: null, data: data.request });
}

export async function POST(req) {
  const { active } = await res.json();
  if (
    (await isAdmin(new URL(req.url).searchParams.get("uid"))) &&
    typeof active === "boolean"
  ) {
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
    const { active, attributes } = await req.json();
    if (typeof active === "boolean") {
      await updateDoc(doc(db, collectionName, "request"), {
        active,
      });
      active && (await deleteDoc(doc(db, collectionName, "response")));

      return NextResponse.json({ error: null, data: null });
    } else if (typeof attributes === "object") {
      await updateDoc(doc(db, collectionName, "request"), {
        attributes,
      });
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
