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
  arrayUnion,
} from "firebase/firestore/lite";

import { db, storage } from "@/app/firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";

const collectionName = "naac";

const isAdmin = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() && docSnap.data().admin ? true : false;
};

export async function GET(req) {
  const data = {};
  const uid = new URL(req.url).searchParams.get("uid");
  const querySnapshot = await getDocs(collection(db, collectionName));
  if (!querySnapshot)
    return NextResponse.json({
      error: "Error in reading naac",
      data: null,
    });
  querySnapshot.forEach((doc) => (data[doc.id] = doc.data()));
  data.requests = requests;

  return uid && (await isAdmin(uid))
    ? NextResponse.json({ error: null, data })
    : NextResponse.json({
        error: null,
        data: data.responses && data.responses.active ? requests : null,
      });
}

export async function POST(req) {
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    const { name, excel } = await req.json();
    if (name && excel) {
      console.log(JSON.parse(excel));
      const {
        metadata: { fullPath: excelPath },
      } = await uploadBytes(ref(storage, `excels/${name}`), JSON.parse(excel));
      if (!excelPath)
        return NextResponse.json({
          error: "Error in uploading excel",
          data: null,
        });
      await updateDoc(doc(db, "naac", "docs"), {
        excels: arrayUnion(excelPath),
      });

      return NextResponse.json({ error: null, data: excelPath });
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}

export async function PUT(req) {
  const uid = new URL(req.url).searchParams.get("uid");
  const { active, key, response } = await req.json();
  if (uid && (await isAdmin(uid))) {
    if (typeof active === "boolean") {
      await setDoc(doc(db, collectionName, "responses"), {
        active,
      });

      return NextResponse.json({ error: null, data: null });
    }
  } else {
    if (key && typeof response === "object") {
      await updateDoc(doc(db, collectionName, "responses"), {
        [`${key.trim()}`]: response,
      });

      return NextResponse.json({ error: null, data: null });
    } else return NextResponse.json({ error: "Invalid data", data: null });
  }
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
