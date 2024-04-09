import { sign, verify } from "jsonwebtoken";

export function generateJWT(payload: any): string {
  const SECRET_KEY = process.env.SECRET_KEY || "";

  return sign(
    {
      payload,
    },
    SECRET_KEY
  );
}

export function verifyJWT(token: string) {
  const SECRET_KEY = process.env.SECRET_KEY || "";
  return verify(token, SECRET_KEY);
}
