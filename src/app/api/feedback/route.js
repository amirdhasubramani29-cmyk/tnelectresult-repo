// app/api/feedback/route.js

export async function POST(req) {
  const body = await req.json();

  if (!body.message || body.message.length > 300) {
    return new Response("Invalid input", { status: 400 });
  }
  
  await fetch(process.env.GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}