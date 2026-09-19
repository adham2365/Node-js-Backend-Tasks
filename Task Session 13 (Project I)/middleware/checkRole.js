export function checkRole(...roles) {
    return (req, res, next) => {
        return roles.includes(req.user.role)
        ? next()
        : res.status(403).json({ error: "forbidden" })
    }
}