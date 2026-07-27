import { registerService } from "./auth.service.js";
import { loginService } from "./auth.service.js";
import { getCurrentUserService } from "./auth.service.js";
import { verifyEmailService } from "./auth.service.js";
import { forgotPasswordService } from "./auth.service.js";
import { resetPasswordService } from "./auth.service.js";
import { accessTokenCookieOptions } from "../../shared/constants/cookieOptions.js";

export const register = async (req, res, next) => {
    try{
        const user = await registerService(req.body)

        return res.status(201).json({
            success: true,
			message: "User registered successfully",
			data: {
				user,
			},
        });
    }catch(error){
        next(error);
    }
};

export const login = async (req, res, next) => {
    try{
        const {token, user} = await loginService(req.body);

        res.cookie(process.env.COOKIE_NAME, token, accessTokenCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user,
        });
        
    }catch(error){
        next(error);
    }
};

export const getCurrentUser = async (req,res,next) => {
    try{

        const user = await getCurrentUserService(req.user.id);
        return res.status(200).json({
            success: true,
            data: {
                user,
            },
        });
    }catch(error){
        next(error);
    }
};

export const verifyEmail = async (req,res,next) => {
    try{
        const result = await verifyEmailService(req.body.token);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
};

export const forgotPassword = async (req,res,next) => {
    try{
        const result = await forgotPasswordService(req.body.email);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }

};

export const resetPassword = async (req,res,next) => {
    try{
        const result = await resetPasswordService(req.body.token, req.body.password);
        res.status(200).json(result);
    }catch(error){
        next(error);
    }
}

export const logout = async (req,res,next) => {
    res.clearCookie(process.env.COOKIE_NAME, accessTokenCookieOptions);
    return res.status(200).json({
        success: true,
        message: "Logged out successfully.",
    });
};

import { googleLoginService } from "./auth.service.js";

export const googleLogin = async (req, res, next) => {
    try {
        const { token: googleToken, role } = req.body;
        const { token, user } = await googleLoginService(googleToken, role);

        res.cookie(process.env.COOKIE_NAME, token, accessTokenCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Google login successful",
            token,
            user,
        });
    } catch (error) {
        next(error);
    }
};