import bcrypt from "bcryptjs";

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password,hashedPassword);
};