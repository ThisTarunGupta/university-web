import { NextResponse } from "next/server";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";

import { db } from "@/app/firebaseConfig";

const collectionName = "naac";
const requests = {
  "About the Program": [1, 2, 3, 4, 5, 6, 7],
  "About the Facilities at the Departmental Level": {
    "General Infrastructure": [8, 9, 10, 11, 12, 13, 14],
    Library: [15, 16, 17, 18],
    Governance: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  },
  map: {
    1: "Aims & objectives of the programme are well defined and stand communicated",
    2: "The programme has a blend of theory & concepts as well as applied/latest information & knowledge",
    3: "The programme provides knowledge & skills for employability/entrepreneurship",
    4: "The programme builds and enhances knowledge and interest in the area",
    5: "The infrastructural facilities/ equipments are adequate & appropriate to the requirement of the programme",
    6: "Teaching inputs are relevant & appropriate for the programme",
    7: "The books/reference material are available & adequate for the programme",
    8: "The department has adequate and well maintained infrastructure facilities for teaching-learning (Classrooms/ theatre halls/labs etc)",
    9: "The classrooms are equipped with the necessary ICT facilities",
    10: "The Department has back-up facility during power shut downs",
    11: "Availability of clean drinking water facility in the Department",
    12: "The washrooms are well maintained & cleaned",
    13: "The students have access to internet and photocopying facility in the Department",
    14: "The department has facilities for the differently-abled",
    15: "The library has physical facilities like adequate seating space, adequate ventilation (Air Cooler/fans), and proper illumination",
    16: "Adequate number of books/copies of books available",
    17: "Latest editions of text books, reference books, journals are available in the library",
    18: "The library staff is helpful and cordial",
    19: "Induction/orientation programmes are held at the beginning of the semester",
    20: "Teaching plans of courses are circulated at the beginning of the semester",
    21: "The attendance and notifications with respect to examinations are displayed timely on the notice boards",
    22: "Grievances /problems, if any are redressed well in time at departmental level",
    23: "Availability of suggestion boxes & mechanism for obtaining feedback is prevalent in the department",
    24: "There is interaction with experts/resource persons from other Universities",
    25: "There is interaction with experts from the Industry/any other field other than Higher Education Institution",
    26: "Activities other than academics (cultural, sports etc) are actively held for the students",
    27: "Academic activities like seminars, conferences, publishing magazines etc. organized regularly",
    28: "Outreach/ community development programmes are held for the students",
    29: "The Department provides campus placement opportunities",
    30: "There is a strong Alumni network/Association of the Department",
  },
};

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

export async function PUT(req) {
  const uid = new URL(req.url).searchParams.get("uid");
  const { active, key, response } = await req.json();
  if (uid && (await isAdmin(uid))) {
    if (typeof active === "boolean") {
      while (1) {
        const error = await setDoc(doc(db, collectionName, "responses"), {
          active,
        });
        if (!error) return NextResponse.json({ error: null, data: null });
      }
    } else return NextResponse.json({ error: "Invalid data", data: null });
  } else {
    if (key && typeof response === "object") {
      while (1) {
        const docRef = await updateDoc(doc(db, collectionName, "responses"), {
          [`${key.trim()}`]: response,
        });
        if (docRef) return NextResponse.json({ error: null, data: null });
      }
    } else return NextResponse.json({ error: "Invalid data", data: null });
  }
}
