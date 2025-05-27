import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User';
import { logger } from '../../utils/logger';

export const registerUser = async (userData: { email: string; password: string; name: string }) => {
    try {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) { 
            logger.warn(`User with email ${userData.email} already exists`);
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({
            email: userData.email,
            passwordHash: hashedPassword,
            name: userData.name,
        }); 
        await newUser.save();
        logger.info(`User registered successfully: ${userData.email}`);
        return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
        };
    } catch (error) {
        logger.error('Error registering user:', error);
        throw new Error('Registration failed');
    }
}
export const loginUser = async (email: string, password: string) => {
    try {
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            logger.warn(`User with email ${email} not found`);
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            logger.warn(`Invalid password for user ${email}`);
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });
        logger.info(`User logged in successfully: ${email}`);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            token: token,
        };
    } catch (error) {
        logger.error('Error logging in user:', error);
        throw new Error('Login failed');
    }
}
export const getUserById = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`User with ID ${userId} not found`);
            throw new Error('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    } catch (error) {
        logger.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user');
    }
}
export const updateUser = async (userId: string, userData: { email?: string; name?: string }) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`User with ID ${userId} not found`);
            throw new Error('User not found');
        }
        if (userData.email) {
            user.email = userData.email;
        }
        if (userData.name) {
            user.name = userData.name;
        }
        await user.save();
        logger.info(`User updated successfully: ${userId}`);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    } catch (error) {
        logger.error('Error updating user:', error);
        throw new Error('Update failed');
    }
}
export const deleteUser = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`User with ID ${userId} not found`);
            throw new Error('User not found');
        }
        await user.remove();
        logger.info(`User deleted successfully: ${userId}`);
        return { message: 'User deleted successfully' };
    } catch (error) {
        logger.error('Error deleting user:', error);
        throw new Error('Delete failed');
    }
}
export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.warn(`User with ID ${userId} not found`);
            throw new Error('User not found');
        }
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isOldPasswordValid) {
            logger.warn(`Invalid old password for user ${userId}`);
            throw new Error('Invalid old password');
        }
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();
        logger.info(`Password changed successfully for user: ${userId}`);
        return { message: 'Password changed successfully' };
    } catch (error) {
        logger.error('Error changing password:', error);
        throw new Error('Change password failed');
    }
}
export const getAllUsers = async () => {
    try {
        const users = await User.find({}, '-passwordHash'); // Exclude passwordHash from the result
        return users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
        }));
    } catch (error) {
        logger.error('Error fetching all users:', error);
        throw new Error('Failed to fetch users');
    }
}
