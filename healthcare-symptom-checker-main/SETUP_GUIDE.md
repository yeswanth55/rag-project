# 🚀 Healthcare Symptom Checker - Setup Guide

## ⚠️ IMPORTANT: Get Your OpenAI API Key

Before running the application, you **MUST** obtain an OpenAI API key:

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-...`)

## 📝 Configuration

1. Open `server/.env` file
2. Replace `your_openai_api_key_here` with your actual OpenAI API key
3. Optionally, change the JWT_SECRET to a strong random string

Example:
```env
PORT=5000
DB_PATH=./database.sqlite
JWT_SECRET=my_super_secret_key_change_this_in_production
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-abc123xyz...your_actual_key_here
OPENAI_MODEL=gpt-4o-mini

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🎯 Running the Application

All dependencies are already installed! Just run:

```powershell
npm run dev
```

This will start:
- **Backend Server** on http://localhost:5000
- **Frontend Application** on http://localhost:5173

## 🌐 Access the Application

Open your browser and go to: **http://localhost:5173**

## 📱 Features to Test

1. **Register** - Create a new account
2. **Login** - Sign in to your account
3. **Dashboard** - View your health statistics
4. **Check Symptoms** - Enter symptoms and get AI analysis
5. **History** - Review past consultations
6. **View Details** - See full analysis of any consultation

## 💡 Sample Symptoms to Test

Try these examples:

### Example 1 - Mild Symptoms
```
I've been experiencing a mild headache for the past 2 days, along with slight fatigue. 
I've been working long hours on the computer lately.
```

### Example 2 - Cold/Flu Symptoms
```
I have a runny nose, sore throat, and mild fever (around 100°F). Started 3 days ago. 
Also feeling quite tired and have a persistent cough.
```

### Example 3 - Digestive Issues
```
Experiencing stomach pain and nausea for the last 24 hours. Had some unusual food yesterday. 
No vomiting yet, but feeling uncomfortable after eating.
```

## 🔍 What the AI Analyzes

The LLM will provide:
- ✅ Possible medical conditions with probability
- ✅ Detailed reasoning for each condition
- ✅ Recommended next steps
- ✅ Urgency level (low, moderate, high, emergency)
- ✅ When to seek medical help
- ✅ General health advice
- ✅ Safety disclaimers

## 🛠️ Troubleshooting

### Issue: OpenAI API Error
**Solution:** Make sure you've added your actual API key to `server/.env`

### Issue: Port already in use
**Solution:** Stop other applications using ports 5000 or 5173

### Issue: Database errors
**Solution:** Delete `server/database.sqlite` and restart the server

### Issue: Module not found
**Solution:** Run `npm run install-all` again

## 💳 API Costs

OpenAI API usage is **not free**. Using `gpt-4o-mini`:
- Very affordable (~$0.15 per 1M input tokens)
- ~$0.01-0.05 per symptom analysis
- Monitor your usage at https://platform.openai.com/usage

## 🔒 Security Notes

- Never commit `.env` files to Git
- Change JWT_SECRET in production
- Keep your OpenAI API key private
- The application uses rate limiting to prevent abuse

## 📊 Database

- SQLite database file: `server/database.sqlite`
- Automatically created on first run
- Stores users and consultation history
- No external database installation needed

## 🎨 UI Features

- ✅ Modern gradient design
- ✅ Smooth animations
- ✅ Fully responsive (mobile-friendly)
- ✅ Professional medical interface
- ✅ Clear urgency indicators
- ✅ Easy-to-read analysis results

## 📖 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Symptoms
- POST `/api/symptoms/analyze` - Analyze symptoms (requires auth)
- GET `/api/symptoms/history` - Get consultation history (requires auth)
- GET `/api/symptoms/history/:id` - Get specific consultation (requires auth)
- DELETE `/api/symptoms/history/:id` - Delete consultation (requires auth)
- GET `/api/symptoms/stats` - Get user statistics (requires auth)

## 🎬 Creating a Demo Video

When recording your demo video:

1. **Introduction** (30 seconds)
   - Explain the project purpose
   - Show the landing page

2. **Registration/Login** (30 seconds)
   - Create an account
   - Log in

3. **Dashboard** (30 seconds)
   - Tour the dashboard
   - Explain the statistics

4. **Symptom Analysis** (2 minutes)
   - Enter detailed symptoms
   - Show AI analysis in progress
   - Review the detailed results
   - Highlight key features:
     - Possible conditions
     - Urgency level
     - Recommendations
     - Disclaimers

5. **History Feature** (1 minute)
   - Show consultation history
   - View a past consultation
   - Delete a consultation

6. **Technical Highlights** (1 minute)
   - Mention LLM integration
   - Code quality
   - Safety features
   - UI/UX design

## ✅ Evaluation Checklist

Your project includes:
- ✅ LLM integration (OpenAI GPT)
- ✅ Backend API (Node.js/Express)
- ✅ Database (SQLite)
- ✅ User authentication (JWT)
- ✅ Consultation history
- ✅ Professional frontend (React)
- ✅ Safety disclaimers
- ✅ LLM reasoning quality
- ✅ Clean code design
- ✅ Comprehensive README
- ✅ Error handling
- ✅ Input validation
- ✅ Responsive design

## 🚀 Ready to Run!

Everything is set up! Just add your OpenAI API key and run:

```powershell
npm run dev
```

Then open http://localhost:5173 and start testing! 🎉

---

**Remember:** This is for educational purposes only. Always consult real healthcare professionals!
