export async function GET(req: Request) {
  return Response.json({ name: "testing." });
}

export async function POST(req: Request) {
  const res = await req.json();
  console.log(res);
  return Response.json({ message: "Ok" }, { status: 200 });
}
