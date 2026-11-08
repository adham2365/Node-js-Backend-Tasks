export const validateObjectId = (req, res, next) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ error: "invalid id" });
  }

  next();
};