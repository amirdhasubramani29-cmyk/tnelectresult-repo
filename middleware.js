import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  if (url.hostname === "tnelectresult-repo.vercel.app") {
    url.hostname = "tnelectionresults.site";
    return NextResponse.redirect(url);
  }
}