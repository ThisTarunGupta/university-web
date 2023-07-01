import { NextResponse } from "next/server";

import batches from "@/app/data/batches";
import subjects from "@/app/data/subjects";

export async function POST(req) {
  const { classes } = await req.json();
  const batchesSet = new Set([]);
  const subjectsSet = new Set([]);
  classes.forEach(({ batch, subject }) => {
    batchesSet.add(batch);
    subjectsSet.add(subject);
  });

  let batchesData = Array.from(batchesSet);
  let subjectsData = Array.from(subjectsSet);

  batchesData = batches.filter((batch) => batchesData.includes(batch.id));
  subjectsData = subjects.filter((subject) =>
    subjectsData.includes(subject.id)
  );

  const data = classes.map((classObj) => ({
    batch: batchesData.find((batch) => batch.id === classObj.batch),
    subject: subjectsData.find((subject) => subject.id === classObj.subject),
  }));

  return NextResponse.json({ error: null, data });
}
