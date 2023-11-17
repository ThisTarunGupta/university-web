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

const collectionName = "courses";
const isAdmin = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() && docSnap.data().admin ? true : false;
};

export async function GET(req) {
  const data = [];
  const querySnapshot = await getDocs(collection(db, collectionName));
  if (!querySnapshot)
    return NextResponse.json({
      error: "Error in reading courses",
      data: null,
    });

  if (querySnapshot.empty)
    return NextResponse.json({ error: "No courses found", data: null });
  querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

  return NextResponse.json({ error: null, data });
}

export async function POST(req) {
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    const { name, slug, duration, maxDuration, subjects } = await req.json();
    if (name && slug && duration && !isNaN(duration)) {
      while (1) {
        const docRef = await addDoc(collection(db, collectionName), {
          name: name.trim(),
          slug: slug.trim(),
          duration: duration.trim(),
          maxDuration:
            maxDuration && !isNaN(maxDuration)
              ? maxDuration.trim()
              : duration.trim(),
          subjects: subjects || {},
        });
        if (docRef) return NextResponse.json({ error: null, data: docRef.id });
      }
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}

export async function PUT(req) {
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    const { id, name, slug, duration, maxDuration, subjects } =
      await req.json();
    if (name && slug && duration && !isNaN(duration)) {
      while (1) {
        const docRef = await setDoc(doc(db, collectionName, id), {
          name: name.trim(),
          slug: slug.trim(),
          duration: duration.trim(),
          maxDuration:
            maxDuration && !isNaN(maxDuration)
              ? maxDuration.trim()
              : duration.trim(),
          subjects: subjects || {},
        });
        if (docRef) return NextResponse.json({ error: null, data: null });
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
        query(collection(db, "batches"), where("course", "==", id))
      );
      if (querySnapshot.empty) {
        while (1) {
          const docRef = await deleteDoc(doc(db, collectionName, id));
          if (docRef) return NextResponse.json({ error: null, data: null });
        }
      }

      return NextResponse.json({
        error: "First delete respective batch",
        data: null,
      });
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}
