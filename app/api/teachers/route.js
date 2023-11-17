import { NextResponse } from "next/server";
import {
  createUserWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore/lite";

import { auth, db } from "@/app/firebaseConfig";

const collectionName = "users";
const isAdmin = async (uid) => {
  const docSnap = await getDoc(doc(db, collectionName, uid));
  return docSnap.exists() && docSnap.data().admin ? true : false;
};

export async function GET(req) {
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    let data = [];
    const querySnapshot = await getDocs(
      query(collection(db, collectionName)),
      where("disabled", "==", false)
    );
    if (!querySnapshot)
      return NextResponse.json({
        error: "Error in reading teachers",
        data: null,
      });
    if (querySnapshot.empty)
      return NextResponse.json({ error: "No teachers found", data: null });

    querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
    data = data.filter((x) => x.admin !== true && x.disabled !== true);

    return NextResponse.json({ error: null, data });
  } else
    return NextResponse.json({
      error: "Not authorized",
      data: null,
    });
}

export async function POST(req) {
  if (await isAdmin(new URL(req.url).searchParams.get("uid"))) {
    const { hod, permanent, name, email, phone, classes } = await req.json();
    if (hod && !permanent)
      return NextResponse.json({ error: "HOD must be permanent", data: null });
    if (!(name && email && phone))
      return NextResponse.json({ error: "Invalid data", data: null });

    try {
      while (1) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          phone
        );
        if (userCredential) {
          while (1) {
            const docRef = await setDoc(
              doc(db, collectionName, userCredential.user.uid),
              {
                hod: hod || false,
                permanent: permanent || false,
                name: name.trim(),
                email: email.trim(),
                phone: phone,
                classes: classes || {},
                disabled: false,
              }
            );
            if (docRef) break;
          }
          return NextResponse.json({
            error: null,
            data: userCredential.user.uid,
          });
        }
      }
    } catch (e) {
      return NextResponse.json({ error: e.code.substring(5), data: null });
    }
  } else
    return NextResponse.json({ error: "Error in adding user", data: null });
}

export async function PUT(req) {
  const {
    id,
    hod,
    permanent,
    name,
    email,
    password,
    phone,
    classes,
    disabled,
  } = await req.json();
  const admin = await isAdmin(new URL(req.url).searchParams.get("uid"));
  if (hod && !permanent)
    return NextResponse.json({ error: "HOD must be permanent", data: null });

  if (!admin) {
    if (email) {
      while (1) {
        const error = await updateEmail(auth.currentUser, email);
        if (!error) break;
      }
    }

    if (password) {
      while (1) {
        const error = await updatePassword(auth.currentUser, password);
        if (!error) break;
      }
    }
  }

  if (hod || permanent || name || email || phone || classes || disabled) {
    while (1) {
      const error = await updateDoc(doc(db, collectionName, id), {
        hod: hod || false,
        permanent: permanent || false,
        name: name.trim(),
        email: email.trim(),
        phone: phone,
        classes: classes || {},
        disabled: disabled || false,
      });
      if (!error) return NextResponse.json({ error: null, data: null });
    }
  }

  return NextResponse.json({ error: "Error in updating teacher", data: null });
}

export async function DELETE(req) {
  const searchParams = new URL(req.url).searchParams;
  if (await isAdmin(searchParams.get("uid"))) {
    const id = searchParams.get("id");
    if (id) {
      while (1) {
        const error = await updateDoc(
          doc(db, collectionName, searchParams.get("id")),
          { disabled: true },
          { merge: true }
        );
        if (!error) return NextResponse.json({ error: null, data: null });
      }
    } else return NextResponse.json({ error: "Invalid data", data: null });
  }
  return NextResponse.json({ error: "Not authorized", data: null });
}
