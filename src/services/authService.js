"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.changePassword = exports.deleteUser = exports.updateUser = exports.getUserById = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../../models/User");
const logger_1 = require("../../utils/logger");
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield User_1.User.findOne({ email: userData.email });
        if (existingUser) {
            logger_1.logger.warn(`User with email ${userData.email} already exists`);
            throw new Error('User already exists');
        }
        const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
        const newUser = new User_1.User({
            email: userData.email,
            passwordHash: hashedPassword,
            name: userData.name,
        });
        yield newUser.save();
        logger_1.logger.info(`User registered successfully: ${userData.email}`);
        return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
        };
    }
    catch (error) {
        logger_1.logger.error('Error registering user:', error);
        throw new Error('Registration failed');
    }
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findOne({
            email: email
        });
        if (!user) {
            logger_1.logger.warn(`User with email ${email} not found`);
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            logger_1.logger.warn(`Invalid password for user ${email}`);
            throw new Error('Invalid email or password');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        logger_1.logger.info(`User logged in successfully: ${email}`);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            token: token,
        };
    }
    catch (error) {
        logger_1.logger.error('Error logging in user:', error);
        throw new Error('Login failed');
    }
});
exports.loginUser = loginUser;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(userId);
        if (!user) {
            logger_1.logger.warn(`User with ID ${userId} not found`);
            throw new Error('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }
    catch (error) {
        logger_1.logger.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user');
    }
});
exports.getUserById = getUserById;
const updateUser = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(userId);
        if (!user) {
            logger_1.logger.warn(`User with ID ${userId} not found`);
            throw new Error('User not found');
        }
        if (userData.email) {
            user.email = userData.email;
        }
        if (userData.name) {
            user.name = userData.name;
        }
        yield user.save();
        logger_1.logger.info(`User updated successfully: ${userId}`);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }
    catch (error) {
        logger_1.logger.error('Error updating user:', error);
        throw new Error('Update failed');
    }
});
exports.updateUser = updateUser;
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(userId);
        if (!user) {
            logger_1.logger.warn(`User with ID ${userId} not found`);
            throw new Error('User not found');
        }
        yield user.remove();
        logger_1.logger.info(`User deleted successfully: ${userId}`);
        return { message: 'User deleted successfully' };
    }
    catch (error) {
        logger_1.logger.error('Error deleting user:', error);
        throw new Error('Delete failed');
    }
});
exports.deleteUser = deleteUser;
const changePassword = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(userId);
        if (!user) {
            logger_1.logger.warn(`User with ID ${userId} not found`);
            throw new Error('User not found');
        }
        const isOldPasswordValid = yield bcryptjs_1.default.compare(oldPassword, user.passwordHash);
        if (!isOldPasswordValid) {
            logger_1.logger.warn(`Invalid old password for user ${userId}`);
            throw new Error('Invalid old password');
        }
        user.passwordHash = yield bcryptjs_1.default.hash(newPassword, 10);
        yield user.save();
        logger_1.logger.info(`Password changed successfully for user: ${userId}`);
        return { message: 'Password changed successfully' };
    }
    catch (error) {
        logger_1.logger.error('Error changing password:', error);
        throw new Error('Change password failed');
    }
});
exports.changePassword = changePassword;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find({}, '-passwordHash'); // Exclude passwordHash from the result
        return users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
        }));
    }
    catch (error) {
        logger_1.logger.error('Error fetching all users:', error);
        throw new Error('Failed to fetch users');
    }
});
exports.getAllUsers = getAllUsers;
