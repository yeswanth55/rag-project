const OpenAI = require('openai');

// Check if we're in demo mode
const isDemoMode = process.env.OPENAI_API_KEY === 'DEMO_MODE';

const openai = isDemoMode ? null : new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class LLMService {
  async analyzeSymptoms(symptoms, additionalInfo = {}) {
    try {
      const { age, gender } = additionalInfo;
      
      // If in demo mode, return realistic demo response
      if (isDemoMode) {
        console.log('🎭 Running in DEMO MODE - Using simulated AI responses (FREE)');
        return {
          success: true,
          analysis: this.generateDemoResponse(symptoms, age, gender),
          tokensUsed: 0,
          demoMode: true
        };
      }
      
      const systemPrompt = `You are a medical education assistant designed to help people understand potential health conditions based on symptoms. Your role is EDUCATIONAL ONLY.

CRITICAL RULES:
1. Always start your response with a clear medical disclaimer
2. Provide information for educational purposes only
3. Never diagnose or replace professional medical advice
4. Recommend consulting healthcare professionals
5. If symptoms suggest emergency, clearly state "SEEK IMMEDIATE MEDICAL ATTENTION"

Your response must be in JSON format with this exact structure:
{
  "disclaimer": "Clear medical disclaimer text",
  "possibleConditions": [
    {
      "name": "Condition name",
      "probability": "high/moderate/low",
      "description": "Brief description",
      "reasoning": "Why this condition matches the symptoms"
    }
  ],
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2"
  ],
  "urgencyLevel": "low/moderate/high/emergency",
  "whenToSeekHelp": "Specific guidance on when to seek medical help",
  "generalAdvice": "General health advice related to symptoms"
}`;

      const userPrompt = `Please analyze these symptoms and provide educational information:

Symptoms: ${symptoms}
${age ? `Age: ${age}` : ''}
${gender ? `Gender: ${gender}` : ''}

Remember to include the medical disclaimer and provide educational information only.`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(completion.choices[0].message.content);
      
      return {
        success: true,
        analysis,
        tokensUsed: completion.usage.total_tokens
      };
    } catch (error) {
      console.error('LLM Service Error:', error);
      
      // Return fallback response if LLM fails
      return {
        success: false,
        error: error.message,
        analysis: this.getFallbackResponse()
      };
    }
  }

  generateDemoResponse(symptoms, age, gender) {
    const symptomsLower = symptoms.toLowerCase();
    
    // Analyze symptoms and provide intelligent demo responses
    let conditions = [];
    let urgency = "moderate";
    let recommendations = [];
    
    // Headache detection
    if (symptomsLower.includes('headache') || symptomsLower.includes('head pain')) {
      if (symptomsLower.includes('severe') || symptomsLower.includes('worst')) {
        urgency = "high";
        conditions.push({
          name: "Migraine",
          probability: "high",
          description: "A severe headache disorder characterized by intense, throbbing pain, often accompanied by sensitivity to light and nausea.",
          reasoning: "The description of severe headache with accompanying symptoms matches typical migraine patterns. Migraines are common and can be triggered by stress, certain foods, or hormonal changes."
        });
      } else {
        conditions.push({
          name: "Tension Headache",
          probability: "high",
          description: "The most common type of headache, often caused by stress, poor posture, or eye strain.",
          reasoning: "Mild to moderate headache symptoms commonly indicate tension-type headaches, especially if related to work or screen time."
        });
      }
      recommendations.push("Rest in a quiet, dark room", "Stay hydrated", "Apply cold or warm compress to head/neck", "Consider over-the-counter pain relief if appropriate");
    }
    
    // Fever and cold symptoms
    if (symptomsLower.includes('fever') || symptomsLower.includes('temperature')) {
      urgency = "moderate";
      conditions.push({
        name: "Viral Infection",
        probability: "high",
        description: "A common infection caused by viruses, such as the common cold or flu.",
        reasoning: "Fever is a typical response to viral infections. The body raises its temperature to help fight off the infection."
      });
      recommendations.push("Get plenty of rest", "Drink lots of fluids", "Monitor temperature regularly", "Take fever-reducing medication if needed");
    }
    
    if (symptomsLower.includes('cough') || symptomsLower.includes('throat') || symptomsLower.includes('runny nose')) {
      conditions.push({
        name: "Upper Respiratory Tract Infection",
        probability: "high",
        description: "Infection of the nose, throat, and airways, commonly known as common cold or flu.",
        reasoning: "Symptoms of cough, sore throat, and nasal congestion are classic signs of upper respiratory infections, which are very common and usually self-limiting."
      });
      recommendations.push("Rest your voice", "Use throat lozenges", "Gargle with warm salt water", "Use a humidifier");
    }
    
    // Stomach issues
    if (symptomsLower.includes('stomach') || symptomsLower.includes('nausea') || symptomsLower.includes('vomit')) {
      urgency = symptomsLower.includes('severe') ? "high" : "moderate";
      conditions.push({
        name: "Gastroenteritis",
        probability: "moderate",
        description: "Inflammation of the stomach and intestines, often caused by viral or bacterial infection or food poisoning.",
        reasoning: "Stomach pain with nausea suggests gastroenteritis or food-related illness. This is common and usually resolves within a few days."
      });
      recommendations.push("Stay hydrated with clear fluids", "Eat bland foods (BRAT diet: bananas, rice, applesauce, toast)", "Avoid dairy and fatty foods temporarily", "Get plenty of rest");
    }
    
    // Fatigue
    if (symptomsLower.includes('tired') || symptomsLower.includes('fatigue') || symptomsLower.includes('exhausted')) {
      conditions.push({
        name: "General Fatigue",
        probability: "moderate",
        description: "A state of physical and/or mental tiredness that can result from various causes including lack of sleep, stress, or underlying health conditions.",
        reasoning: "Fatigue can be caused by many factors including poor sleep, stress, overwork, nutritional deficiencies, or can accompany other illnesses."
      });
      recommendations.push("Ensure 7-9 hours of quality sleep", "Maintain regular sleep schedule", "Consider stress management techniques", "Ensure proper nutrition and hydration");
    }
    
    // Default conditions if nothing specific matched
    if (conditions.length === 0) {
      conditions = [
        {
          name: "General Malaise",
          probability: "moderate",
          description: "A general feeling of discomfort, illness, or lack of well-being.",
          reasoning: "The symptoms described suggest a general state of discomfort. This could be related to various minor conditions or lifestyle factors."
        },
        {
          name: "Stress-Related Symptoms",
          probability: "moderate",
          description: "Physical symptoms that can arise from psychological stress or anxiety.",
          reasoning: "Many physical symptoms can be stress-related, especially in today's fast-paced lifestyle."
        }
      ];
      recommendations = [
        "Get adequate rest and sleep",
        "Stay hydrated and maintain a balanced diet",
        "Practice stress-reduction techniques",
        "Monitor symptoms and note any changes"
      ];
    }
    
    // Add a low-probability condition for completeness
    conditions.push({
      name: "Vitamin Deficiency",
      probability: "low",
      description: "Lack of essential vitamins can cause various symptoms including fatigue and weakness.",
      reasoning: "Certain vitamin deficiencies can present with general symptoms. A blood test can rule this out if symptoms persist."
    });
    
    return {
      disclaimer: "⚠️ MEDICAL DISCLAIMER: This is a DEMO response generated for educational purposes only. This is NOT real AI analysis and should NOT be used for actual medical decisions. This information does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional for proper medical evaluation and advice.",
      demoNotice: "🎭 DEMO MODE: This is a simulated response. For real AI-powered analysis, an OpenAI API key with credits is required.",
      possibleConditions: conditions,
      recommendations: recommendations,
      urgencyLevel: urgency,
      whenToSeekHelp: urgency === "high" 
        ? "⚠️ Seek medical attention within 24 hours or sooner if symptoms worsen" 
        : urgency === "emergency"
        ? "🚨 SEEK IMMEDIATE MEDICAL ATTENTION - Go to the emergency room or call emergency services"
        : "Consult a healthcare provider if symptoms persist for more than 3-5 days, worsen, or if you develop new concerning symptoms",
      generalAdvice: "Monitor your symptoms closely. Maintain good hydration, get adequate rest, and practice good hygiene. If you have any concerns or symptoms worsen, don't hesitate to seek professional medical advice."
    };
  }

  getFallbackResponse() {
    return {
      disclaimer: "⚠️ MEDICAL DISCLAIMER: This service is temporarily unavailable. This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.",
      possibleConditions: [
        {
          name: "Unable to analyze",
          probability: "unknown",
          description: "The AI service is currently unavailable",
          reasoning: "Please try again later or consult with a healthcare professional directly"
        }
      ],
      recommendations: [
        "Consult with a healthcare professional for proper evaluation",
        "Monitor your symptoms and seek immediate help if they worsen",
        "Keep a symptom diary to share with your doctor"
      ],
      urgencyLevel: "moderate",
      whenToSeekHelp: "If symptoms persist, worsen, or you feel concerned, please consult a healthcare provider immediately",
      generalAdvice: "Your health is important. When in doubt, always consult with a qualified healthcare professional"
    };
  }

  async testConnection() {
    if (isDemoMode) {
      console.log('🎭 DEMO MODE: No OpenAI connection needed - Using FREE simulated responses');
      return true;
    }
    
    try {
      const response = await openai.models.list();
      console.log('✅ OpenAI API connection successful');
      return true;
    } catch (error) {
      console.error('❌ OpenAI API connection failed:', error.message);
      return false;
    }
  }
}

module.exports = new LLMService();
