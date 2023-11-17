import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore/lite";

import { db } from "@/app/firebaseConfig";

const collectionName = "batches";
const isAdmin = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() && docSnap.data().admin ? true : false;
};

export async function GET(req) {
  const data = [];
  const querySnapshot = await getDocs(collection(db, collectionName));
  if (!querySnapshot)
    return NextResponse.json({
      error: "Error in reading batches",
      data: null,
    });

  if (querySnapshot.empty)
    return NextResponse.json({ error: "No batches found", data: null });
  querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

  return NextResponse.json({ error: null, data });
}

export async function POST(req) {
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    const { name, slug, course, completed } = await req.json();
    if (name && slug && course) {
      while (1) {
        const docRef = await addDoc(collection(db, collectionName), {
          name: name.trim(),
          slug: slug.trim(),
          course: course.trim(),
          completed: completed || false,
        });
        if (docRef) return NextResponse.json({ error: null, data: docRef.id });
      }
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}

export async function PUT(req) {
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    const { id, name, slug, course, completed } = await req.json();
    if (id && name && slug && course) {
      while (1) {
        const error = await setDoc(doc(db, collectionName, id), {
          name: name.trim(),
          slug: slug.trim(),
          course: course.trim(),
          completed: completed || false,
        });
        if (!error) return NextResponse.json({ error: null, data: null });
      }
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}

export async function DELETE(req) {
  const searchParams = new URL(req.url).searchParams;
  if (await isAdmin(searchParams.get("uid"))) {
    const id = searchParams.get("id");
    if (id) {
      const querySnapshot = await getDocs(
        query(collection(db, "students"), where("batch", "==", id))
      );
      if (!querySnapshot.empty)
        querySnapshot.forEach(async ({ id }) => {
          while (1) {
            const error = await deleteDoc(doc(db, "students", id));
            if (!error) break;
          }
        });

      while (1) {
        const error = await deleteDoc(doc(db, collectionName, id));
        if (!error) return NextResponse.json({ error: null, data: null });
      }
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}
