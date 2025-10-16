# 🏥 Healthcare Symptom Checker

An AI-powered healthcare symptom checker that uses Large Language Models (LLM) to analyze symptoms and provide educational information about possible conditions and recommended next steps.

## ⚠️ Medical Disclaimer

**IMPORTANT:** This application is for **educational purposes only** and should NOT be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## ✨ Features

- 🤖 **AI-Powered Analysis** - Uses advanced LLM for symptom interpretation
- 💬 **Interactive Chat Interface** - Natural conversation flow
- 📊 **Detailed Reports** - Comprehensive analysis with condition probabilities
- 📝 **History Tracking** - Save and review past consultations
- 🎨 **Beautiful UI** - Modern, professional, and user-friendly design
- 🔒 **Privacy Focused** - Secure data handling
- 📱 **Fully Responsive** - Works on all devices
- 🌓 **Dark/Light Mode** - Comfortable viewing experience

## 🏗️ Architecture

```
├── client/          # React frontend with Vite
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── api/          # API integration
│   │   └── styles/       # CSS styles
│   └── package.json
│
├── server/          # Node.js/Express backend
│   ├── config/      # Configuration files
│   ├── controllers/ # Request handlers
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   ├── services/    # Business logic & LLM integration
│   └── package.json
│
└── package.json     # Root package file
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **SQLite + Sequelize** - Database & ORM
- **OpenAI API** - LLM integration
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- OpenAI API key (get one at https://platform.openai.com/)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd healthcare-symptom-checker
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**

Copy the example environment file and add your OpenAI API key:
```bash
copy server\.env.example server\.env
```

Edit `server/.env` and add:
```env
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
```

4. **Start the development servers**
```bash
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

## 📖 Usage

1. **Register/Login** - Create an account or log in
2. **Describe Symptoms** - Enter your symptoms in detail
3. **Get Analysis** - Receive AI-generated insights
4. **Review Recommendations** - See possible conditions and next steps
5. **Save History** - Access previous consultations

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Symptom Analysis
- `POST /api/symptoms/analyze` - Analyze symptoms with LLM
- `GET /api/symptoms/history` - Get user's consultation history
- `GET /api/symptoms/history/:id` - Get specific consultation
- `DELETE /api/symptoms/history/:id` - Delete consultation

## 🤖 LLM Integration

The application uses OpenAI's GPT models to analyze symptoms. The prompt engineering includes:

- **Context Setting** - Medical education focus
- **Safety Disclaimers** - Always included in responses
- **Structured Output** - JSON format for easy parsing
- **Symptom Analysis** - Detailed reasoning process
- **Recommendations** - Action steps and urgency levels

Example prompt structure:
```javascript
"You are a medical education assistant. Based on these symptoms: [symptoms], 
provide possible conditions with probabilities, reasoning, and next steps. 
Always include a disclaimer that this is educational only."
```

## 🎨 Design Features

- **Modern Gradient UI** - Eye-catching color schemes
- **Smooth Animations** - Framer Motion-like transitions
- **Card-based Layout** - Clean, organized information
- **Responsive Design** - Mobile-first approach
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - User-friendly error messages
- **Accessibility** - WCAG compliant

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Environment variable protection

## 📊 Database Schema

### Users Table
- id (Primary Key)
- username
- email
- password (hashed)
- timestamps

### Consultations Table
- id (Primary Key)
- userId (Foreign Key)
- symptoms (Text)
- analysis (JSON)
- timestamp
- severity

## 🚧 Future Enhancements

- [ ] Multi-language support
- [ ] Voice input for symptoms
- [ ] Image upload for visual symptoms
- [ ] Integration with health APIs
- [ ] Appointment booking system
- [ ] Export reports as PDF
- [ ] Real-time chat with streaming responses
- [ ] Medical knowledge base search

## 📹 Demo Video

[Link to demo video will be added here]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Important Notes

1. **Not a Medical Tool** - This is an educational project
2. **Always Consult Professionals** - Seek real medical advice
3. **Data Privacy** - Be cautious with sensitive health information
4. **API Costs** - OpenAI API usage incurs costs

## 👨‍💻 Developer

Created as part of a technical assessment to demonstrate:
- LLM integration capabilities
- Full-stack development skills
- UI/UX design proficiency
- Software architecture understanding
- Code quality and documentation

---

**Remember:** This application is for educational purposes only. Always consult with healthcare professionals for medical advice.
