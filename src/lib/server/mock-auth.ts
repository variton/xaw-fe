import credentials from "./fixtures/credentials.json";

/** Simulates credential validation by a backend using a demo-only fixture. */
export async function mockLogin(
  username: unknown,
  password: unknown,
): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    typeof username === "string" &&
    typeof password === "string" &&
    credentials.some(
      (user) => username === user.username && password === user.password,
    )
  );
}
