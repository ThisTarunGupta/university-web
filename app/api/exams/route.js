import { NextResponse } from "next/server";

export async function GET(req) {
  const data = [
    {
      name: "minor1",
      marks: 20,
    },
    {
      name: "minor2",
      marks: 20,
    },
    {
      name: "reminor",
      marks: 20,
    },
    {
      name: "major",
      marks: 60,
    },
  ];

  return NextResponse.json({ error: null, data });
}
