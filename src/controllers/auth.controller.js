import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const register = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  if (!/\S+@\S+\.\S+/.test(req.body.email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  
  if (req.body.password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  if (await prisma.user.findUnique({ where: { email: req.body.email } })) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashed = await bcrypt.hash(req.body.password, 10);

  const adminEmails = ["admin@example.com", "superadmin@example.com"];
  const role = adminEmails.includes(req.body.email.toLowerCase()) ? "ADMIN" : "USER";
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashed,
      role: role
    }
  });

  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  });
};

export const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  if (!/\S+@\S+\.\S+/.test(req.body.email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  
  if (req.body.password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  const user = await prisma.user.findUnique({
    where: { email: req.body.email }
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ 
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
};