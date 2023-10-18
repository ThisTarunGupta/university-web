import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
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
  const uid = searchParams.get("uid");

  if ((await isAdmin(uid)) === true && batch) {
    const querySnapshot = await getDocs(
      query(collection(db, collectionName), where("batch", "==", batch))
    );
    if (querySnapshot.empty)
      return NextResponse.json({
        error: "Error in reading students",
        data: null,
      });

    querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
  } else if (batch && subject) {
    const batchesId = [];
    const batchDocSnap = await getDoc(doc(db, "batches", batch));
    if (!batchDocSnap.exists())
      return NextResponse.json({
        error: "Error in reading batch",
        data: null,
      });

    const course = batchDocSnap.data().course;
    const courseDocSnap = await getDoc(doc(db, "courses", course));
    if (!courseDocSnap.exists())
      return NextResponse.json({
        error: "Error in reading course",
        data: null,
      });

    const deltaYear =
      (new Date().getFullYear() + "").slice(-2) -
      parseFloat(courseDocSnap.data().maxDuration);
    const batchesQuerySnapshot = await getDocs(
      query(collection(db, "batches"), where("course", "==", course))
    );
    if (batchesQuerySnapshot.empty)
      return NextResponse.json({
        error: "Error in reading batches",
        data: null,
      });

    batchesQuerySnapshot.forEach((doc) => {
      const { slug } = doc.data();
      const year = parseFloat(slug.slice(-2));
      if (doc.id !== batch && year >= deltaYear) batchesId.push(doc.id);
    });

    const studentQuerySnapshot = await getDocs(
      query(
        collection(db, collectionName),
        where("batch", "in", [batch, ...batchesId])
      )
    );
    if (studentQuerySnapshot.empty)
      return NextResponse.json({
        error: "Error in reading students",
        data: null,
      });

    studentQuerySnapshot.forEach((doc) => {
      const student = doc.data();
      if (student.batch === batch) data.push({ id: doc.id, ...student });
      else if (student.marks && student.marks[subject]) {
        const marks = student.marks[subject];
        if (Object.keys(marks).includes("minor1")) {
          const tempMinor = [
            parseFloat(marks.minor1) || 0,
            parseFloat(marks.minor2) || 0,
            parseFloat(marks.reminor) || 0,
          ].sort((a, b) => {
            if (a > b) return -1;
            else if (a < b) return 1;

            return 0;
          });
          if (tempMinor[0] + tempMinor[1] < 14)
            data.push({ id: doc.id, ...student });
          else if ((parseFloat(marks.major) || 0) < 21)
            data.push({ id: doc.id, ...student });
        }
      }
    });
  }

  if (data.length) {
    data.sort((a, b) => {
      const _a = a.rollno.slice(-2);
      const _b = b.rollno.slice(-2);
      if (_a < _b) return 1;
      else if (_a > _b) return -1;

      return 0;
    });
    data.sort((a, b) => {
      const _a = a.rollno;
      const _b = b.rollno;
      if (_a.slice(-2) === _b.slice(-2) && _a.slice(0, 2) < _b.slice(0, 2))
        return -1;
      else if (_a.slice(-2) === _b.slice(-2) && _a.slice(0, 2) > _b.slice(0, 2))
        return 1;

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
    const { batch, rollno, name, parentage, email, phone } = await req.json();
    if (batch && rollno && name && parentage && email && phone) {
      const docRef = await addDoc(collection(db, collectionName), {
        batch: batch.trim(),
        rollno: rollno.trim(),
        name: name.trim(),
        parentage: parentage.trim(),
        email: email.trim(),
        phone: phone,
        marks: {},
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
  const { data, exam, merge, ref } = await req.json();
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    if (ref === "details") {
      const { id, rollno, name, parentage, email, phone } = data;
      if (id && rollno && name && parentage && email && phone) {
        await updateDoc(doc(db, collectionName, id), {
          rollno: rollno ? rollno.trim() : null,
          name: name ? name.trim() : null,
          parentage: parentage ? parentage.trim() : null,
          email: email ? email.trim() : null,
          phone: phone,
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
          [`marks.${ref}.${exam}`]: parseFloat(data[id]),
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
    await deleteDoc(doc(db, collectionName, searchParams.get("id")));
    return NextResponse.json({ error: null, data: null });
  } else return NextResponse.json({ error: "Not authorized", data: null });
}
