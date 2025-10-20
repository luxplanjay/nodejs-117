import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { createSession, setSessionCookies } from "../services/auth.js";
import { Session } from "../models/session.js";
import { sendMail } from "../utils/sendMail.js";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);
  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, "Invalid email or password");
  }

  await Session.deleteOne({ userId: user._id });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("sessionId");

  res.status(204).send();
};

export const refreshSession = async (req, res) => {
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) {
    throw createHttpError(401, "Session not found or invalid");
  }

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isRefreshTokenExpired) {
    throw createHttpError(401, "Refresh token expired");
  }

  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: "Session refreshed",
  });
};

export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  // anti user enumeration
  if (!user) {
    return res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  }

  const token = jwt.sign({ sub: user._id, email }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  console.log(token);

  try {
    await sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Password Reset Email",
      html: `<p>Click <a href="${process.env.FRONTEND_DOMAIN}?token=${token}">here</a> to reset password</p>`,
    });
  } catch {
    throw createHttpError(500, "Failed to send reset email, try again later!");
  }

  res.status(200).json({
    message:
      "If an account with that email exists, a reset link has been sent.",
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, "Invalid or expired token");
  }

  const user = await User.findOne({ _id: payload.sub, email: payload.email });
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hashedPassword });

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    message: "Password has been reset successfully",
  });
};
