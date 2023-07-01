import { NextResponse } from "next/server";

import teachers from "@/app/data/teachers";

export async function GET(request) {
  const user = teachers.filter((teacher) => teacher.id === "T0");
  return NextResponse.json(user);
}
