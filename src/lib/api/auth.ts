// Update this endpoint to match your backend's login route.

const URL = "http://localhost:7777";
const LOGIN_ENDPOINT = "/api/login";

export async function login(username: string, password: string): Promise<void> {
    
  let response: Response;
  try {
    response = await fetch(URL+LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email:username, pwd:password }),
    });
    
    if (response.ok) return;
 
  /*
  const error = await response.json();
  console.error("Login error:", response.status, error);
  console.table(
    error.detail?.map(({ loc, msg }: { loc: string[]; msg: string }) => ({
      location: loc.join("."),
      message: msg,
    }))
  );
  */

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
