"use strict";
/**
 * Analytics Routes
 * Handles call analytics and reporting
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Mock analytics data
const generateMockAnalytics = () => {
    const now = new Date();
    return {
        overview: {
            totalCalls: 8432,
            completedCalls: 7934,
            missedCalls: 498,
            averageDuration: 222, // seconds
            successRate: 94.2,
            satisfactionRate: 92.1,
        },
        callsByHour: Array.from({ length: 24 }, (_, hour) => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            count: Math.floor(Math.random() * 50) + (hour >= 9 && hour <= 17 ? 30 : 5),
        })),
        callsByDay: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
            day,
            count: Math.floor(Math.random() * 100) + (day === 'Sat' || day === 'Sun' ? 50 : 150),
        })),
        callsByMonth: Array.from({ length: 6 }, (_, i) => {
            const date = new Date(now);
            date.setMonth(date.getMonth() - (5 - i));
            return {
                month: date.toLocaleString('default', { month: 'short' }),
                calls: Math.floor(Math.random() * 500) + 1000,
                successful: Math.floor(Math.random() * 450) + 950,
            };
        }),
        topTopics: [
            { topic: 'Appointment Scheduling', count: 342, percentage: 28 },
            { topic: 'Billing Inquiries', count: 256, percentage: 21 },
            { topic: 'Product Information', count: 198, percentage: 16 },
            { topic: 'Technical Support', count: 167, percentage: 14 },
            { topic: 'General Questions', count: 134, percentage: 11 },
            { topic: 'Complaints', count: 98, percentage: 8 },
        ],
        sentiment: {
            positive: 68,
            neutral: 24,
            negative: 8,
        },
        peakHours: [
            { hour: '9 AM', calls: 45 },
            { hour: '10 AM', calls: 78 },
            { hour: '11 AM', calls: 92 },
            { hour: '12 PM', calls: 65 },
            { hour: '1 PM', calls: 54 },
            { hour: '2 PM', calls: 88 },
            { hour: '3 PM', calls: 95 },
            { hour: '4 PM', calls: 72 },
            { hour: '5 PM', calls: 48 },
        ],
        recentCalls: Array.from({ length: 10 }, (_, i) => ({
            id: `call-${i + 1}`,
            caller: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            type: Math.random() > 0.2 ? 'incoming' : 'outgoing',
            duration: `${Math.floor(Math.random() * 10)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            status: Math.random() > 0.1 ? 'completed' : 'missed',
            timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
            sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
        })),
    };
};
/**
 * GET /api/analytics/overview
 * Get analytics overview
 */
router.get('/overview', (req, res) => {
    const analytics = generateMockAnalytics();
    res.json(analytics.overview);
});
/**
 * GET /api/analytics/calls
 * Get call analytics
 */
router.get('/calls', (req, res) => {
    const { period = '7d' } = req.query;
    const analytics = generateMockAnalytics();
    res.json({
        period,
        byHour: analytics.callsByHour,
        byDay: analytics.callsByDay,
        byMonth: analytics.callsByMonth,
        peakHours: analytics.peakHours,
    });
});
/**
 * GET /api/analytics/topics
 * Get topic analytics
 */
router.get('/topics', (req, res) => {
    const analytics = generateMockAnalytics();
    res.json(analytics.topTopics);
});
/**
 * GET /api/analytics/sentiment
 * Get sentiment analytics
 */
router.get('/sentiment', (req, res) => {
    const analytics = generateMockAnalytics();
    res.json(analytics.sentiment);
});
/**
 * GET /api/analytics/recent
 * Get recent calls
 */
router.get('/recent', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const analytics = generateMockAnalytics();
    res.json(analytics.recentCalls.slice(0, limit));
});
/**
 * GET /api/analytics/report
 * Generate analytics report
 */
router.get('/report', (req, res) => {
    const { startDate, endDate, format = 'json' } = req.query;
    const analytics = generateMockAnalytics();
    const report = {
        generatedAt: new Date().toISOString(),
        period: {
            start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: endDate || new Date().toISOString(),
        },
        summary: analytics.overview,
        callDistribution: {
            byHour: analytics.callsByHour,
            byDay: analytics.callsByDay,
        },
        topTopics: analytics.topTopics,
        sentimentAnalysis: analytics.sentiment,
        recommendations: [
            'Consider adding more staff during peak hours (2-3 PM)',
            'Create more FAQ content for common billing inquiries',
            'Follow up on negative sentiment calls within 24 hours',
        ],
    };
    if (format === 'csv') {
        // Generate CSV format
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=analytics-report.csv');
        const csvLines = [
            'Metric,Value',
            `Total Calls,${report.summary.totalCalls}`,
            `Completed Calls,${report.summary.completedCalls}`,
            `Success Rate,${report.summary.successRate}%`,
            `Average Duration,${report.summary.averageDuration}s`,
            `Satisfaction Rate,${report.summary.satisfactionRate}%`,
        ];
        res.send(csvLines.join('\n'));
    }
    else {
        res.json(report);
    }
});
/**
 * GET /api/analytics/dashboard
 * Get all dashboard analytics
 */
router.get('/dashboard', (req, res) => {
    res.json(generateMockAnalytics());
});
exports.default = router;
//# sourceMappingURL=analytics.js.map