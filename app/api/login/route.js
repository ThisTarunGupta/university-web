import { NextResponse } from "next/server";

import teachers from "@/app/data/teachers";

export async function POST(req) {
  const { email, password } = await req.json();
  const teacher = teachers.filter(
    (teacher) => teacher.email === email && teacher.password === password
  );
  if (teacher.length === 0)
    return NextResponse.json({ error: "Credentials not matched", data: null });

  return NextResponse.json({ error: null, data: teacher[0] });
}
