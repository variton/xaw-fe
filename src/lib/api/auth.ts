// Update this endpoint to match your backend's login route.
const LOGIN_ENDPOINT = "/api/login";

export async function login(username: string, password: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("Incorrect login or password.");
  }

  if (!response.ok) {
    throw new Error("Unable to sign in. Please try again later.");
  }
}
