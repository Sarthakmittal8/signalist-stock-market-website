<div align="center">
  <br />
    <img src="https://raw.githubusercontent.com/saadat-khan/Signalist_stock-tracker-app/cfec8288fdcc99d5ff68f5745a694f860298f2cf/Banner.svg" width="100%">
  <br />

  <div>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/Shadcn-18181B?style=for-the-badge&logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
    <img src="https://img.shields.io/badge/Inngest-4C51BF?style=for-the-badge&logo=serverless&logoColor=white" />
    <img src="https://img.shields.io/badge/Better%20Auth-1A73E8?style=for-the-badge&logo=auth0&logoColor=white" />
    <img src="https://img.shields.io/badge/Finnhub-0C7D5B?style=for-the-badge&logo=databricks&logoColor=white" />
  </div>

  <h3 align="center">🚀 Signalist Stock Market Website – AI-Powered Stock Market App</h3>
  <p align="center">Modern real-time financial platform with alerts, charts, watchlists, and AI insights</p>
</div>

---

## 🚀 Features

### 📊 **Real-Time Market Dashboard**
- **TradingView Widgets**: Professional-grade market overview, heatmaps, and news timeline
- **Live Stock Quotes**: Real-time pricing data with percentage changes
- **Market Analytics**: S&P 500 heatmap by market cap and performance
- **Technical Analysis**: Buy/sell signals and advanced charting tools

### 🔍 **Advanced Stock Search & Discovery**
- **Smart Search**: Debounced search with real-time suggestions via Finnhub API
- **Company Profiles**: Detailed business information, market cap, and key metrics
- **Stock Details**: Individual pages with comprehensive analysis and charts
- **Popular Stocks**: Curated list of trending and popular securities

### 📝 **Personal Watchlist Management**
- **Custom Watchlists**: Add/remove stocks with instant updates
- **Pagination**: Efficient handling of large watchlists
- **Search & Filter**: Find specific stocks within your watchlist

### 🤖 **AI-Powered Insights**
- **Gemini AI Integration**: Intelligent market analysis and personalized insights
- **News Summaries**: AI-generated daily market summaries based on your watchlist
- **Personalized Content**: Investment recommendations tailored to your profile

### 📧 **Automated Notifications**
- **Welcome Emails**: Personalized onboarding experience
- **Daily News Digest**: Automated email summaries of market news
- **Custom Scheduling**: Background jobs with Inngest for reliable delivery

### 🔐 **Secure Authentication**
- **Better-Auth Integration**: Secure session management with MongoDB
- **User Profiles**: Investment goals, risk tolerance, and preferences
- **Protected Routes**: Middleware-based authentication for all features

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15.5.2 with App Router
- **UI Library**: React 19.1.0 + Tailwind CSS 4
- **Components**: Radix UI primitives with custom styling
- **Icons**: Heroicons + Lucide React
- **State Management**: React hooks + Server Actions

### **Backend**
- **Runtime**: Node.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Better-Auth with MongoDB adapter
- **Background Jobs**: Inngest with AI integration
- **Email Service**: Nodemailer with Gmail SMTP

### **API Integrations**
- **Market Data**: Finnhub API for real-time quotes and company information
- **Charts & Widgets**: TradingView embedding for professional analysis
- **AI Processing**: Google Gemini API for intelligent content generation
- **News Feed**: Automated news aggregation and summarization

## 🏗️ Architecture

### Sequence Diagram
```mermaid
sequenceDiagram
  autonumber
  actor Cron as Scheduler
  participant Inngest as Inngest Runtime
  participant Func as sendDailyNewsSummary
  participant Users as getAllUsersForNewsEmail
  participant Watch as getWatchlistSymbolsByEmail
  participant News as getNews (Finnhub)
  participant AI as Summarizer (NEWS_SUMMARY_EMAIL_PROMPT)
  participant Mail as sendNewsSummaryEmail
  participant SMTP as Email Provider

  Cron->>Inngest: Trigger app/send.daily.news (cron 0 12 * * *)
  Inngest->>Func: Invoke function handler
  Func->>Users: Fetch all users for news email
  loop For each user
    Func->>Watch: Get watchlist symbols by email
    alt Has symbols
      Func->>News: Fetch per-symbol company news (<=6)
    else No symbols or empty results
      Func->>News: Fetch general market news (fallback)
    end
    Func->>AI: Summarize user-specific news
    AI-->>Func: Summary text
    Func->>Mail: Send summary email {email, date, content}
    Mail->>SMTP: Send
    SMTP-->>Mail: Accepted/Result
  end
  Func-->>Inngest: Return success message
```
```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant P as StockDetails (Server)
  participant W as TradingView Widgets
  participant B as WatchlistButton (Client)

  U->>P: Request /stocks/{symbol}
  activate P
  P->>P: Build per-symbol widget configs
  P-->>U: HTML with widgets and WatchlistButton
  deactivate P

  U->>W: Widgets load via embed scripts
  note right of W: symbol-info, advanced-chart, technical-analysis,<br/>company-profile, financials

  U->>B: Click toggle watchlist
  activate B
  B->>B: Update local "added" state
  B-->>U: Update icon/label
  deactivate B
```

