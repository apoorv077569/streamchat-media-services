const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.MEDIA_API_KEY) {
    return res.status(401).json({ message: "Invalid API Key" });
  }

  next();
};

export default verifyApiKey;
