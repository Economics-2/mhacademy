Firebase চালু করার ধাপ (একবারই করতে হবে)
=========================================
১. console.firebase.google.com → আপনার প্রজেক্ট (studio-8044800982-406cc) খুলুন।
২. Build → Firestore Database → "Create database" (Production mode, কাছের লোকেশন, যেমন asia-south1)।
3. Build → Authentication → Get started → Sign-in method → "Email/Password" চালু করুন।
   এরপর Users ট্যাবে "Add user" দিয়ে অ্যাডমিনের ইমেইল ও পাসওয়ার্ড খুলুন।
4. Authentication → Settings → Authorized domains-এ আপনার সাইটের ডোমেইন যোগ করুন (যেমন economics-2.github.io)।
5. Firestore → Rules ট্যাবে firestore.rules ফাইলের লেখা পেস্ট করুন; ADMIN_EMAIL-এর জায়গায় ৩-এ খোলা ইমেইল বসিয়ে Publish করুন।
6. সব ফাইল GitHub-এ আপলোড করুন (people/ ফোল্ডারসহ)। তারপর yoursite/admin.html → "৮. শিক্ষক ও শিক্ষার্থী" → লগইন →
   "প্রাথমিক তালিকা Firebase-এ তুলুন" চাপুন। এরপর থেকে এখান থেকেই যোগ/সম্পাদনা/মুছুন।

সাইট কীভাবে ডেটা নেয়: Firebase-এ কেউ থাকলে সেটিই দেখায়; খালি বা অফলাইন হলে people.js-এর তালিকা দেখায়।
