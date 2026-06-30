import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export async function signup(req, res) {
  try {
    const  name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    const existing = await User.findByEmail(email);

    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, passwordHash });
    const token = signToken(user.id);

    const { password_hash, ...safeUser } = user;

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findByEmail(email);

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user.id);
    const { password_hash, ...safeUser } = user;

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);

    res.status(500).json({ message: "Server error" });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get me error:", err);

    res.status(500).json({ message: "Server error" });
  }
}

export async function changePassword(req, res) {
  try {
    const {currentPassword, newPassword} = req.body;

    // 1. Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    // 2. Find user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const fullUser = await User.findByEmail(user.email);

    if (!fullUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3. Verify current password
    const valid = await bcrypt.compare(
      currentPassword,
      fullUser.password_hash
    );

    if (!valid) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // 4. Ensure new password is different
    const samePassword = await bcrypt.compare(
      newPassword,
      fullUser.password_hash
    );

    if (samePassword) {
      return res.status(400).json({
        message: "New password must be different from the current password",
      });
    }

    // 5. Hash and save new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await User.updatePassword(user.id, newPasswordHash);

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
}