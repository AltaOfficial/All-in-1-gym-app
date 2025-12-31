# 💪 Strive

<div align="center">
  
  **All-in-one fitness tracking app that makes gym progress visible and meal planning effortless**
  
</div>

<div align="center">
  <img width="1920" height="1080" alt="thumbnail" src="https://github.com/user-attachments/assets/ec6bdbd1-648c-4a1c-9fb0-160e18b76009" />
</div>

## 📦 Technologies

**Backend:**
* Java
* Spring Boot
* PostgreSQL
* Maven
* JWT

**Mobile:**
* React Native
* TypeScript
* Expo
* React

**Infrastructure:**
* Docker
* Terraform
* Azure
* GitHub Actions

**Monitoring:**
* Sentry

## 🦄 Features

### 📊 Track Everything That Matters
<div align="center">
  <img width="240" height="1068" alt="image" src="https://github.com/user-attachments/assets/f65d948f-aab0-492c-880a-540e578625f6" />
  <p><i>Search 300k+ foods, scan barcodes, log meals, and track macros in real-time</i></p>
</div>

**Core Features:**
* **Food Tracking**: Search and log meals from USDA's 300,000+ food database
* **Barcode Scanner**: Instantly find foods by scanning their barcode
* **Custom Foods**: Add your own foods when they're not in the database
* **Recent Foods**: Quick access to previously logged foods
* **Meal Planning**: Plan your meals ahead of time by day (e.g., set Wednesday's three meals in advance)
* **Grocery List**: Generate shopping lists based on your planned meals

### 💪 Never Miss a Rep
<div align="center">
  <img src="https://github.com/user-attachments/assets/27c77a7f-fcdf-4e6a-b063-f955f13c31c3" alt="Workout Tracking Flow" width="240" height="1068"/>
  <p><i>Create custom workouts, track sets with effort scores, and visualize strength gains</i></p>
</div>

**Core Features:**
* **Workout Tracker**: Track your lifts with exercise illustrations and form guidance
* **Set-by-Set Logging**: Record weight, reps, and effort score for each set
* **Custom Workouts**: Create and save workout templates for different training days
* **Rest Timer**: Built-in rest periods between sets
* **Exercise Library**: Comprehensive database with visual demonstrations

### 📈 See Your Progress
<div align="center">
  <img src="https://github.com/user-attachments/assets/993d3dab-b041-4a98-9958-c637791852bf" alt="Workout Tracking Flow" width="240" height="1068"/>
  <p><i>Weight trends, muscle gain, grocery lists, and meal planning - all in one place</i></p>
</div>

**Core Features:**
* **Progress Visualization**: See positive trends in your lifts even when mirror progress isn't obvious
* **Weight Tracking**: Chart your weight over time with customizable date ranges
* **Body Composition**: Track body fat percentage and calculate muscle vs. fat weight
* **Macro Dashboard**: Real-time macro tracking with visual progress rings
* **Progress Photos**: Upload front and side photos to track visual changes

**Planned Enhancements:**
* **Incremental Search**: Filter through recently added foods as you type, reducing API calls
* **YouTube Recipe Integration**: Paste YouTube video links to extract ingredients (pending better food database access)
* **Expanded Food Database**: Integrate a larger, more comprehensive free database without insane rate limits

## 🎯 Why I Built This

For the past 5-10 years, I kept trying to get into the gym but always ran into the same problems:
* "I don't have time"
* "I don't have the money"
* The food I ate didn't taste good
* I wasn't sure if I was actually growing

**The breaking point:** Last year I tried again with a spreadsheet from a course I bought, but it didn't cover everything I needed to see, so I got discouraged and gave up too early.

**The solution:** Build an app that gives me complete visibility into my progress. Now, even when I look in the mirror and don't see changes, I can open my workout tracker and see that my weight has a positive trend, my muscle weight (calculated using body fat percentage) is going up, and I'm lifting more than last month. This makes going to the gym feel easy because I have proof of progress.

<div align="center">
  <img src="https://github.com/user-attachments/assets/7d1f50ac-ed66-4535-8d09-549de89a5e7f" alt="muscle gain/loss image" width="240" height="1068"/>
  <p><i>Real data from my journey - seeing concrete proof makes consistency easy</i></p>
</div>

## 👩🏽‍🍳 The Process

### Defining Core Features & Design

<div align="center">
  <img width="1000" height="829" alt="figma design" src="https://github.com/user-attachments/assets/ae555a38-430f-4a4a-bdfe-fb5331e4f079" />
  <a href="https://www.figma.com/design/EVORWwy4PGKL68pdfl1fcM/strive.-gym-app?node-id=0-1&t=1elftg3tj6oCITV6-1">take a closer look</a>
</div>
<br/>
I started by brainstorming features with ChatGPT to make the app feel complete. It suggested several ideas - I kept the ones that made sense (grocery list, daily meal planning) and discarded what I didn't deem necessary.

**Design came first:** I got a Mobbin subscription and spent significant time designing the entire app in Figma. This took longer than expected, but I wanted the app to look really nice. The design phase actually took up most of the project timeline, but I'm very happy with how it turned out.

### Choosing the Tech Stack

**Why Spring Boot?**
The primary goal of this project was to learn Spring Boot and cloud deployment. I wanted to understand proper backend architecture after my experience with Express.js, where everything can get convoluted very easily if you're a beginner (which I was).

After seeing the structure and separation of concerns with Spring Boot, it completely changed how I think about backend development. The architecture just makes sense, and it's going to affect every backend project I do going forward.

**Why Azure?**
I wanted to learn cloud deployment but didn't want expensive AWS costs (I wanted to stay under $5/month, which is asking a lot from AWS). My dad has a nonprofit company that receives Azure credits every year, so I leveraged that to host the Spring Boot backend on Azure.

**Why React Native?**
I wanted a mobile app that could work on both iOS and Android. React Native with Expo made the most sense for cross-platform development.

#### Infrastructure Decision Process

Before settling on Azure, I mapped out a complete AWS + Docker infrastructure stack to understand what production deployment would actually look like:

<table>
<tr>
<td><strong>Layer</strong></td>
<td><strong>Technology</strong></td>
<td><strong>What It Does</strong></td>
<td><strong>Est. Cost</strong></td>
</tr>
<tr>
<td>Mobile (Dev)</td>
<td>React Native + Expo CLI + Docker</td>
<td>Cross-platform mobile app; Docker standardizes dev setup</td>
<td>Free</td>
</tr>
<tr>
<td>Mobile (Runtime)</td>
<td>Expo Go / App Store / Play Store</td>
<td>Final app runs natively on devices</td>
<td>Free</td>
</tr>
<tr>
<td>Backend</td>
<td>Java + Spring Boot (Dockerized)</td>
<td>API logic packaged in Docker and deployed to EC2</td>
<td>~$5–10</td>
</tr>
<tr>
<td>Database</td>
<td>PostgreSQL</td>
<td>Structured storage for users, workouts, meals</td>
<td>Included</td>
</tr>
<tr>
<td>Storage</td>
<td>AWS S3</td>
<td>Stores user uploads like progress photos</td>
<td><$1</td>
</tr>
<tr>
<td>Email</td>
<td>AWS SES / SendGrid</td>
<td>Sends transactional emails (verification, password reset)</td>
<td>Free (within SES free tier)</td>
</tr>
<tr>
<td>Auth</td>
<td>Spring Security + JWT</td>
<td>Handles secure login and access control</td>
<td>Free</td>
</tr>
<tr>
<td>Hosting</td>
<td>AWS EC2 + Docker</td>
<td>Hosts Spring Boot backend inside Docker container</td>
<td>~$5–10</td>
</tr>
<tr>
<td>CI/CD</td>
<td>GitHub Actions + Docker</td>
<td>Automates image builds, tests, deployment for backend</td>
<td>Free</td>
</tr>
<tr>
<td>Monitoring</td>
<td>AWS CloudWatch + Sentry</td>
<td>Logs/metrics (infra) and app error tracking</td>
<td>~$1–5</td>
</tr>
<tr>
<td>Container Registry</td>
<td>AWS ECR (or GitHub CR)</td>
<td>Stores backend Docker images</td>
<td>Free or <$1</td>
</tr>
<tr>
<td>CDN</td>
<td>AWS CloudFront (optional)</td>
<td>Speeds up S3 file delivery</td>
<td><$1</td>
</tr>
<tr>
<td>DNS</td>
<td>AWS Route 53</td>
<td>Maps domain to EC2 IP</td>
<td>$0.50</td>
</tr>
<tr>
<td>Infra as Code</td>
<td>Terraform + Docker</td>
<td>Automates provisioning of EC2, S3, Route 53</td>
<td>Free</td>
</tr>
</table>

**Total estimated AWS cost: ~$10-15/month minimum**

This was way over my $5/month budget, and that's before accounting for potential overage charges. When I found out about my dad's nonprofit Azure credits, the decision became obvious - I could learn cloud deployment without worrying about costs.

#### **Final Tech Stack**

<table>
<tr>
<td><strong>Technology</strong></td>
<td><strong>Category</strong></td>
<td><strong>Reason</strong></td>
</tr>
<tr>
<td><strong>React Native + Expo</strong></td>
<td>Mobile Framework</td>
<td>Cross-platform mobile development</td>
</tr>
<tr>
<td><strong>TypeScript</strong></td>
<td>Language</td>
<td>Type safety for frontend code</td>
</tr>
<tr>
<td><strong>Spring Boot</strong></td>
<td>Backend Framework</td>
<td>Clean architecture, separation of concerns, learning goal</td>
</tr>
<tr>
<td><strong>Java</strong></td>
<td>Backend Language</td>
<td>Required for Spring Boot, type-safe</td>
</tr>
<tr>
<td><strong>PostgreSQL</strong></td>
<td>Database</td>
<td>Relational database for structured fitness/meal data</td>
</tr>
<tr>
<td><strong>Maven</strong></td>
<td>Build Tool</td>
<td>Java dependency management and build automation</td>
</tr>
<tr>
<td><strong>JWT</strong></td>
<td>Authentication</td>
<td>Secure token-based authentication</td>
</tr>
<tr>
<td><strong>Docker</strong></td>
<td>Containerization</td>
<td>Local PostgreSQL database for development</td>
</tr>
<tr>
<td><strong>Terraform</strong></td>
<td>Infrastructure as Code</td>
<td>Automated cloud resource provisioning</td>
</tr>
<tr>
<td><strong>Microsoft Azure</strong></td>
<td>Cloud Hosting</td>
<td>Free credits through nonprofit, learning cloud deployment</td>
</tr>
<tr>
<td><strong>GitHub Actions</strong></td>
<td>CI/CD</td>
<td>Automated testing and deployment pipeline</td>
</tr>
<tr>
<td><strong>Sentry</strong></td>
<td>Monitoring</td>
<td>Error tracking and performance monitoring</td>
</tr>
<tr>
<td><strong>USDA Food Database</strong></td>
<td>Food Data API</td>
<td>Free tier with 300k+ foods (wanted Nutrition X with 1M+, but free tier shut down)</td>
</tr>
<tr>
<td><strong>Figma</strong></td>
<td>Design</td>
<td>Complete UI/UX design before coding</td>
</tr>
<tr>
<td><strong>Mobbin</strong></td>
<td>Design Inspiration</td>
<td>Mobile app design patterns and inspiration</td>
</tr>
</table>

### Technical Challenges I Faced

#### 1. Finding a Free, Comprehensive Food Database

**The Problem:** USDA's food database has 300,000 foods, which is decent, but there are a lot of missing items. I found Nutrition X, which had 1 million+ foods - exactly what I needed. It seemed like it would do the job completely.

**The Plot Twist:** Nutrition X shut down their free tier and is now only available for commercial and enterprise use.

**Current Situation:** While users can create custom foods when something isn't available, it would be much easier if they could just use the barcode scanner and have it show up the first time. When a food doesn't show up, you have to either search using different keywords and scroll through a list of similar (but not quite right) items until you either find it buried in the results or confirm it's not there at all. Or you can add it as a custom food, which works but isn't as seamless.

#### 2. Apple Distribution Requires $99/Year

**The Problem:** A friend saw the app and wanted to use it (thought it looked simpler than MyFitnessPal). On Android, I could just give him the .APK file and he'd be done. But for Apple, you need a $99/year developer subscription to distribute apps - even to just one person.

**The Reality:** This effectively forces you into a business model where you should be charging money from customers. That's not what I wanted - this was meant to be a free app for maybe 5-10 people max to ever use.

**Current Situation:** Android users can use it, iOS users are locked out unless I pay $99/year. If enough iOS users ask for it, I might consider getting the subscription.

#### 3. Walmart API is Closed

**The Vision:** I wanted a feature where you could paste a YouTube recipe video link, extract all the ingredients, and then look them up on Walmart's website to add to your grocery list.

**The Reality:** Walmart's API is closed to the public. The alternative would be web scraping their actual site, but they have heavy anti-bot measures. After researching, I decided it wasn't worth the time investment for just a small feature.

**Status:** Feature shelved for now.

#### 4. Next.js Server Actions for Data Fetching

**The Problem:** Before starting this project, I was using Next.js Server Actions for fetching data from the backend. I found out that's not the right way to do it - if you're trying to fetch multiple pieces of data, Next.js won't do it all at the same time. It'll do it one after the other after the other, which is very inefficient.

**What I Learned:** This taught me I shouldn't use Server Actions for backend calls. Instead, I should do it in client-side frontend code using regular fetches, not Server Actions.

#### 5. Manual Deployment Hell

**The Problem:** Whenever I wanted to fix a bug or add a feature, I had to manually:
1. Push code to the Azure repository
2. Shut down the app service
3. Restart it again
4. Make sure all the correct environment variables were set
5. Push a change to EAS so the mobile app could update

This entire process was tedious and error-prone.

**The Solution:** GitHub Actions automated everything. Now I can just code a new feature or fix a bug, commit it to the repository, and in the next 10 minutes everything resets and does exactly what it needs to do. Terraform handles the infrastructure structure, and GitHub Actions handles the deployment workflow.

**What I Learned:** The pain of manual deployment really drove home the value of CI/CD. Going from a multi-step manual process to just committing code and waiting 10 minutes for automatic deployment was a game-changer.

## 📚 What I Learned

### 🔧 Technical Skills

* **Spring Boot Architecture**: Coming from Express.js where everything can get convoluted very easily as a beginner, Spring Boot's structure and separation of concerns completely changed how I think about backend development. The architecture just makes sense and will affect every backend project I do going forward.

* **Cloud Deployment & Infrastructure Planning**: Mapped out a complete AWS infrastructure stack with cost estimates before realizing Azure's free credits were the better option. Learned to evaluate cloud providers based on actual project needs vs. theoretical "best practices."

* **CI/CD Pipelines**: Set up GitHub Actions to automate testing and deployment. Experienced firsthand how automated pipelines eliminate deployment pain - going from manual multi-step processes to just committing code and waiting 10 minutes for everything to deploy.

* **Leveraging AI Effectively**: This was the first project where I truly learned how to utilize AI with coding. In the past, I didn't trust AI or would forget it existed while coding. For this project, I used Claude Code to build out most of the frontend, which made development significantly faster.

* **Mobile Development**: Built a cross-platform mobile app with React Native and Expo. Learned the differences between iOS and Android distribution.

* **API Integration**: Integrated with USDA's food database API for nutritional data lookup.

### 🎯 Project Management

* **Design-First Approach**: Spending significant time on Figma design before writing code helped clarify the vision and resulted in a much prettier app. Though it took longer than expected, it was worth it.

* **MVP vs. Perfect**: ChatGPT suggested many features, but I learned to be selective and only implement what was truly necessary. Not everything needs to be built in v1.

* **Time Estimates**: Expected 2-3 weeks, took 1-1.5 months. The Figma design phase took the most time, but was crucial for the final product quality.

* **Shipping vs. Perfection**: The app works and does everything I need it to do. There are maybe one or two bugs that need fixing and a few quality of life improvements that could be made, but since they aren't critical, I'm not too concerned with getting them fixed right now. Better to ship something functional than chase perfection.

### 💼 Product Lessons

* **Platform Distribution Barriers**: Apple's $99/year requirement creates a significant barrier for small, free apps. It forces you into a commercial model even when you just want to help a few friends.

* **Free Tier Reliability**: Nutrition X shutting down their free tier taught me that free services can disappear. Always have a backup plan or be prepared to migrate.

* **Cost Planning Matters**: Mapping out the full AWS infrastructure stack revealed $10-15/month costs vs. my $5 budget. Finding Azure credits saved the project from being cost-prohibitive.

* **Solving Your Own Problems**: Building an app to solve my own gym tracking needs resulted in something genuinely useful. Now going to the gym feels easy because I have complete visibility into my progress.

### 🧠 Technical Highlights

* **Progress Tracking System**: Built a workout tracker that visualizes weight progression over time, giving concrete proof of improvement even when visual changes aren't obvious

* **Meal Planning Engine**: Created a system to plan meals by day of the week and generate grocery lists automatically

* **Food Search with Custom Foods**: Implemented search through 300k+ foods with the ability to create custom foods when items aren't in the database

* **Full CI/CD Pipeline**: Automated build, test, and deployment process using GitHub Actions, Docker, and Terraform

## 💭 Current State & Future Vision

### Where It Is Now
This is a **functional personal project** that I use daily for gym tracking. It works great for my needs:
- Core features all work as intended
- Currently 1-2 users (me and potentially a friend)
- One or two minor bugs that aren't critical
- A few quality of life improvements planned but not urgent

**Limitations:**
- Only available for Android users (iOS requires $99/year distribution fee)
- USDA database has gaps in food coverage (custom foods solve this but aren't as seamless)

### The Vision
The primary goal was achieved: I learned Spring Boot and cloud deployment while solving my own gym tracking problem. Future improvements would include:
- Fix the one or two minor bugs
- Incremental search for recent foods (filter as you type, reducing API calls)
- Better food database if a larger, more comprehensive free option becomes available without insane rate limits
- iOS distribution if enough iOS users ask for it

This project proved that having concrete data on gym progress makes consistency much easier. Even when I don't see changes in the mirror, I can see my lifts going up, my weight increasing, and my muscle weight (calculated using body fat percentage) improving over time.

## 🛠️ Development Tools

* **Claude Code** – AI-powered coding assistant used for frontend development
* **Figma** – Complete app design and prototyping
* **Mobbin** – Mobile app design inspiration and patterns
* **Spring Boot** – Backend framework with excellent architecture
* **Expo** – React Native development and build tools
* **Docker** – Local PostgreSQL database for development
* **DBeaver** – Database management and SQL client
* **Terraform** – Infrastructure as code
* **GitHub Actions** – CI/CD automation

---

<div align="center">
  
Built with ❤️ by Jaedon Farr

<p align="center">
  Readme created with the help of claude <img width="20" height="20" alt="Claude AI" src="https://github.com/user-attachments/assets/ccb8345f-6f6c-455e-8246-d15297f725fb" style="vertical-align: middle;" />
</p>

[Portfolio](https://jaedonfarr.vercel.app) • [LinkedIn](https://linkedin.com/in/jaedonfarr) • [GitHub](https://github.com/altaofficial)

</div>
