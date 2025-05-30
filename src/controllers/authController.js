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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const authService_1 = require("../services/authService");
const logger_1 = require("../utils/logger");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        logger_1.logger.warn('Validation error in register:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password, name } = req.body;
        const user = yield (0, authService_1.registerUser)(email, password, name);
        res.status(201).json({ message: 'User registered', user: { id: user._id, email: user.email, name: user.name } });
    }
    catch (error) {
        logger_1.logger.error('Error in register:', error);
        res.status(400).json({ error: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        logger_1.logger.warn('Validation error in login:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const { token, user } = yield (0, authService_1.loginUser)(email, password);
        res.json({ token, user });
    }
    catch (error) {
        logger_1.logger.error('Error in login:', error);
        res.status(401).json({ error: error.message });
    }
});
exports.login = login;