### **Data Flow**
1. **User Authentication**: Better-Auth handles secure login/registration
2. **Market Data**: Finnhub API provides real-time stock information
3. **Watchlist Management**: MongoDB stores user preferences and selections
4. **Background Processing**: Inngest handles automated emails and AI tasks
5. **Real-Time Updates**: Server actions with optimistic UI updates

### **Key Components**
- **SearchCommand**: Debounced stock search with autocomplete
- **TradingViewWidget**: Memoized widget renderer for charts and analysis
- **WatchlistTable**: Paginated table with real-time data updates
- **Header & Navigation**: Centralized navigation with user management

## 🔧 Setup & Installation

### **Prerequisites**
- Node.js 18+ 
- MongoDB database
- Finnhub API key
- Google Gemini API key
- Gmail account for email service

### **Environment Variables**
Create a `.env.local` file with the following variables:

```bash
NODE_ENV='development'
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/signalist

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Market Data APIs
FINNHUB_API_KEY=your-finnhub-api-key
NEXT_PUBLIC_FINNHUB_API_KEY=your-finnhub-api-key
FINNHUB_BASE_URL=https://finnhub.io/api/v1

# AI Integration
GEMINI_API_KEY=your-gemini-api-key

# Email Service
NODEMAILER_EMAIL=your-gmail@gmail.com
NODEMAILER_PASSWORD=your-app-password
```

## 📱 API Endpoints

### **Finnhub Integration**
- `/quote` - Real-time stock quotes
- `/search` - Stock symbol search
- `/company-profile2` - Company information
- `/company-news` - Stock-specific news
- `/news` - General market news

### **Internal APIs**
- `/api/inngest` - Webhook endpoint for background jobs
- Server Actions for watchlist management and user operations

## 🔄 Background Jobs

### **Welcome Email Automation**
- Triggered on user registration
- Generates personalized welcome content using Gemini AI
- Sends HTML email with investment guidance

### **Daily News Summaries**
- Scheduled daily at 12 PM
- Fetches news for user watchlist stocks
- AI-powered summarization and email delivery
- Personalized content based on user preferences

## 🎨 UI/UX Features

### **Dark Mode Optimized**
- Consistent dark theme across all components
- TradingView widgets styled for dark backgrounds
- Professional financial application aesthetic

### **Responsive Design**
- Mobile-first approach with Tailwind CSS
- Optimized for desktop and mobile viewing
- Adaptive layouts for different screen sizes

### **Performance Optimizations**
- Next.js Image optimization
- Component memoization for complex widgets
- API response caching with appropriate TTL
- Debounced search to minimize API calls

## 🔐 Security Features

- **Session Management**: Secure cookie-based sessions with Better-Auth
- **Route Protection**: Middleware-based authentication for all protected routes
- **Input Validation**: Server-side validation for all user inputs
- **API Rate Limiting**: Cached responses to prevent API abuse
- **Environment Security**: Sensitive data stored in environment variables

## 📧 Email Templates

### **Welcome Email**
- Personalized greeting with user's name
- Investment guidance based on user profile
- Introduction to platform features
- AI-generated content for engagement

### **Daily News Summary**
- Market overview and key highlights
- News specific to user's watchlist
- AI-summarized content for quick reading
- Professional newsletter format

## 🚀 Deployment

### **Vercel Deployment** (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic builds on git push

### **Environment Configuration**
Ensure all environment variables are properly set in your production environment, including:
- Database connection strings
- API keys for all external services
- Email service credentials
- Background job authentication

## <a name="license">📜 License</a>

This project is licensed under the MIT License.
See [LICENSE](LICENSE)
 for more details.
