AL RAZA TRAVEL - UPDATE KARNE KA TAREEQA

Ek dafa ka setup (sirf pehli baar):
1. nodejs.org se Node.js (LTS) install karein.
2. Is folder mein Command Prompt kholein aur chalayein:  npx wrangler login
   (browser khulega, Cloudflare account se Allow kar dein)

Har update ke liye:
1. public\index.html ko Notepad ya VS Code mein kholein.
2. Script ke shuru mein "SITE SETTINGS" wala hissa dhoondein.
   WhatsApp number, offer ki akhri tareekh, Makkah hotel ki dates, packages ke rates
   (PROGRAMS) aur hotel list (MH) wahin se badalte hain.
3. File save karein, phir deploy.bat par double click karein.
   Taqreeban 10 second mein website live ho jati hai. Zip banane ki zaroorat nahi.

Note: Worker ka naam wrangler.jsonc mein "alraza-travel" hai. Yehi naam rakhein,
tab purani site hi update hogi, nayi nahi banegi.
Jab apna domain lagayen to index.html mein purana workers.dev link (og:url,
canonical, og:image) naye domain se badal dein.
