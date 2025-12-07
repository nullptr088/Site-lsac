Pimp Your Grill: The Search for The BEST Grill

Acest proiect reprezintă soluția pentru Proba Tehnică, constând într-o aplicație web complet funcțională (MERN Stack) care permite utilizatorilor să posteze rețete de grătare și să voteze (să dea "MICI") pentru cele mai bune postări.

🚀 Cum se Rulează Aplicația

Aplicația este împărțită în două servicii distincte (Backend API și Frontend React) care rulează pe porturi diferite.

1. Configurarea Backend-ului (API)

Asigurați-vă că aveți instalat Node.js și că serverul MongoDB rulează (sau folosiți MongoDB Atlas).

Navigați în directorul backend/.

Instalați dependențele:

npm install


Configurați variabilele de mediu: Creați fișierul .env în directorul backend/ cu următorul conținut (ajustați MONGODB_URI dacă folosiți Atlas):

MONGODB_URI=mongodb://127.0.0.1:27017/pimp-your-grill-db
JWT_SECRET=UN_SECRET_LUNG_SI_COMPLICAT_AL_TAU
PORT=3001


Porniți serverul API:

node server.js


Serverul va rula pe http://localhost:3001.

2. Configurarea Frontend-ului (React)

Aplicația Frontend este o aplicație React (Vite) care se conectează la API pe portul 3001.

Navigați în directorul frontend/.

Instalați dependențele:

npm install


Porniți aplicația React:

npm run dev


Aplicația se va deschide în browser (de obicei pe http://localhost:5173).

✅ Funcționalități Implementate

Aplicația implementează următoarele cerințe:

I. Autentificare & Autorizare (Backend & Frontend)

Cerință

Status

Detalii Implementare

Register & Login

Complet

Folosește bcryptjs pentru hash-uirea parolei și JSON Web Tokens (JWT) pentru gestionarea sesiunii.

Header Stateful

Complet

Navbar-ul (Header) afișează Profile și Logout doar dacă utilizatorul este autentificat, altfel arată Login și Register.

Authorization

Complet

Rutele sensibile (/api/grills, /api/user/profile) sunt protejate de middleware-ul protect care verifică token-ul JWT.

II. Postări & Rating

Cerință

Status

Detalii Implementare

Adaugă Grătar

Complet

Logică în POST /api/grills. Utilizează un modal (Frontend) pentru introducerea numelui și descrierii.

Liking Posts (MICI)

Complet

Logică în POST /api/grills/:id/like. Se folosește o colecție Likes separată pentru a asigura un singur vot pe utilizator și un contor mics_count pe documentul Grătar.

Leaderboard

Complet

Endpoint GET /api/grills/best returnează Top 3 grătare sortate descrescător după mics_count.

Searching Grills

Complet

Căutarea se face la nivel de Frontend (în LeaderboardPage) pe baza numelui și descrierii.

III. Bonusuri

Cerință Bonus

Status

Detalii Implementare

Editare postări

Complet

Utilizatorul își poate edita postările prin PUT /api/grills/:id (verificând Ownership).

Ștergere postări

Complet

Utilizatorul își poate șterge postările prin DELETE /api/grills/:id (verificând Ownership).

Admin Delete

Gata de testare

Logica de ștergere este implementată în grillController.js pentru a permite ștergerea dacă req.user.role === 'admin'.

💡 Abordarea Tehnică (Frontend)

Frontend-ul este realizat în React cu o structură de bază, folosind clase CSS externe (index.css) pentru a asigura responsivitatea completă și alinierea cu Mock-up-ul Figma (am folosit CSS cu Media Queries pentru a garanta adaptarea la mobil și desktop, evitând eșecurile de randare specifice React/Vite).

Aplicația folosește o singură componentă principală (App.jsx) care gestionează starea globală a utilizatorului (user) și navigarea (currentPage).
