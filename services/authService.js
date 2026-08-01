const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { toUserDTO } = require("../dto/user.dto");

const User = require("../models/User");

const register = async ({ name, whatsapp, password }) => {

    const existingUser = await User.findOne({ whatsapp });

    if (existingUser) {
        throw new Error("WhatsApp number already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = await User.create({
        name,
        whatsapp,
        password: hashedPassword,
    });

    return user;
};

const login = async ({ whatsapp, password }) => {

    const user = await User.findOne({ whatsapp });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        {
            id: user._id,
            whatsapp: user.whatsapp,
             role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

return {
    token,
    user: toUserDTO(user),
};
};

const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return toUserDTO(user);
};

module.exports = {
    register,
    login,
    getCurrentUser,
};