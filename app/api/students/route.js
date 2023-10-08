import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore/lite";

import { db } from "@/app/firebaseConfig";

const collectionName = "students";
const isAdmin = async (uid) => {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() && docSnap.data().admin ? true : false;
};

export async function GET(req) {
  const data = [];
  const searchParams = new URL(req.url).searchParams;
  const batch = searchParams.get("batch");
  const subject = searchParams.get("subject");
  if (batch) {
    const querySnapshot = await getDocs(
      query(collection(db, collectionName), where("batch", "==", batch))
    );
    if (querySnapshot.empty)
      return NextResponse.json({
        error: "Error in reading students",
        data: null,
      });

    querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

    if (subject) {
      const querySnapshot = await getDocs(
        query(
          collection(db, collectionName),
          where("reappear", "array-contains", subject)
        )
      );
      !querySnapshot.empty &&
        querySnapshot.forEach(
          (doc) =>
            doc.data().batch !== batch &&
            data.push({ id: doc.id, ...doc.data() })
        );
    }

    let batchLength;
    const rollno = data[0].rollno;
    for (let i = 0; i < rollno.length; i++)
      if (isNaN(rollno[i])) {
        batchLength = rollno.length - i;
        break;
      }
    data.sort((a, b) => {
      const _a = a.rollno.substring(0, a.rollno.length - batchLength);
      const _b = b.rollno.substring(0, a.rollno.length - batchLength);
      if (_a < _b) return -1;
      else if (_a > _b) return 1;

      return 0;
    });

    return NextResponse.json({ error: null, data });
  } else
    return NextResponse.json({
      error: "Error in reading students",
      data: null,
    });
}

export async function POST(req) {
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    const { batch, rollno, name, parentage, email, phone, reappear } =
      await req.json();
    if (batch && rollno && name && parentage && email && phone) {
      const docRef = await addDoc(collection(db, collectionName), {
        batch: batch.trim(),
        rollno: rollno.trim(),
        name: name.trim(),
        parentage: parentage.trim(),
        email: email.trim(),
        phone: phone,
      });
      return docRef
        ? NextResponse.json({
            error: null,
            data: docRef.id,
          })
        : NextResponse.json({
            error: "Error in adding student",
            data: null,
          });
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}

export async function PUT(req) {
  const { id, data, exam, merge, reappear, reappearIn, ref } = await req.json();
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    if (id && reappear && reappearIn)
      updateDoc(doc(db, collectionName, id), {
        reappear,
        reappearIn,
      });
    else if (ref === "details") {
      const { id, rollno, name, parantage, email, phone } = data;
      if (id && rollno && name && parantage && email && phone) {
        updateDoc(doc(db, collectionName, id), {
          rollno: rollno ? rollno.trim() : null,
          name: name ? name.trim() : null,
          parantage: parantage ? parantage.trim() : null,
          email: email ? email.trim() : null,
          phone: phone ? phone.trim() : null,
        });
        return NextResponse.json({ error: null, data: null });
      } else return NextResponse.json({ error: "Invalid data", data: null });
    } else if (merge === 1)
      Object.keys(data).forEach((id) => {
        if (data[id])
          updateDoc(doc(db, collectionName, id), {
            [`marks.${ref}`]: data[id],
          });
      });
    else return NextResponse.json({ error: "Not authorized", data: null });
  } else if (exam !== "")
    Object.keys(data).forEach((id) => {
      if (!isNaN(data[id]))
        updateDoc(doc(db, collectionName, id), {
          [`marks.${ref}.${exam}`]: parseInt(data[id]),
        });
    });
  else
    return NextResponse.json({
      error: "Error in updating student",
      data: null,
    });

  return NextResponse.json({ error: null, data: null });
}

export async function DELETE(req) {
  const searchParams = new URL(req.url).searchParams;
  if (await isAdmin(searchParams.get("uid"))) {
    deleteDoc(doc(db, collectionName, searchParams.get("id")));
    return NextResponse.json({ error: null, data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}
