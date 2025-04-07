# 🧵 TrendyThreads Support Chatbot

Welcome to the **TrendyThreads Support Chatbot** project! This repository contains the code and resources for a state-of-the-art AI-powered customer support chatbot designed to streamline and enhance the user experience for TrendyThreads customers.

## 🌟 Project Overview

TrendyThreads Support Chatbot is an AI-driven customer support assistant, capable of handling a variety of customer queries with human-like interaction. Whether it's tracking orders, answering product-related questions, or processing returns, this chatbot is designed to provide instant, 24/7 assistance to customers.

## 🚀 Features

### 1. **Real-Time AI Support**
- **Dual AI Integration**: The chatbot integrates both OpenAI's GPT-3 and AWS Bedrock API, offering flexibility to switch between the two based on specific requirements.
- **Conversational Flow**: Built to understand and respond in natural language, providing users with an intuitive and seamless chat experience.

### 2. **Advanced Tech Stack**
- **Frontend**: Developed with **React** and **Next.js**, the chatbot features a responsive and user-friendly interface.
- **Backend**: The backend is powered by **Firebase**, offering real-time database updates and authentication.
- **UI/UX**: Styled with **Material-UI** and **Three.js** for a visually appealing and interactive user experience.
- **Deployment**: The chatbot is hosted on **AWS EC2**, ensuring reliability, scalability, and fast performance.

### 3. **Interactive & Responsive Design**
- **3D Animated Background**: Utilizes **Three.js** for a dynamic, engaging background that enhances user interaction.
- **Mobile Optimization**: Fully responsive design ensures smooth operation across all device types, from desktops to mobile phones.

### 4. **Future Enhancements**
- **RAG (Retrieval-Augmented Generation)**: Plans to implement RAG for contextually relevant responses based on the user's knowledge base.
- **LLM Orchestration**: Development of an LLM orchestration pattern with a router and task-specific models to optimize task handling.

## 🔧 Installation

### Prerequisites
- **Node.js** (v14 or later)
- **npm** or **yarn**
- **Firebase** account
- **AWS EC2** instance

### Steps to Run Locally

1. **Clone the Repository:**


   git clone https://github.com/pc9350/IntelliAid-AI-Customer-Support.git
   cd TrendyThreads-Chatbot

2. **Install Dependencies:**


   npm install<br>
   **or**<br>
   yarn install

3. **Set Up Enviromental Variables:**


   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_project_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_project_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_project_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_project_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_project_measurement_id
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_AWS_BEDROCK_API_KEY=your_aws_key
   NEXT_PUBLIC_AWS_BEDROCK_API_SECRET_KEY=your_aws_secret_key
   AWS_REGION=your_assigned_region
   USE_BEDROCK=true/false

4. **Run the Application:**


   npm run dev<br>
   **or**<br>
   yarn dev

   Access the application at http://localhost:3000.

5. **Deploy on AWS EC2:**


   Follow the standard deployment process for Next.js applications on AWS EC2. Make sure to configure your server to serve the application on port 3000.

### 🌐 Live Demo

Experience the chatbot live: [TrendyThreads Chatbot Demo](http://ec2-3-92-47-86.compute-1.amazonaws.com/)

### 📹 Project Video

Check out our [3-minute video presentation](https://youtu.be/X4ARZE1sL_M) that walks you through the features, design, and technology behind the TrendyThreads Support Chatbot.

### 🚀 Deployment on Vercel

This project has been migrated from AWS EC2 to Vercel for improved performance, easier maintenance, and cost efficiency.

#### Steps to Deploy on Vercel:

1. **Prepare Your Repository**:
   - Ensure your code is pushed to a GitHub, GitLab, or Bitbucket repository

2. **Sign Up for Vercel**:
   - Create an account at [vercel.com](https://vercel.com)
   - Connect your Git provider account

3. **Import Your Project**:
   - From the Vercel dashboard, click "Add New..." → "Project"
   - Select your repository from the list

4. **Configure Project**:
   - Project Name: Choose a name for your deployment
   - Framework Preset: Select "Next.js"
   - Environment Variables: Add all the required environment variables:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
     - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
     - `NEXT_PUBLIC_OPENAI_API_KEY`
     - `NEXT_PUBLIC_AWS_BEDROCK_API_KEY`
     - `NEXT_PUBLIC_AWS_BEDROCK_API_SECRET_KEY`
     - `AWS_REGION`
     - `USE_BEDROCK`

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application automatically

6. **Custom Domain (Optional)**:
   - In the project settings, navigate to "Domains"
   - Add your custom domain and follow the verification steps

#### Advantages of Vercel over EC2:
- **Zero Configuration**: Optimized deployments without server management
- **Automatic HTTPS**: SSL certificates are automatically provisioned
- **Serverless Functions**: API routes automatically become serverless functions
- **Preview Deployments**: Every pull request gets its own preview URL
- **Analytics**: Built-in performance and usage analytics
- **CDN by Default**: Content is automatically served from edge locations

### 🛠️ Functionality Enhancements

The project is undergoing the following improvements:

1. **Enhanced Chat Experience**:
   - Context retention between chat sessions
   - Improved response accuracy and relevance
   - Better handling of complex queries

2. **UI/UX Improvements**:
   - More intuitive interface with clear response indicators
   - Improved mobile responsiveness
   - Accessibility enhancements

3. **Performance Optimizations**:
   - Reduced API response times
   - Optimized 3D background for lower-end devices
   - Better state management to prevent unnecessary renders

4. **Added Features**:
   - Product catalog integration
   - Order tracking simulation
   - Multi-language support
   - Chat history for registered users

### 🎯 Future Plans

Given more time, the next steps for this project include:

- **RAG Implementation**: Integrating Retrieval-Augmented Generation to provide responses tailored to a user's specific knowledge base.
- **LLM Orchestration**: Creating a robust LLM orchestration pattern that includes a router and task-specific models, optimizing the chatbot's efficiency and accuracy.

### 👥 Team & Collaboration

This project was a collaborative effort, blending the technical expertise and creativity of the team. Special thanks to **[@isha038](https://github.com/isha038)** for their valuable contributions. Working together was not only productive but also a truly exciting experience as we tackled challenges and innovated solutions.
   