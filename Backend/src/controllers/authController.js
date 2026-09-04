import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import jwt from 'jsonwebtoken';
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  cookieOptions,
  ACCESS_COOKIE_MAXAGE,
  REFRESH_COOKIE_MAXAGE
}  from '../utils/helpers.js';


// login API handler
// Check if credentials were provided
// Finds user from the database
// Compares the hashed password
// Signs a jwt access token and a long-lived refresh token
// Persists the refresh token in the database for revocation
// Returns both tokens with the response cookies
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Email or password is required" });
    }


    const user = await User.findOne({ email: email }).select(["-__v"]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    const isSame = await comparePassword(password, user.password);

    if (!isSame) {
      return res.status(401).json({ error: "Invalid Password" });
    }


    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = generateRefreshToken(user.id);

    const refreshTokenDoc = new RefreshToken({
      user: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_COOKIE_MAXAGE),
    });
    await refreshTokenDoc.save();

    res.cookie("token", accessToken, cookieOptions(ACCESS_COOKIE_MAXAGE));
    res.cookie("refreshToken", refreshToken, cookieOptions(REFRESH_COOKIE_MAXAGE));

    return res.status(200).json(user);
  }
  catch (error) {
    return res.status(500).json({ error: "server error occured" });
  }
};


// refresh API handler
// Reads the refresh token from the cookies
// Verifies it with the refresh token secret
// Confirms the token still exists in the database
// Rotates: deletes the old token, issues a new access + refresh token
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const user = await User.findById(payload.id).select("username");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    await RefreshToken.deleteOne({ _id: stored._id });

    const newAccessToken = generateAccessToken(user.id, user.username);
    const newRefreshToken = generateRefreshToken(user.id);

    const newRefreshTokenDoc = new RefreshToken({
      user: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_COOKIE_MAXAGE),
    });
    await newRefreshTokenDoc.save();

    res.cookie("token", newAccessToken, cookieOptions(ACCESS_COOKIE_MAXAGE));
    res.cookie("refreshToken", newRefreshToken, cookieOptions(REFRESH_COOKIE_MAXAGE));

    return res.status(200).json({ message: "Token refreshed successfully" });
  }
  catch (error) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};


// logout API handler
// Reads and revokes the refresh token so it can no longer be used
// Clears both the access and refresh token cookies
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.clearCookie("token", cookieOptions(ACCESS_COOKIE_MAXAGE));
    res.clearCookie("refreshToken", cookieOptions(REFRESH_COOKIE_MAXAGE));

    return res.status(200).json({ message: "Logout successful" });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server error occured" });
  }
};
