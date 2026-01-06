"use strict";
/**
 * Training Routes
 * Handles voice model training and sample management
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/training/');
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${(0, uuid_1.v4)()}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/m4a', 'audio/x-m4a'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only WAV, MP3, and M4A are allowed.'));
        }
    },
});
// In-memory storage for training samples (use database in production)
const trainingSamples = new Map();
const voiceModels = new Map();
/**
 * POST /api/training/upload
 * Upload training audio sample
 */
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const sampleId = (0, uuid_1.v4)();
        const sample = {
            id: sampleId,
            filename: req.file.filename,
            originalName: req.file.originalname,
            uploadedAt: new Date(),
        };
        trainingSamples.set(sampleId, sample);
        res.json({
            success: true,
            sample_id: sampleId,
            filename: req.file.filename,
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        });
    }
});
/**
 * GET /api/training/samples
 * Get all training samples
 */
router.get('/samples', async (req, res) => {
    try {
        const samples = Array.from(trainingSamples.values());
        res.json(samples);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get samples' });
    }
});
/**
 * DELETE /api/training/samples/:sampleId
 * Delete a training sample
 */
router.delete('/samples/:sampleId', async (req, res) => {
    try {
        const { sampleId } = req.params;
        if (!trainingSamples.has(sampleId)) {
            return res.status(404).json({ error: 'Sample not found' });
        }
        trainingSamples.delete(sampleId);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete sample' });
    }
});
/**
 * POST /api/training/start
 * Start training a new voice model
 */
router.post('/start', async (req, res) => {
    try {
        const { name, sample_ids, personality } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Model name is required' });
        }
        if (!sample_ids || sample_ids.length === 0) {
            return res.status(400).json({ error: 'At least one sample is required' });
        }
        const modelId = (0, uuid_1.v4)();
        const model = {
            id: modelId,
            name,
            status: 'pending',
            sampleIds: sample_ids,
            personality: personality || {
                friendliness: 70,
                professionalism: 80,
                energy: 60,
                formality: 60,
            },
            createdAt: new Date(),
            progress: 0,
        };
        voiceModels.set(modelId, model);
        // Simulate training process
        simulateTraining(modelId);
        res.json({
            success: true,
            model_id: modelId,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to start training',
        });
    }
});
/**
 * Simulate training process (in production, this would be a real ML pipeline)
 */
function simulateTraining(modelId) {
    const model = voiceModels.get(modelId);
    if (!model)
        return;
    // Start training
    model.status = 'training';
    model.progress = 0;
    // Simulate progress updates
    const interval = setInterval(() => {
        const current = voiceModels.get(modelId);
        if (!current) {
            clearInterval(interval);
            return;
        }
        current.progress = (current.progress || 0) + 10;
        if (current.progress >= 100) {
            current.status = 'ready';
            clearInterval(interval);
        }
    }, 2000); // Update every 2 seconds
}
/**
 * GET /api/training/:modelId/status
 * Get training status
 */
router.get('/:modelId/status', async (req, res) => {
    try {
        const { modelId } = req.params;
        const model = voiceModels.get(modelId);
        if (!model) {
            return res.status(404).json({ error: 'Model not found' });
        }
        res.json({
            status: model.status,
            progress: model.progress,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get status' });
    }
});
/**
 * GET /api/training/models
 * Get all voice models
 */
router.get('/models', async (req, res) => {
    try {
        const models = Array.from(voiceModels.values());
        res.json(models);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get models' });
    }
});
/**
 * GET /api/training/models/:modelId
 * Get voice model details
 */
router.get('/models/:modelId', async (req, res) => {
    try {
        const { modelId } = req.params;
        const model = voiceModels.get(modelId);
        if (!model) {
            return res.status(404).json({ error: 'Model not found' });
        }
        res.json(model);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get model' });
    }
});
/**
 * PUT /api/training/models/:modelId/personality
 * Update model personality settings
 */
router.put('/models/:modelId/personality', async (req, res) => {
    try {
        const { modelId } = req.params;
        const { personality } = req.body;
        const model = voiceModels.get(modelId);
        if (!model) {
            return res.status(404).json({ error: 'Model not found' });
        }
        model.personality = {
            ...model.personality,
            ...personality,
        };
        res.json({
            success: true,
            personality: model.personality,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update personality' });
    }
});
/**
 * DELETE /api/training/models/:modelId
 * Delete a voice model
 */
router.delete('/models/:modelId', async (req, res) => {
    try {
        const { modelId } = req.params;
        if (!voiceModels.has(modelId)) {
            return res.status(404).json({ error: 'Model not found' });
        }
        voiceModels.delete(modelId);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete model' });
    }
});
exports.default = router;
//# sourceMappingURL=training.js.map