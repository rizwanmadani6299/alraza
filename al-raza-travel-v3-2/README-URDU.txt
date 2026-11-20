AL RAZA TRAVEL - FINAL

GITHUB SE LIVE KARNA (repository: alraza)
1. Zip extract karein.
2. GitHub par alraza repository kholein: Add file, phir Upload files.
3. Extract kiye hue folder ki saari cheezein (public folder, wrangler.jsonc, deploy.bat, README-URDU.txt) drag karke chhod dein. Purani files ka naam wahi hai, wo khud badal jayengi.
4. Commit changes dabayen.
5. Cloudflare mein alraza worker, phir Deployments: naya build Success hona chahiye. 1-2 minute baad site par Ctrl+F5.

COMPUTER SE SEEDHA LIVE KARNA (GitHub ke baghair)
1. Node.js (nodejs.org, LTS) install karein, folder mein cmd khol kar: npx wrangler login
2. deploy.bat par double click.

AAINDA BADLAV
public\index.html mein script ke shuru mein SITE SETTINGS hain: WhatsApp number, offer ki akhri tareekh (PROMO_END), Makkah hotels ki date, rates (PROGRAMS), hotel list (MH).

NAYA (v2) - AUTOMATIC CHEEZEIN
- Offer (Rs. 5,000 OFF): har mahine ke aakhri din tak khud chalta hai. Koi date badalni nahi paRti.
- Package: har package ki departure date (d1) aate hi site se khud hide ho jata hai.
- Makkah Hotels: MK_FROM aur MK_TO mein check-in/check-out likhein. Check-in ki date aate hi section khud hide ho jata hai.
- Naya package: PROGRAMS mein ek aur {...} block isi tarah add karein.
- Naye hotels: MH list mein add karein: ["Hotel name","distance","location"]
- AI Assistant: neeche right mein 'Ask AI' button. Ye site ke apne data se jawab deta hai.

ISLAMABAD PACKAGES (v3)
- Islamabad ke 4 packages (27 Oct, 6 Nov, 19 Dec, 6 Jan) index.html mein 'ISLAMABAD PACKAGES' ke neeche hain.
- Naya package: PROGRAMS.push(isb("Airblue","2026-12-01","2026-12-21",0,"PA 272","PA 273","20 kg",ISB_HA,[[rates...]])); rate 0 = wo room type available nahi.
- Departure ki date aate hi package khud hide ho jata hai.
- Upar quick-access cards aur mobile par scroll karne par top dock khud aata hai.

ASAL AI CHAT (v4) - IS KE LIYE EK DAFA SETUP
1. console.anthropic.com par account banayein, Billing mein thora credit daalein aur Spend limit (misaal: $10 mahana) laga dein. Phir API Keys mein naya key banayein.
2. Cloudflare mein alraza worker kholein: Settings, phir Variables and Secrets, phir Add. Type: Secret, Name: ANTHROPIC_API_KEY, Value: apna key. Save/Deploy dabayen.
3. GitHub par is zip ki SAARI cheezein upload karein, nayi 'src' folder samet (src/worker.js zaroori hai), phir Commit.
4. Site par Ctrl+F5, 'Ask AI' kholein aur sawal poochein.
Key na ho ya koi masla aaye to chat khud purane (keyword wale) jawab par aa jati hai, site band nahi hoti.
Key kabhi index.html mein ya kisi ko message mein na bhejein.

V5 - DATE CHIPS, FILTERS, RESERVE, GOOGLE SHEET
- Packages ke upar departure-date chips, budget aur distance filter hain. Shuru mein sab se qareebi date khulti hai, 'All dates' se sab dekh saktay hain.
- 'Reserve your seat' form: WhatsApp par Ref number ke sath request jata hai. Payment details bharne ke liye index.html mein 'var PAY=[]' mein bank/JazzCash/Easypaisa ki tafseel likhein (misaal wahin likhi hai). Khali ho to 'details WhatsApp par' likha aata hai.
- Seats kam hon to Google Sheet ke 'seats_left' column mein number likhein (20 ya kam par 'ONLY N SEATS LEFT' badge aata hai).

GOOGLE SHEET SE PACKAGES (index.html mein haath lagaye baghair)
1. Google Sheets mein nayi sheet banayein aur 'packages-sheet-template.csv' import karein (File, Import, Upload). Isi mein abhi ke saare packages hain.
2. Har row = ek hotel option. Rate khali ya 0 ho to wo room type nahi dikhta. 'show' mein 'no' likhein to row chhup jati hai. Dates YYYY-MM-DD mein likhein. Ek package ki saari rows mein city, airline aur dep_date same rakhein.
3. File, Share, Publish to web, 'Comma-separated values (.csv)' chunein, Publish karein aur link copy karein.
4. GitHub par wrangler.jsonc kholein aur link yahan likhein: "vars": { "SHEET_CSV_URL": "https://docs.google.com/.../pub?output=csv" } . Commit karein.
5. Ab sheet badalte hi site 5 minute ke andar badal jati hai. Sheet na chale to site andar ke purane packages dikhati rehti hai.

V6 - SPEED AUR SEATS
- Site tez ki gayi hai (fonts aur 3D logo ab page ko rokte nahi, bhaari blur hata diya, chalti animations kam, sirf nazar aane wale packages draw hote hain, screen se bahar 3D band).
- Seats: index.html mein 'var SEATS={...}' mein departure ki date ke samne baqi seats likhi hain (26 Oct = 8, 27 Oct = 10). Badalne ke liye number badal dein. 20 ya kam par lal badge aata hai, 0 ya hata dein to nahi aata.
- Google Sheet use karte hon to 'seats_left' column mein likhein.

INTRO: ab kareeb 3 second ka hai; line aur jahaz ek sath chalte hain. Waqt badalna ho to index.html mein 'setTimeout(endSp,3200)' ka number badlein.

V7 - PAYMENT AUR CANCELLATION
- Ways to pay: JazzCash, Easypaisa, Online banking, Cheque, Pay order. Har ada'egi ki tasdeeq WhatsApp par hoti hai.
- Account number likhne hon to index.html mein 'var PAY=[]' mein likhein (misaal wahin hai); tab copy button bhi aa jata hai.
- Cancellation: hamari taraf se koi charge nahi; hotel aur airline ki policy lagu hogi. Ye Reserve section, Booking & cancellation card, FAQ, AI chat aur worker.js mein badal diya hai.
- Intro: sab se purana wala (pehle line, phir jahaz aram se), kareeb 6 second. Chhota karna ho to 'setTimeout(endSp,6200)' ka number kam karein.

V8 - SAFAI AUR NAYE FEATURES
- Hataya gaya: 'Build Your Own' section (ab Reserve form mein 'Custom - build my own package' option hai), dohra 'Our hotels' aur 'Upcoming departures' sections (date chips aur package cards mein pehle se hain), mobile par alag 'upar jane' ka button (dock mein Top hai).
- Umrah guide aur tips ab band (accordion) mein hain, kholne ke liye tap karein.
- Har card par: poore group ka total (Travellers + / - se badlein), Compare (3 tak, muqabla table) aur Share (WhatsApp / share sheet).
- Reserve form mein special requests (wheelchair/buzurg, bachay, infant, ladies group) aur custom package ki tafseel.
