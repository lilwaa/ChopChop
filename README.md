# ChopChop
What the project does
Why the project is useful
How users can get started with the project
Where users can get help with your project
Who maintains and contributes to the project




# ChopChop
ChopChop is a web-based application designed to help college students efficiently manage their meals, reduce food waste, and maintain a healthier diet. The app provides a suite of features aimed at simplifying meal prep, grocery shopping, and nutritional tracking, including:
1. ChopTrack: Tracks the expiration dates of ingredients and generates weekly grocery lists.
2. ChopGuide: Suggests recipes based on available ingredients and dietary preferences.

# Background
The transition to college life brings unique challenges, particularly in maintaining a balanced diet amidst limited time, budgets, and resources. Many students struggle with meal planning, unhealthy eating habits, and food waste, which can lead to poor health and increased expenses.

ChopChop addresses these challenges by providing an intuitive, web-based solution that helps students manage their meals, track ingredients, generate recipes based on available supplies, and monitor nutrition. By simplifying meal prep and grocery shopping, ChopChop empowers college students to adopt healthier, more cost-effective lifestyles while reducing food waste and promoting a sense of community through shared resources.

# Getting Started

### Install Dependencies
cd choptrack4
```
npm install -g firebase-tools  
npm install firebase-functions firebase-admin  
npm install @mui/material @emotion/react @emotion/styled  
npm install @mui/x-date-pickers @date-io/date-fns date-fns  
npm install @mui/icons-material 
npm install react-calendar  
npm install uuid  
npm install react-router-dom  
npm install lucide-react  
npm install chart.js react-chartjs-2
```
cd choptrack4/functions  
```
npm install @google-cloud/vision  
npm install @google-cloud/language  
npm install uuid  
npm install twilio
```

### Firebase Access: used Authentication, Firestore, Storage, Functions
[Firebase access](https://console.firebase.google.com/u/0/project/choptrack-801d8/overview)

### Folder of Receipts: /receipts]
To produce the same results as our demos, a folder of receipts used will be given, including 3x Publix receipts and 1x Kroger receipt. Feel free to test upload and parsing functions :) 

### Disclaimer
1. Twilio SMS: for trial account, only verified numbers (i.e. manually added / checked w/ authentication code) will receive messages
2. Twilio SMS account expires after 12/20
3. Firebase is upgraded to pay-as-you-go plan, Google Vision API and Language API limited to 1000 calls/month, please refrain from excessive storage and amounts of calls. 
4. All services (APIs, firebase) will be discontinued after the semester


# Authors
@ybae45
@jiyaushah
@lilwaa
@YutongHu-Natalie



