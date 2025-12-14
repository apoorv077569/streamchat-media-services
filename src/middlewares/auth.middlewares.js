import admin from "../config/firebase.js";

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization; // ✅ headers

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // uid yahin milega
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default verifyFirebaseToken;
