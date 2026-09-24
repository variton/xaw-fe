import { json } from "@sveltejs/kit";
import { mockLogin } from "$lib/server/mock-auth";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ message: "Invalid JSON request." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("username" in body) ||
    !("password" in body) ||
    typeof body.username !== "string" ||
    typeof body.password !== "string"
  ) {
    return json(
      { message: "Username and password are required." },
      { status: 400 },
    );
  }

  if (!(await mockLogin(body.username, body.password))) {
    return json({ message: "Incorrect login or password." }, { status: 401 });
  }

  return json({ success: true });
};
