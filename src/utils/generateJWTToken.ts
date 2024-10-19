import jwt from "jsonwebtoken";

const generateJWTToken = async (email: string) => {
  // we can store secret in .env file
  const token = await jwt.sign({ email }, "secret", { expiresIn: "1d" });

  return token;
};

export default generateJWTToken;
