const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Consultation = require('../models/Consultation');
const llmService = require('../services/llmService');

// @route   POST /api/symptoms/analyze
// @desc    Analyze symptoms using LLM
// @access  Private
router.post('/analyze', [
  auth,
  body('symptoms').trim().notEmpty().withMessage('Symptoms are required')
    .isLength({ min: 10 }).withMessage('Please provide more detailed symptoms')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { symptoms, age, gender } = req.body;

  try {
    // Analyze symptoms using LLM
    const result = await llmService.analyzeSymptoms(symptoms, { age, gender });

    if (!result.success && !result.analysis) {
      return res.status(500).json({ 
        message: 'Failed to analyze symptoms',
        error: result.error 
      });
    }

    // Save consultation to database
    const consultation = await Consultation.create({
      userId: req.user.id,
      symptoms,
      age: age || null,
      gender: gender || null,
      analysis: result.analysis,
      severity: result.analysis.urgencyLevel || 'moderate'
    });

    res.json({
      consultationId: consultation.id,
      analysis: result.analysis,
      timestamp: consultation.createdAt
    });
  } catch (err) {
    console.error('Symptom analysis error:', err);
    res.status(500).json({ message: 'Server error during analysis' });
  }
});

// @route   GET /api/symptoms/history
// @desc    Get user's consultation history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const consultations = await Consultation.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'symptoms', 'severity', 'createdAt']
    });

    res.json(consultations);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/symptoms/history/:id
// @desc    Get specific consultation
// @access  Private
router.get('/history/:id', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.json(consultation);
  } catch (err) {
    console.error('Error fetching consultation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/symptoms/history/:id
// @desc    Delete consultation
// @access  Private
router.delete('/history/:id', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    await consultation.destroy();
    res.json({ message: 'Consultation deleted successfully' });
  } catch (err) {
    console.error('Error deleting consultation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/symptoms/stats
// @desc    Get user's consultation statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const { sequelize } = require('../config/database');
    
    const totalConsultations = await Consultation.count({ 
      where: { userId: req.user.id } 
    });

    const severityCounts = await Consultation.findAll({
      where: { userId: req.user.id },
      attributes: [
        'severity',
        [sequelize.fn('COUNT', sequelize.col('severity')), 'count']
      ],
      group: ['severity']
    });

    const recentConsultation = await Consultation.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      attributes: ['createdAt']
    });

    res.json({
      totalConsultations,
      severityCounts,
      lastConsultation: recentConsultation?.createdAt || null
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
