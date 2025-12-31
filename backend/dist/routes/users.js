"use strict";
/**
 * User Routes
 * Handles user management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// In-memory user settings store
const userSettings = new Map();
/**
 * GET /api/users/profile
 * Get user profile
 */
router.get('/profile', auth_1.authMiddleware, (req, res) => {
    const user = req.user;
    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        plan: user.plan,
        createdAt: user.createdAt,
    });
});
/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', auth_1.authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const { name, company, phone } = req.body;
        // Update user fields
        if (name)
            user.name = name;
        if (company)
            user.company = company;
        if (phone)
            user.phone = phone;
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                company: user.company,
                plan: user.plan,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
/**
 * PUT /api/users/password
 * Update password
 */
router.put('/password', auth_1.authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }
        // Verify current password
        const isValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        // Hash new password
        user.password = await bcryptjs_1.default.hash(newPassword, 12);
        res.json({ success: true, message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update password' });
    }
});
/**
 * GET /api/users/settings
 * Get user settings
 */
router.get('/settings', auth_1.authMiddleware, (req, res) => {
    const userId = req.user.id;
    const settings = userSettings.get(userId) || {
        notifications: {
            email: true,
            sms: false,
            callSummaries: true,
            weeklyReports: true,
            marketing: false,
        },
        businessContext: {
            companyName: 'My Company',
            industry: 'Technology',
            greeting: 'Thank you for calling. How may I assist you today?',
            fallbackMessage: "I apologize, but I didn't catch that. Could you please repeat?",
            businessHours: {
                monday: { start: '09:00', end: '17:00', enabled: true },
                tuesday: { start: '09:00', end: '17:00', enabled: true },
                wednesday: { start: '09:00', end: '17:00', enabled: true },
                thursday: { start: '09:00', end: '17:00', enabled: true },
                friday: { start: '09:00', end: '17:00', enabled: true },
                saturday: { start: '10:00', end: '14:00', enabled: false },
                sunday: { start: '10:00', end: '14:00', enabled: false },
            },
        },
    };
    res.json(settings);
});
/**
 * PUT /api/users/settings
 * Update user settings
 */
router.put('/settings', auth_1.authMiddleware, (req, res) => {
    try {
        const userId = req.user.id;
        const { notifications, businessContext } = req.body;
        const currentSettings = userSettings.get(userId) || {
            notifications: {},
            businessContext: {},
        };
        const updatedSettings = {
            notifications: { ...currentSettings.notifications, ...notifications },
            businessContext: { ...currentSettings.businessContext, ...businessContext },
        };
        userSettings.set(userId, updatedSettings);
        res.json({ success: true, settings: updatedSettings });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});
/**
 * GET /api/users/usage
 * Get user usage statistics
 */
router.get('/usage', auth_1.authMiddleware, (req, res) => {
    const user = req.user;
    // Mock usage data based on plan
    const planLimits = {
        starter: { minutes: 500, voiceModels: 1 },
        professional: { minutes: 2000, voiceModels: 3 },
        enterprise: { minutes: Infinity, voiceModels: Infinity },
    };
    const limits = planLimits[user.plan];
    res.json({
        plan: user.plan,
        minutesUsed: Math.floor(Math.random() * (limits.minutes * 0.7)),
        minutesLimit: limits.minutes,
        voiceModelsUsed: 1,
        voiceModelsLimit: limits.voiceModels,
        callsToday: Math.floor(Math.random() * 50),
        callsThisMonth: Math.floor(Math.random() * 500),
        billingPeriodStart: new Date(new Date().setDate(1)).toISOString(),
        billingPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString(),
    });
});
/**
 * DELETE /api/users/account
 * Delete user account
 */
router.delete('/account', auth_1.authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password is required to delete account' });
        }
        // Verify password
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        // Delete user settings
        userSettings.delete(user.id);
        // In production, delete from database and clean up related data
        res.json({ success: true, message: 'Account deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map