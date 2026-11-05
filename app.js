/* Ho-Park app — working demo (no backend; data is stored on this device only). */
(function () {
  'use strict';
  var VERSION = '1.3.0-demo';
  var STORE = 'hp-app-v1';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  // Website links: inside the website package the app lives in /app/, on GitHub Pages it runs on its own.
  var SITE = (/github\.io$/.test(location.hostname) || !/\/app\/(index\.html)?$/.test(location.pathname)) ? 'https://ho-park.com/' : '../';
  var D = window.HP_CITIES;
  var TODAY = new Date(); TODAY.setHours(12, 0, 0, 0);
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var app = $('#app');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================================
     Texts (English / Polish)
     ===================================================================== */
  var T = {
    occ: ['Occupancy', 'Obłożenie'],
    theme: ['Colour theme', 'Motyw kolorów'], themeD: ['Saved on this phone. Switch any time.', 'Zapisany na tym telefonie. Zmienisz w każdej chwili.'],
    thEmerald: ['Emerald & White', 'Szmaragd i biel'], thEmeraldD: ['Bright and clear · best in daylight', 'Jasny i czytelny · najlepszy w dzień'],
    thBlackgold: ['Black & Gold', 'Czerń i złoto'], thBlackgoldD: ['Premium dark · easy on the eyes at night', 'Ciemny premium · wygodny nocą'],
    thEmgold: ['Emerald Night', 'Szmaragdowa noc'], thEmgoldD: ['Dark emerald with gold accents', 'Ciemny szmaragd ze złotymi akcentami'],
    themeSet: ['Theme changed', 'Zmieniono motyw'], themeBar: ['Tip: reopen the home-screen app once so the iPhone status bar matches the new theme.', 'Wskazówka: uruchom aplikację z ekranu głównego ponownie, aby pasek statusu iPhone’a dopasował się do motywu.'],
    simLink: ['Simulate earnings in another city', 'Symuluj zarobki w innym mieście'],
    acPriv: ['Private', 'Prywatne'], acComp: ['Company', 'Firma'], acMine: ['Mine', 'Moje'],
    demoBadge: ['Demo data · no login', 'Dane demo · bez logowania'], afterFee: ['after 15% fee', 'po prowizji 15%'],
    allCountries: ['All countries', 'Wszystkie kraje'], allSpaces: ['All spaces', 'Wszystkie miejsca'], avgDay: ['avg/day', 'śr./dzień'],
    avgPer: ['avg {x} h per booking', 'śr. {x} h na rezerwację'], bestSp: ['Best spaces this month', 'Najlepsze miejsca w tym miesiącu'],
    bkMonth: ['bookings this month', 'rezerwacji w tym miesiącu'], bkShort: ['bookings', 'rezerwacji'], earnS: ['Earned', 'Zarobek'],
    hello: ['Good to see you, {n}', 'Dobrze Cię widzieć, {n}'], hoursS: ['Hours', 'Godziny'], lgBk: ['bookings', 'rezerwacje'], lgEarn: ['net €/day', 'netto €/dzień'],
    netL: ['Net payout', 'Wypłata netto'], noMatch: ['No spaces match.', 'Brak pasujących miejsc.'], occSub: ['of shared hours', 'udostępnionych godzin'],
    paused: ['Paused', 'Wstrzymane'], perSpace: ['Rating per space', 'Ocena wg miejsca'], recentBk: ['Recent bookings', 'Ostatnie rezerwacje'],
    searchSp: ['Search spaces…', 'Szukaj miejsc…'], spacesL: ['spaces', 'miejsc'], idPrice: ['Move closer to the suggested price', 'Zbliż cenę do sugerowanej'],
    s247: ['24/7', '24/7'], sWkev: ['Weekdays + evenings', 'Dni robocze + wieczory'], sWk: ['Weekdays 8–18', 'Dni robocze 8–18'],
    tagline: ['Smart Parking. Smarter Cities.', 'Inteligentne parkowanie. Mądrzejsze miasta.'],
    sl1: ['Find space.<br>Share space.<br><em>Better cities.</em>', 'Znajdź miejsce.<br>Udostępnij miejsce.<br><em>Lepsze miasta.</em>'],
    sl2: ['Navigate straight<br>to a <em>free space.</em>', 'Jedź prosto<br>na <em>wolne miejsce.</em>'],
    sl3: ['Your space earns<br><em>when you don’t need it.</em>', 'Twoje miejsce zarabia,<br><em>kiedy go nie potrzebujesz.</em>'],
    withApple: ['Continue with Apple', 'Kontynuuj z Apple'], withGoogle: ['Continue with Google', 'Kontynuuj z Google'],
    withEmail: ['Create account with email', 'Załóż konto e-mailem'], haveAcc: ['Already have an account?', 'Masz już konto?'], signIn: ['Sign in', 'Zaloguj się'],
    legal: ['By continuing you agree to the Terms of Service and Privacy Policy.', 'Kontynuując, akceptujesz Regulamin i Politykę prywatności.'],
    demo: ['Demo version', 'Wersja demo'],
    createAcc: ['Create your account', 'Załóż konto'], name: ['Full name', 'Imię i nazwisko'], email: ['Email', 'E-mail'], password: ['Password', 'Hasło'],
    cont: ['Continue', 'Dalej'], back: ['Back', 'Wstecz'],
    roleT: ['How will you use Ho-Park?', 'Jak chcesz korzystać z Ho-Park?'], roleS: ['You can change this at any time.', 'Możesz to zmienić w każdej chwili.'],
    roleDriver: ['I want to park', 'Chcę parkować'], roleDriverD: ['Find and book spaces near your destination', 'Znajdź i zarezerwuj miejsce blisko celu'],
    roleHost: ['I want to share my space', 'Chcę udostępniać miejsce'], roleHostD: ['Earn when your space would stand empty', 'Zarabiaj, gdy miejsce stoi puste'],
    roleBoth: ['Both', 'Jedno i drugie'], roleBothD: ['Park and share', 'Parkuję i udostępniam'],
    tExplore: ['Explore', 'Szukaj'], tBookings: ['Bookings', 'Rezerwacje'], tShare: ['Share', 'Udostępnij'], tMessages: ['Messages', 'Wiadomości'], tProfile: ['Profile', 'Profil'],
    curLoc: ['Current location', 'Bieżąca lokalizacja'], now: ['Now', 'Teraz'], h1: ['1 hour', '1 godzina'], today: ['Today', 'Dziś'], filters: ['Filters', 'Filtry'],
    liveNow: ['spaces live now', 'miejsc dostępnych teraz'], viewDetails: ['View details', 'Szczegóły'], perHour: ['/ hour', '/ godz.'], perH: ['per hour', 'za godzinę'],
    min: ['min', 'min'], yourSpace: ['Your space', 'Twoje miejsce'], noSpots: ['No spaces match your filters.', 'Brak miejsc spełniających filtry.'],
    fCovered: ['Covered / indoor', 'Zadaszone / w garażu'], fEv: ['EV charging', 'Ładowanie EV'], fGate: ['Opens with the app (Ho-Park Gate)', 'Otwierane aplikacją (Ho-Park Gate)'], apply: ['Show results', 'Pokaż wyniki'], clear: ['Clear', 'Wyczyść'],
    accBasic: ['Open access', 'Otwarty dostęp'], accConnect: ['Gate Connect · QR', 'Gate Connect · QR'], accPro: ['Gate Pro · QR + radio', 'Gate Pro · QR + radio'],
    avUntil: ['Available until', 'Dostępne do'], features: ['Features', 'Udogodnienia'], access: ['Access', 'Dostęp'], host: ['Host', 'Gospodarz'], hostSince: ['Ho-Park host', 'Gospodarz Ho-Park'],
    bookNow: ['Book now', 'Rezerwuj'], reviews: ['reviews', 'opinii'],
    accBasicD: ['No hardware. After booking you get the owner’s access instructions and navigation straight to the space.', 'Bez urządzeń. Po rezerwacji dostajesz instrukcję dojazdu od właściciela i nawigację prosto na miejsce.'],
    accConnectD: ['Scan the QR code at the gate. Ho-Park checks your booking and signals the gate module over the mobile network to open.', 'Zeskanuj kod QR przy bramie. Ho-Park sprawdza rezerwację i przez sieć komórkową wysyła sygnał do modułu bramy.'],
    accProD: ['Scan the QR code at the gate. The app verifies your booking and time slot and sends a one-time encrypted key via Bluetooth — works even without mobile coverage.', 'Zeskanuj kod QR przy bramie. Aplikacja weryfikuje rezerwację i godziny, a potem wysyła jednorazowy, szyfrowany klucz przez Bluetooth — działa nawet bez zasięgu.'],
    complete: ['Complete your booking', 'Dokończ rezerwację'], start: ['Start', 'Start'], duration: ['Duration', 'Czas'], ends: ['Ends at', 'Koniec o'],
    carReg: ['Car registration', 'Numer rejestracyjny'], change: ['Change', 'Zmień'], priceDetails: ['Price details', 'Szczegóły ceny'], parking: ['Parking', 'Parkowanie'],
    serviceFee: ['Service fee', 'Opłata serwisowa'], included: ['included', 'w cenie'], total: ['Total', 'Razem'], payMethod: ['Select payment method', 'Wybierz metodę płatności'],
    card: ['Card (Visa / Mastercard)', 'Karta (Visa / Mastercard)'], soon: ['soon', 'wkrótce'], crypto: ['Cryptocurrency', 'Kryptowaluty'],
    payConfirm: ['Pay & confirm', 'Zapłać i potwierdź'], secure: ['Secure payment. Demo — no money is charged.', 'Bezpieczna płatność. Demo — żadne pieniądze nie są pobierane.'],
    in30: ['In 30 min', 'Za 30 min'], in60: ['In 1 hour', 'Za godzinę'], enterBlik: ['Enter your BLIK code', 'Wpisz kod BLIK'], blikHint: ['Any 6 digits work in the demo.', 'W wersji demo zadziała dowolne 6 cyfr.'],
    confirmBank: ['Confirm the payment in your banking app…', 'Potwierdź płatność w aplikacji bankowej…'], processing: ['Processing payment…', 'Przetwarzanie płatności…'],
    booked: ['Booking confirmed', 'Rezerwacja potwierdzona'], bookedD: ['Your space is waiting. We’ll guide you straight to it.', 'Miejsce na Ciebie czeka. Poprowadzimy Cię prosto do niego.'],
    goSession: ['Go to my booking', 'Przejdź do rezerwacji'], navigate: ['Navigate', 'Nawiguj'],
    activeBk: ['Active booking', 'Aktywna rezerwacja'], timeLeft: ['Time remaining', 'Pozostały czas'], startsIn: ['Starts in', 'Start za'], extend: ['Extend', 'Przedłuż'], endEarly: ['End early', 'Zakończ'],
    accInstr: ['Access instructions', 'Instrukcja dojazdu'], contactHost: ['Contact host', 'Napisz do gospodarza'], needHelp: ['Need help?', 'Potrzebujesz pomocy?'], openGate: ['Open gate', 'Otwórz bramę'],
    co2T: ['≈ 340 g CO₂ saved', '≈ 340 g CO₂ mniej'], co2D: ['by driving straight to your space instead of searching (estimate)', 'dzięki dojazdowi prosto na miejsce zamiast szukania (szacunek)'],
    noActive: ['No active booking', 'Brak aktywnej rezerwacji'], noActiveD: ['Find a space near your destination and book it in seconds.', 'Znajdź miejsce blisko celu i zarezerwuj je w kilka sekund.'], findSpace: ['Find a space', 'Znajdź miejsce'],
    extendT: ['Extend by 30 minutes?', 'Przedłużyć o 30 minut?'], extendD: ['The extra time will be charged to your payment method:', 'Dodatkowy czas zostanie pobrany z Twojej metody płatności:'], extended: ['Booking extended by 30 min', 'Rezerwacja przedłużona o 30 min'],
    endT: ['End your booking now?', 'Zakończyć rezerwację teraz?'], endD: ['Make sure you have left the space. Unused time is refunded in the demo.', 'Upewnij się, że opuściłeś miejsce. W wersji demo niewykorzystany czas jest zwracany.'], endBtn: ['End booking', 'Zakończ rezerwację'], cancel: ['Cancel', 'Anuluj'], ended: ['Booking ended. Receipt saved.', 'Rezerwacja zakończona. Potwierdzenie zapisane.'],
    scanT: ['Scan the QR code on the gate', 'Zeskanuj kod QR na bramie'], scanning: ['Scanning…', 'Skanowanie…'],
    gs1: ['QR code scanned', 'Kod QR zeskanowany'], gs2: ['Booking and time slot verified', 'Rezerwacja i godziny zweryfikowane'], gs3c: ['Ho-Park signals the gate module (LTE)', 'Ho-Park wysyła sygnał do modułu bramy (LTE)'], gs3p: ['One-time key sent via Bluetooth', 'Jednorazowy klucz wysłany przez Bluetooth'], gs4c: ['Gate opening', 'Brama się otwiera'], gs4p: ['Remote signal sent — gate opening', 'Sygnał pilota wysłany — brama się otwiera'],
    gateOpen: ['Gate open — welcome!', 'Brama otwarta — witamy!'], gateOpenD: ['The owner has been notified. The opening is saved in your booking history.', 'Właściciel dostał powiadomienie. Otwarcie zapisano w historii rezerwacji.'], done: ['Done', 'Gotowe'],
    active: ['Active', 'Aktywne'], upcoming: ['Upcoming', 'Nadchodzące'], past: ['Past', 'Zakończone'], noBk: ['No bookings here yet.', 'Brak rezerwacji.'],
    earnPill: ['Earn with Ho-Park', 'Zarabiaj z Ho-Park'], haveSpace: ['You have a space.<br>We have the drivers.', 'Ty masz miejsce.<br>My mamy kierowców.'],
    haveSpaceD: ['List your parking space or garage in minutes and earn when you don’t need it. Switch sharing on and off whenever you like.', 'Dodaj miejsce postojowe lub garaż w kilka minut i zarabiaj, gdy go nie potrzebujesz. Włączaj i wyłączaj udostępnianie, kiedy chcesz.'],
    hl1: ['Set your availability', 'Ustal dostępność'], hl1d: ['Share now or on a schedule — on/off in one tap.', 'Teraz albo według harmonogramu — jednym dotknięciem.'],
    hl2: ['Set your price', 'Ustal cenę'], hl2d: ['Smart suggestions based on prices nearby.', 'Podpowiedzi na podstawie cen w okolicy.'],
    hl3: ['Choose how drivers get in', 'Wybierz sposób wjazdu'], hl3d: ['Open access, Gate Connect or Gate Pro.', 'Otwarty dostęp, Gate Connect lub Gate Pro.'],
    hl4: ['Earn income', 'Zarabiaj'], hl4d: ['Automatic payouts to your bank account.', 'Automatyczne wypłaty na Twoje konto.'],
    listSpace: ['List my space', 'Dodaj moje miejsce'], learnMore: ['Learn more on our website', 'Więcej na naszej stronie'],
    pilot: ['Pilot in Rzeszów — the first owners get priority onboarding and 0% fee for 3 months (proposal).', 'Pilotaż w Rzeszowie — pierwsi właściciele mają pierwszeństwo i 0% prowizji przez 3 miesiące (propozycja).'],
    step: ['Step', 'Krok'], of: ['of', 'z'],
    w1T: ['Tell us about your space', 'Opowiedz o swoim miejscu'], spaceType: ['Type of space', 'Rodzaj miejsca'],
    ty1: ['Driveway', 'Podjazd'], ty2: ['Private garage', 'Garaż prywatny'], ty3: ['Underground garage bay', 'Miejsce w garażu podziemnym'], ty4: ['Outdoor space', 'Miejsce na zewnątrz'], ty5: ['Company car park', 'Parking firmowy'],
    address: ['Address', 'Adres'], bay: ['Bay / space number (optional)', 'Numer miejsca (opcjonalnie)'], photo: ['Add a photo of your space', 'Dodaj zdjęcie miejsca'], photoChange: ['Tap to change the photo', 'Dotknij, aby zmienić zdjęcie'],
    w2T: ['How will drivers get in?', 'Jak kierowcy wjadą?'], w2S: ['Choose the access level that fits your space. You can upgrade later.', 'Wybierz poziom dostępu dopasowany do miejsca. Możesz to zmienić później.'],
    lvl1: ['Level 1 · Basic', 'Poziom 1 · Podstawowy'], lvl2: ['Level 2 · Standard', 'Poziom 2 · Standard'], lvl3: ['Level 3 · Premium', 'Poziom 3 · Premium'],
    tBasic: ['Open access', 'Otwarty dostęp'], tConnect: ['Ho-Park Gate Connect', 'Ho-Park Gate Connect'], tPro: ['Ho-Park Gate Pro', 'Ho-Park Gate Pro'],
    tBasicD: ['No hardware needed. For driveways, open yards and spaces that are easy to reach. Drivers get your access instructions after booking.', 'Bez urządzeń. Dla podjazdów, otwartych placów i miejsc z łatwym dostępem. Kierowca dostaje Twoją instrukcję dojazdu po rezerwacji.'],
    tConnectD: ['A small cellular (LTE) module wired to your gate opener. The driver scans the QR code at the gate; Ho-Park verifies the booking and signals the module to open.', 'Niewielki moduł komórkowy (LTE) podłączony do napędu bramy. Kierowca skanuje kod QR przy bramie, Ho-Park weryfikuje rezerwację i wysyła sygnał otwarcia.'],
    tProD: ['A radio module that pairs with your opener like an extra remote — no wiring. The QR scan verifies the booking and time slot; a one-time encrypted key goes via Bluetooth and the module sends the remote signal.', 'Moduł radiowy, który paruje się z napędem jak dodatkowy pilot — bez kabli. Skan kodu QR weryfikuje rezerwację i godziny, a jednorazowy, szyfrowany klucz trafia przez Bluetooth do modułu, który wysyła sygnał pilota.'],
    b1: ['No hardware, nothing to install', 'Bez urządzeń i montażu'], b2: ['Best for driveways and open spaces', 'Najlepszy dla podjazdów i otwartych miejsc'], b3: ['Instructions shared only after booking', 'Instrukcja widoczna dopiero po rezerwacji'],
    c1: ['QR code + LTE module with built-in SIM', 'Kod QR + moduł LTE z wbudowaną kartą SIM'], c2: ['2 wires to the wall-button terminals', '2 przewody do zacisków przycisku ściennego'], c3: ['Needs mobile coverage at the gate', 'Wymaga zasięgu sieci przy bramie'],
    p1: ['QR code + radio module (433/868 MHz) + Bluetooth', 'Kod QR + moduł radiowy (433/868 MHz) + Bluetooth'], p2: ['No wiring — pairs like an extra remote', 'Bez kabli — paruje się jak dodatkowy pilot'], p3: ['Works offline, e.g. in underground garages', 'Działa bez zasięgu, np. w garażu podziemnym'], p4: ['Every opening logged with time and plate', 'Każde otwarcie zapisane z godziną i numerem rejestracyjnym'],
    recommended: ['Recommended', 'Polecany'],
    tierNote: ['Gate modules are in development. Some openers with rolling-code remotes are paired using the opener’s “learn” button — we check compatibility before shipping. Your door’s own safety sensors always stay in charge.', 'Moduły Gate są w przygotowaniu. Część napędów z pilotami o zmiennym kodzie paruje się przyciskiem „learn” w napędzie — sprawdzamy zgodność przed wysyłką. Zabezpieczenia samej bramy zawsze działają jak dotąd.'],
    instr: ['Access instructions for drivers', 'Instrukcja dojazdu dla kierowców'], instrPh: ['e.g. Enter from Słowackiego St., park on the left, bay marked HP.', 'np. Wjazd od ul. Słowackiego, parkuj po lewej, miejsce oznaczone HP.'],
    w3T: ['When is your space free?', 'Kiedy Twoje miejsce jest wolne?'], shareNow: ['Share now', 'Udostępniaj teraz'], shareNowD: ['Your space appears on the map right away', 'Miejsce od razu pojawia się na mapie'],
    schedule: ['Weekly schedule', 'Harmonogram tygodniowy'], schedHint: ['Tap a day to change its hours.', 'Dotknij dnia, aby zmienić godziny.'],
    pOff: ['off', 'wył.'], pDay: ['8–17', '8–17'], pEve: ['18–7', '18–7'], pAll: ['all day', 'cały dzień'],
    d1: ['Mon', 'Pn'], d2: ['Tue', 'Wt'], d3: ['Wed', 'Śr'], d4: ['Thu', 'Cz'], d5: ['Fri', 'Pt'], d6: ['Sat', 'Sb'], d7: ['Sun', 'Nd'],
    w4T: ['Set your price', 'Ustal cenę'], w4S: ['Average prices within 500 m of your space (example data) next to yours.', 'Średnie ceny w promieniu 500 m od Twojego miejsca (dane przykładowe) obok Twoich.'],
    areaAvg: ['Area avg.', 'Średnia'], yourPrice: ['Your price', 'Twoja cena'], r1: ['Weekdays 8–18', 'Dni robocze 8–18'], r2: ['Evenings & nights', 'Wieczory i noce'], r3: ['Weekends', 'Weekendy'],
    estInc: ['Estimated monthly income (example)', 'Szacowany przychód miesięczny (przykład)'], atAvg: ['at area prices:', 'przy średnich cenach:'], avgOk: ['avg.', 'średnio'],
    w5T: ['Review and publish', 'Sprawdź i opublikuj'], type: ['Type', 'Rodzaj'], accessLvl: ['Access', 'Dostęp'], availability: ['Availability', 'Dostępność'], price: ['Price', 'Cena'],
    agree: ['I accept the Ho-Park owner agreement (draft) and confirm I have the right to share this space.', 'Akceptuję umowę z właścicielem Ho-Park (projekt) i potwierdzam, że mam prawo udostępniać to miejsce.'],
    publish: ['Publish my space', 'Opublikuj miejsce'], published: ['Your space is live on the map!', 'Twoje miejsce jest na mapie!'],
    mySpace: ['My space', 'Moje miejsce'], sharing: ['Sharing now', 'Udostępniam teraz'], sharingD: ['Visible on the map for drivers nearby', 'Widoczne na mapie dla kierowców w okolicy'],
    notSharing: ['Sharing off', 'Udostępnianie wyłączone'], notSharingD: ['Hidden — no new bookings', 'Ukryte — brak nowych rezerwacji'],
    todayE: ['Today', 'Dziś'], monthE: ['This month', 'Ten miesiąc'], accMethod: ['Access method', 'Sposób dostępu'], edit: ['Edit', 'Edytuj'],
    devOnline: ['Device online · last opened 09:48', 'Urządzenie online · ostatnie otwarcie 09:48'], devPair: ['Device not paired yet', 'Urządzenie jeszcze niesparowane'], pairDev: ['Pair your device', 'Sparuj urządzenie'],
    bkYour: ['Bookings for your space', 'Rezerwacje Twojego miejsca'], viewOnMap: ['See it on the map', 'Zobacz na mapie'],
    pairT: ['Pair your Ho-Park Gate', 'Sparuj Ho-Park Gate'], pair1: ['Install the module', 'Zamontuj moduł'], pair1c: ['Connect 2 wires to the wall-button terminals of your opener.', 'Podłącz 2 przewody do zacisków przycisku ściennego napędu.'], pair1p: ['Press “learn” on your opener and hold the module next to it to pair it as an extra remote.', 'Naciśnij „learn” w napędzie i przytrzymaj moduł obok, aby sparować go jako dodatkowy pilot.'],
    pair2: ['Power on', 'Włącz zasilanie'], pair2d: ['The LED blinks green when the module is ready.', 'Dioda miga na zielono, gdy moduł jest gotowy.'], pair3: ['Scan the QR code on the module', 'Zeskanuj kod QR na module'], pair3d: ['This links the device to your space.', 'To powiąże urządzenie z Twoim miejscem.'],
    scanPair: ['Scan QR to pair', 'Zeskanuj QR, aby sparować'], paired: ['Device paired', 'Urządzenie sparowane'], pairedD: ['Bookings for your space will now open the gate — only during the booked time.', 'Rezerwacje Twojego miejsca otwierają teraz bramę — tylko w zarezerwowanym czasie.'], later: ['Later', 'Później'],
    bookingsN: ['Bookings', 'Rezerwacje'], rating: ['Rating', 'Ocena'], verified: ['Verified', 'Zweryfikowany'], notVerified: ['Not verified', 'Niezweryfikowany'],
    totalEarn: ['Total earnings', 'Łączne zarobki'], withdraw: ['Withdraw earnings', 'Wypłać zarobki'], withdrawT: ['Withdraw to your bank account?', 'Wypłacić na konto bankowe?'], withdrawD: ['Transfer to account ending', 'Przelew na konto kończące się na'], withdrawn: ['Transfer ordered (demo)', 'Przelew zlecony (demo)'],
    mySpaces: ['My spaces', 'Moje miejsca'], earnHist: ['Earnings history', 'Historia zarobków'], payout: ['Payout method', 'Metoda wypłat'], docs: ['Documents & verification', 'Dokumenty i weryfikacja'], help: ['Help & support', 'Pomoc'], settings: ['Settings', 'Ustawienia'],
    verifyT: ['Verify your identity', 'Potwierdź tożsamość'], verifyD: ['Required by law before your first payout. In the live app this is done by our licensed payment partner.', 'Wymagane przepisami przed pierwszą wypłatą. W docelowej aplikacji robi to nasz licencjonowany partner płatniczy.'], verifyBtn: ['Verify now (demo)', 'Zweryfikuj teraz (demo)'], verifiedT: ['Identity verified', 'Tożsamość potwierdzona'],
    language: ['Language', 'Język'], notif: ['Notifications', 'Powiadomienia'], website: ['Ho-Park website', 'Strona Ho-Park'], install: ['Install on iPhone', 'Zainstaluj na iPhonie'],
    installD: ['Open this page in Safari, tap Share, then “Add to Home Screen”.', 'Otwórz tę stronę w Safari, dotknij Udostępnij, a potem „Do ekranu początkowego”.'],
    reset: ['Reset demo data', 'Resetuj dane demo'], resetT: ['Reset the demo?', 'Zresetować demo?'], resetD: ['This clears your account, bookings and space on this device.', 'Usunie konto, rezerwacje i miejsce zapisane na tym urządzeniu.'], logout: ['Sign out', 'Wyloguj'],
    version: ['Version', 'Wersja'], week: ['W', 'T'], typeMsg: ['Write a message…', 'Napisz wiadomość…'],
    m1: ['Hi! Bay 14 is on the left after the gate. Enjoy your stay.', 'Cześć! Miejsce 14 jest po lewej za bramą. Miłego dnia!'], m2: ['Your space was booked for 4 h · +€8.50', 'Twoje miejsce zarezerwowano na 4 godz. · +8,50 €'],
    team: ['Ho-Park team', 'Zespół Ho-Park'], m3: ['Welcome to Ho-Park! This is a demo — feel free to try everything.', 'Witaj w Ho-Park! To wersja demo — śmiało wypróbuj wszystko.'],
    cityNow: ['Showing spaces in', 'Pokazuję miejsca w:'], city: ['City', 'Miasto'], where: ['Where is the space?', 'Gdzie jest miejsce?'],
    locc: ['Centre', 'Centrum'], loci: ['Inner city', 'Bliżej centrum'], loco: ['Outer district', 'Dalsza dzielnica'], addrPh: ['Street and number', 'Ulica i numer'],
    editing: ['Editing', 'Edycja'], saved: ['Changes saved', 'Zmiany zapisane'], delT: ['Remove this space?', 'Usunąć to miejsce?'], delD: ['It will disappear from the map and from your dashboard (demo data on this phone only).', 'Zniknie z mapy i z Twojego panelu (dane demo tylko na tym telefonie).'], delBtn: ['Remove space', 'Usuń miejsce'], deleted: ['Space removed', 'Miejsce usunięte'],
    demoOwner: ['Load demo owner account (4 spaces)', 'Wczytaj demo konta właściciela (4 miejsca)'], demoLoaded: ['Demo spaces added in Rzeszów, Kraków and Budapest', 'Dodano miejsca demo w Rzeszowie, Krakowie i Budapeszcie'], priceSet: ['Price set to', 'Ustawiono cenę'],
    ownerT: ['Owner dashboard', 'Panel właściciela'], addSpace: ['Add a space', 'Dodaj miejsce'],
    tOv: ['Overview', 'Podsumowanie'], tSp: ['My spaces', 'Moje miejsca'], tPay: ['Payouts', 'Wypłaty'], tRate: ['Ratings', 'Oceny'], tOps: ['Opportunities', 'Możliwości'],
    simNote: ['Demo: bookings, earnings and reviews are simulated. Nothing is charged or paid out.', 'Demo: rezerwacje, zarobki i opinie są symulowane. Nic nie jest pobierane ani wypłacane.'],
    earnedM: ['Earned this month', 'Zarobione w tym miesiącu'], vsLast: ['vs same days last month', 'vs te same dni poprz. miesiąca'], timesUsed: ['Times used', 'Liczba rezerwacji'], hoursB: ['Hours booked', 'Godziny rezerwacji'], avgRating: ['Average rating', 'Średnia ocena'], spacesN: ['Spaces sharing', 'Udostępniane miejsca'],
    nextPay: ['Next payout', 'Najbliższa wypłata'], payToday: ['today', 'dziś'], payTomorrow: ['tomorrow', 'jutro'], payIn: ['in {d} days', 'za {d} dni'], dailyE: ['Daily earnings', 'Dzienne zarobki'], latestRev: ['Latest reviews', 'Najnowsze opinie'],
    spacesHint: ['Tap a space to switch sharing on or off, change the price or pair a gate device.', 'Dotknij miejsca, aby włączyć lub wyłączyć udostępnianie, zmienić cenę lub sparować urządzenie.'],
    payout: ['Payout', 'Wypłata'], scheduled: ['Scheduled', 'Zaplanowana'], sendToday: ['Sending today', 'Wysyłamy dziś'], paid: ['Paid', 'Wypłacona'],
    payRule: ['We pay out on the 30th of every month (last day of February). Each payout covers the days since the previous one, after the 15% fee.', 'Wypłacamy 30. dnia każdego miesiąca (w lutym ostatniego dnia). Wypłata obejmuje dni od poprzedniej wypłaty, po prowizji 15%.'],
    period: ['Period', 'Okres'], grossL: ['Paid by drivers', 'Zapłacili kierowcy'], feeL: ['Ho-Park fee (15%)', 'Prowizja Ho-Park (15%)'], payHist: ['Previous payouts', 'Poprzednie wypłaty'],
    yourReply: ['Your reply', 'Twoja odpowiedź'], replyPh: ['Thank the driver or answer the question…', 'Podziękuj kierowcy lub odpowiedz na pytanie…'], sendReply: ['Publish', 'Opublikuj'], reply: ['Reply', 'Odpowiedz'], replied: ['Reply published', 'Odpowiedź opublikowana'], allR: ['All', 'Wszystkie'], noRev: ['No reviews with this rating.', 'Brak opinii z taką oceną.'],
    below: ['Below market', 'Poniżej rynku'], above: ['Above market', 'Powyżej rynku'], around: ['Around market', 'Na poziomie rynku'],
    pubP: ['Public parking', 'Parking miejski'], sugP: ['Suggested', 'Sugerowana'], areaA: ['Area avg.', 'Średnia okolicy'], yourP: ['Your price', 'Twoja cena'], perMo: ['per month', 'miesięcznie'], useSug: ['Use suggested', 'Ustaw sugerowaną'],
    idEve: ['Share evenings and nights', 'Udostępniaj wieczorami i w nocy'], idWe: ['Open at weekends', 'Otwórz w weekendy'], idGate: ['Upgrade to Ho-Park Gate', 'Przejdź na Ho-Park Gate'], idOn: ['Switch sharing back on', 'Włącz z powrotem udostępnianie'], noIdeas: ['Your spaces are already well set up.', 'Twoje miejsca są już dobrze ustawione.'],
    ideas: ['Ideas to earn more (estimates)', 'Pomysły na większe zarobki (szacunki)'], yourVsMkt: ['Your prices vs. the market', 'Twoje ceny na tle rynku'], mxT: ['Suggested prices in EU cities', 'Sugerowane ceny w miastach UE'], stage: ['Stage', 'Etap'],
    opsNote: ['* Estimates only, not an offer. Suggested price = 80% of the public on-street tariff in October 2026; sources on ho-park.com/owners.', '* Wyłącznie szacunki, nie oferta. Sugerowana cena = 80% stawki za parkowanie na ulicy (październik 2026); źródła na ho-park.com/owners.'],
    noBkYet: ['No bookings yet this month.', 'Brak rezerwacji w tym miesiącu.'], chooseCity: ['Choose a city', 'Wybierz miasto'], cityPh: ['Search 57 EU cities or countries', 'Szukaj wśród 57 miast lub krajów UE'], noCity: ['No city found.', 'Nie znaleziono miasta.'],
    simT: ['What could my space earn?', 'Ile może zarobić moje miejsce?'], perMoEst: ['Per month', 'Miesięcznie'],
    simLegal: ['* Simulation for a space shared on weekdays 8–18, after the 15% fee. Not a forecast or a commercial offer.', '* Symulacja dla miejsca udostępnianego w dni robocze 8–18, po prowizji 15%. Nie jest prognozą ani ofertą handlową.'],
    earnRows: ['Week', 'Tydzień'], last4w: ['Last 4 weeks', 'Ostatnie 4 tygodnie'], bank: ['Bank account', 'Konto bankowe']
  };
  function t(k) { var v = T[k]; if (!v) return k; return v[S.lang === 'pl' ? 1 : 0]; }

  /* =====================================================================
     Demo data
     ===================================================================== */
  var SPOT_T = [
    { id: 's1', name: ['Private driveway', 'Prywatny podjazd'], addr: 'ul. Słowackiego 8', x: 38, y: 44, price: 1.2, rating: 4.8, rev: 52, km: 1.2, mins: 3, type: 'drive', access: 'basic', feat: ['cctv'], until: '18:00', host: 'Piotr', instr: ['Driveway on the right side of the house, gate is open. Park close to the garage door.', 'Podjazd po prawej stronie domu, brama otwarta. Parkuj blisko drzwi garażu.'], lat: 50.0386, lng: 21.9998, live: true },
    { id: 's2', name: ['Underground garage · bay 14', 'Garaż podziemny · miejsce 14'], addr: 'Rynek area, ul. Kościuszki', x: 57, y: 33, price: 2.5, rating: 4.9, rev: 120, km: 0.3, mins: 2, type: 'under', access: 'pro', feat: ['covered', 'cctv', 'ev'], until: '17:00', host: 'Anna', lat: 50.0375, lng: 22.0046, live: true, gate: 'HP-RZ-0014' },
    { id: 's3', name: ['City Center Garage', 'Garaż w centrum'], addr: 'ul. 3 Maja 12', x: 66, y: 52, price: 1.5, rating: 4.7, rev: 38, km: 0.6, mins: 3, type: 'garage', access: 'connect', feat: ['covered', '247'], until: '22:00', host: 'Marta', lat: 50.0362, lng: 22.0066, live: true, gate: 'HP-RZ-0031' },
    { id: 's4', name: ['Office car park (evenings)', 'Parking biurowy (wieczory)'], addr: 'al. Piłsudskiego 34', x: 28, y: 63, price: 0.8, rating: 4.6, rev: 21, km: 1.4, mins: 5, type: 'company', access: 'connect', feat: ['cctv', '247'], until: '07:00', host: 'Tech Hub', lat: 50.0405, lng: 22.0010, live: false, dyn: true, gate: 'HP-RZ-0007' },
    { id: 's5', name: ['Courtyard space', 'Miejsce na podwórku'], addr: 'ul. Grunwaldzka 5', x: 47, y: 22, price: 0.7, rating: 4.5, rev: 14, km: 0.9, mins: 4, type: 'outdoor', access: 'basic', feat: [], until: '16:00', host: 'Ewa', instr: ['Enter the courtyard through the arch, first space on the left marked with a green P.', 'Wjazd na podwórko przez bramę w kamienicy, pierwsze miejsce po lewej z zielonym P.'], lat: 50.0391, lng: 22.0031, live: true, dyn: true },
    { id: 's6', name: ['Hotel garage', 'Garaż hotelowy'], addr: 'ul. Kopernika 2', x: 76, y: 70, price: 1.0, rating: 4.8, rev: 64, km: 1.0, mins: 4, type: 'under', access: 'pro', feat: ['covered', 'ev', '247'], until: '23:00', host: 'Hotel', lat: 50.0349, lng: 22.0081, live: true, gate: 'HP-RZ-0022' },
    { id: 's7', name: ['Residential garage', 'Garaż na osiedlu'], addr: 'ul. Hetmańska 21', x: 18, y: 35, price: 0.5, rating: 4.4, rev: 9, km: 2.1, mins: 7, type: 'garage', access: 'basic', feat: ['covered'], until: '15:00', host: 'Jan', instr: ['Garage no. 7 in the row behind block B. The door will be left open during your booking.', 'Garaż nr 7 w szeregu za blokiem B. Drzwi będą otwarte na czas rezerwacji.'], lat: 50.0420, lng: 21.9955, live: false, dyn: true }
  ];
  var MULT = { s1: 1.0, s2: 1.6, s3: 1.3, s4: 0.9, s5: 0.8, s6: 1.4, s7: 0.9 };
  var SPOTS = [];
  function cityOf(id) { return (D && D.byId(id)) || { id: 'rzeszow', en: 'Rzeszów', pl: 'Rzeszów', cc: 'PL', st: 1, c: 4, i: 3, lat: 50.04, lng: 22 }; }
  function cityName(id) { var c = cityOf(id); return S.lang === 'pl' ? c.pl : c.en; }
  function makeSpots(cityId) {
    var c = cityOf(cityId), rz = c.id === 'rzeszow', base = D ? D.suggest(c, 'c') : 0.7, code = c.cc + '-' + c.id.slice(0, 2).toUpperCase();
    var AREAS = [['Old town', 'Stare Miasto'], ['City centre', 'Centrum'], ['Main square', 'Rynek'], ['Business district', 'Dzielnica biurowa'], ['Riverside', 'Nad rzeką'], ['Station area', 'Okolice dworca'], ['Residential area', 'Osiedle']];
    SPOTS = SPOT_T.map(function (t0, i) {
      var s = JSON.parse(JSON.stringify(t0));
      s.price = Math.max(0.4, Math.round(base * MULT[s.id] * 10) / 10);
      if (!rz) {
        s.addr = AREAS[i][S.lang === 'pl' ? 1 : 0] + ', ' + (S.lang === 'pl' ? c.pl : c.en);
        s.lat = c.lat + (s.y - 50) * -0.0006; s.lng = c.lng + (s.x - 50) * 0.0009;
        if (s.gate) s.gate = 'HP-' + code + '-00' + (i + 11);
      }
      return s;
    });
  }
  var TYPES = { drive: 'ty1', garage: 'ty2', under: 'ty3', outdoor: 'ty4', company: 'ty5' };
  var ACC = { basic: { k: 'accBasic', ic: 'route' }, connect: { k: 'accConnect', ic: 'signal' }, pro: { k: 'accPro', ic: 'bt' } };
  var FEAT = { cctv: ['cctv', 'CCTV', 'CCTV'], covered: ['roof', 'Covered', 'Zadaszone'], ev: ['bolt', 'EV charging', 'Ładowanie EV'], '247': ['clock', '24/7 access', 'Dostęp 24/7'] };
  var PRESETS = [{ k: 'pOff', a: 0, b: 0 }, { k: 'pDay', a: 8, b: 17 }, { k: 'pEve', a: 18, b: 31 }, { k: 'pAll', a: 0, b: 24 }];
  var AREA = [{ k: 'r1', avg: 2.4, hours: 200, occ: .55 }, { k: 'r2', avg: 1.2, hours: 180, occ: .25 }, { k: 'r3', avg: 1.8, hours: 70, occ: .4 }];

  var DEFAULT = {
    lang: /^pl\b/i.test(navigator.language || '') ? 'pl' : 'en',
    user: null, role: null, booking: null, history: [], fav: {}, plate: 'RZ 4K21', pay: 'blik',
    filters: { covered: false, ev: false, gate: false }, when: 'now', sel: 's2',
    host: null, spaces: [], city: 'rzeszow', draft: null, verified: false, replies: {}, balance: 186.5, earnings: [22.5, 38, 71, 55],
    chats: { anna: [{ me: 0, k: 'm1' }], team: [{ me: 0, k: 'm3' }] }, notif: true
  };
  /* Embed mode: the website shows live app screens in phone frames (app/?embed=host|explore|tiers|price|profile&lang=pl).
     It uses its own demo data and never touches the visitor's saved app data. */
  /* Colour themes: chosen in Settings (or ?theme=), stored on this phone */
  var THEMES = { emerald: { c: '#0c5a46', bar: 'default', sw: ['#ffffff', '#0c5a46', '#5fe0b4'] }, blackgold: { c: '#0b0b0c', bar: 'black-translucent', sw: ['#0b0b0c', '#d4af37', '#f5efe2'] }, emgold: { c: '#05281f', bar: 'black-translucent', sw: ['#05281f', '#d9b45a', '#7fe3bd'] } };
  var THEME = (location.search.match(/[?&]theme=(\w+)/) || [])[1] || null;
  if (!THEME && !/[?&]embed=/.test(location.search)) { try { THEME = localStorage.getItem('hp-theme'); } catch (e) {} }
  function applyTheme(th, store) {
    if (!THEMES[th]) th = 'emerald'; THEME = th;
    document.documentElement.dataset.theme = th;
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', THEMES[th].c);
    var b = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]'); if (b) b.setAttribute('content', THEMES[th].bar);
    if (store) { try { localStorage.setItem('hp-theme', th); } catch (e) {} }
  }
  applyTheme(THEME);
  var EMBED = (location.search.match(/[?&]embed=(\w+)/) || [])[1] || null;
  var EMBED_LANG = (location.search.match(/[?&]lang=(en|pl)/) || [])[1];
  var S = EMBED ? seedEmbed() : load();
  function seedEmbed() {
    var d = clone(DEFAULT);
    d.lang = EMBED_LANG || d.lang; d.user = { name: 'Tomasz Nowak', email: 'tomasz@example.com' }; d.role = 'both'; d.verified = true;
    d.spaces = []; d.ownAcct = 'private';
    d.draft = { type: 'under', address: 'ul. Kościuszki 10, Rzeszów', bay: '14', photo: null, tier: 'pro', instr: '', now: true, sched: [1, 1, 1, 1, 1, 3, 3], prices: [2.5, 1.0, 2.2] };
    return d;
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(STORE)); if (s) { var d = clone(DEFAULT); for (var k in s) d[k] = s[k];
      if (d.host && d.host.listed && (!d.spaces || !d.spaces.length)) { var h = d.host; d.spaces = [{ id: 'm1', type: h.type, address: h.address, bay: h.bay, photo: h.photo, tier: h.tier, instr: h.instr, sched: h.sched, prices: h.prices, sharing: h.sharing, paired: h.paired, city: 'rzeszow', loc: 'c' }]; }
      d.host = null; if (!d.spaces) d.spaces = []; if (!d.replies) d.replies = {}; if (!d.city) d.city = 'rzeszow';
      return d; } } catch (e) {}
    return clone(DEFAULT);
  }
  function demoSpaces() {
    return [
      { id: 'd1', type: 'under', address: 'ul. Kościuszki 10', bay: '14', city: 'rzeszow', loc: 'c', tier: 'pro', instr: '', sched: [1, 1, 1, 1, 1, 0, 0], prices: [1.2, 0.6, 0.8], sharing: true, paired: true, demand: .8 },
      { id: 'd2', type: 'drive', address: 'ul. Słowackiego 8', bay: '', city: 'rzeszow', loc: 'i', tier: 'basic', instr: 'Driveway on the right side of the house.', sched: [1, 1, 1, 1, 1, 0, 0], prices: [0.7, 0.4, 0.5], sharing: true, paired: false, demand: .55 },
      { id: 'd3', type: 'company', address: 'ul. Lubicz 23', bay: 'B2', city: 'krakow', loc: 'c', tier: 'connect', instr: '', sched: [3, 3, 3, 3, 3, 3, 3], prices: [2.2, 1.1, 1.6], sharing: true, paired: true, demand: .85 },
      { id: 'd4', type: 'garage', address: 'Andrássy út 41', bay: '3', city: 'budapest', loc: 'c', tier: 'pro', instr: '', sched: [2, 2, 2, 2, 2, 3, 3], prices: [1.9, 0.9, 1.3], sharing: false, paired: true, demand: .7 }
    ];
  }
  function save() { if (EMBED) return; try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) {} }

  /* =====================================================================
     Helpers
     ===================================================================== */
  function ic(n) { return '<svg><use href="#i-' + n + '"/></svg>'; }
  function L(arr) { return Array.isArray(arr) ? arr[S.lang === 'pl' ? 1 : 0] : arr; }
  function money(n, dec) { return new Intl.NumberFormat(S.lang === 'pl' ? 'pl-PL' : 'en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: dec === 0 ? 0 : 2, maximumFractionDigits: dec === 0 ? 0 : 2 }).format(n); }
  function num(n, d) { return new Intl.NumberFormat(S.lang === 'pl' ? 'pl-PL' : 'en-GB', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }).format(n); }
  function hm(ts) { var d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function dateStr(ts) { return new Date(ts).toLocaleDateString(S.lang === 'pl' ? 'pl-PL' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function spot(id) { if (id && id.indexOf('my-') === 0) return mySpots().filter(function (s) { return s.id === id; })[0] || asSpot(findSpace(id.slice(3)), 0); return SPOTS.filter(function (s) { return s.id === id; })[0]; }
  var MYPOS = [[45, 57], [33, 80], [72, 28], [84, 46], [24, 50]];
  function ownSpace(id) { return S.spaces.filter(function (x) { return x.id === id; })[0]; }
  function asSpot(h, i) {
    if (!h) return null; var c = cityOf(h.city);
    return { id: 'my-' + h.id, own: h.id, name: [t('yourSpace'), t('yourSpace')], addr: (h.address ? h.address + ', ' : '') + cityName(h.city), x: MYPOS[i % 5][0], y: MYPOS[i % 5][1], price: h.prices[0], rating: 5, rev: 0, km: 0.1, mins: 1, type: h.type, access: h.tier, feat: [], until: '17:00', host: S.user ? S.user.name : '', instr: [h.instr || '', h.instr || ''], live: h.sharing, mine: true, photo: h.photo, gate: 'HP-' + c.cc + '-' + h.id.toUpperCase(), lat: c.lat, lng: c.lng };
  }
  function mySpots() { return S.spaces.filter(function (h) { return h.city === S.city; }).map(asSpot); }
  function mySpot() { return mySpots()[0] || null; }
  function initials(n) { return (n || 'H').split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase(); }

  /* Spot pictures: simple illustrations (no external photos) */
  function thumb(s, h) {
    if (s.photo) return '<img src="' + s.photo + '" alt="">';
    var sky = { drive: ['#9fd3c1', '#e9f6f1'], garage: ['#a9c6d6', '#eef4f7'], under: ['#2b4650', '#4f6b73'], outdoor: ['#bfe3cf', '#f2faf6'], company: ['#b8c9d9', '#eef3f8'] }[s.type] || ['#bcd', '#eef'];
    var dark = s.type === 'under';
    var body;
    if (s.type === 'under') body = '<rect x="0" y="0" width="200" height="140" fill="url(#g' + s.id + h + ')"/><g stroke="#fff4c9" stroke-width="3" opacity=".7"><path d="M30 18h40M90 18h40M150 18h30"/></g><path d="M0 140 70 60h60l70 80Z" fill="#3b555c"/><g stroke="#f2a541" stroke-width="2.5"><path d="M86 60 60 140M114 60l26 80"/></g><text x="100" y="118" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="26" fill="#4fd1a5">14</text>';
    else if (s.type === 'garage' || s.type === 'company') body = '<rect width="200" height="140" fill="url(#g' + s.id + h + ')"/><rect x="0" y="112" width="200" height="28" fill="#c9d3d1"/><path d="M36 112V58l64-30 64 30v54Z" fill="#e5ece9"/><rect x="62" y="66" width="76" height="46" fill="#9fb0ae"/><g stroke="#87999a" stroke-width="2"><path d="M62 78h76M62 90h76M62 102h76"/></g><rect x="150" y="40" width="12" height="16" rx="2" fill="#137a5f"/>';
    else body = '<rect width="200" height="140" fill="url(#g' + s.id + h + ')"/><rect x="0" y="104" width="200" height="36" fill="#d7dfdc"/><path d="M30 104V62l46-26 46 26v42Z" fill="#f4f7f6"/><path d="M24 64 76 34l52 30" fill="none" stroke="#8a6f5a" stroke-width="6"/><rect x="58" y="78" width="22" height="26" fill="#9fb0ae"/><circle cx="160" cy="76" r="22" fill="#2f8a63"/><circle cx="150" cy="88" r="16" fill="#3aa575"/><path d="M118 140l20-36h40l-8 36Z" fill="#c2ccc9"/>';
    return '<svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g' + s.id + h + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient></defs>' + body + (dark ? '' : '') + '</svg>';
  }
  function accBadge(a) { var x = ACC[a]; return '<span class="acc-badge acc-' + a + '">' + ic(x.ic) + t(x.k) + '</span>'; }
  function stars(r) { return '<span class="stars">' + ic('star') + '</span> ' + num(r, 1); }
  function qrSvg(text, color) { var q = window.HPQR(text); return '<svg viewBox="0 0 ' + q.n + ' ' + q.n + '" shape-rendering="crispEdges"><path d="' + q.d + '" fill="' + (color || '#0c2b33') + '"/></svg>'; }

  /* =====================================================================
     Router
     ===================================================================== */
  var timers = [];
  function clearTimers() { timers.forEach(function (x) { clearInterval(x); clearTimeout(x); }); timers = []; }
  function go(h) { if (location.hash === h) render(); else location.hash = h; }
  window.addEventListener('hashchange', render);

  var TABS = [['explore', 'explore', 'tExplore'], ['bookings', 'calendar', 'tBookings'], ['host', 'share', 'tShare'], ['messages', 'chat', 'tMessages'], ['profile', 'user', 'tProfile']];
  function tabbar(cur) {
    return '<nav class="tabbar">' + TABS.map(function (x) {
      var badge = x[0] === 'bookings' && S.booking ? '<span class="badge">1</span>' : '';
      return '<a class="tab' + (cur === x[0] ? ' on' : '') + '" href="#/' + x[0] + '">' + ic(x[1]) + '<span>' + t(x[2]) + '</span>' + badge + '</a>';
    }).join('') + '</nav>';
  }

  function render() {
    clearTimers(); closeSheet(true);
    var parts = (location.hash.replace(/^#\/?/, '') || '').split('/');
    var r = parts[0];
    if (!S.user && ['welcome', 'signup', 'role'].indexOf(r) < 0) { if (r) { S.next = '#/' + parts.join('/'); save(); } r = 'welcome'; }
    if (S.user && !r) r = S.role === 'host' ? 'host' : 'explore';
    var V = VIEWS[r] || VIEWS.explore;
    var html = V(parts[1], parts[2]);
    app.innerHTML = html;
    var dark = app.querySelector('.screen.dark, .welcome');
    var sb = $('#statusbar'); if (sb) sb.classList.toggle('dark', !!dark && !app.querySelector('.hero-img'));
    if (V.after) V.after(parts[1], parts[2]);
    var sc = app.querySelector('.screen'); if (sc) sc.scrollTop = 0;
  }

  /* =====================================================================
     Sheets & toasts
     ===================================================================== */
  function sheet(html, onOpen) {
    closeSheet(true);
    var bg = document.createElement('div'); bg.className = 'sheet-bg';
    var sh = document.createElement('div'); sh.className = 'sheet'; sh.innerHTML = '<div class="grab"></div>' + html;
    app.appendChild(bg); app.appendChild(sh);
    requestAnimationFrame(function () { bg.classList.add('show'); sh.classList.add('show'); });
    bg.addEventListener('click', function () { closeSheet(); });
    if (onOpen) onOpen(sh);
    return sh;
  }
  function closeSheet(now) {
    $$('.sheet, .sheet-bg', app).forEach(function (el) {
      if (now) { el.remove(); return; }
      el.classList.remove('show'); setTimeout(function () { el.remove(); }, 320);
    });
  }
  function toast(msg) {
    var el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; app.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 300); }, 2400);
  }
  function confirmSheet(title, text, okLabel, onOk, danger) {
    sheet('<h2>' + title + '</h2><p class="lead">' + text + '</p><div class="row-btns"><button class="btn btn-outline" data-x="close">' + t('cancel') + '</button><button class="btn ' + (danger ? 'btn-dark' : 'btn-primary') + '" id="okBtn">' + okLabel + '</button></div>', function (sh) {
      $('#okBtn', sh).addEventListener('click', function () { closeSheet(); onOk(); });
    });
  }

  /* =====================================================================
     Views
     ===================================================================== */
  var VIEWS = {};

  /* ---------- Welcome / sign-up / role ---------- */
  VIEWS.welcome = function () {
    return '<section class="screen welcome fade-in"><div class="wl-bg">' + skyline() + '</div>' +
      '<div class="wl-top"><div class="wl-logo">' + ic('pin') + '</div><div class="wl-name">Ho-Park</div><p class="wl-tag">' + t('tagline') + '</p><span class="demo-pill">' + t('demo') + '</span></div>' +
      '<div class="wl-bottom"><h2 class="wl-slogan" id="slogan">' + t('sl1') + '</h2><div class="wl-dots" id="dots"><i class="on"></i><i></i><i></i></div>' +
      '<button class="btn btn-white" data-x="quick">' + t('withApple') + '</button>' +
      '<button class="btn btn-white" data-x="quick">' + t('withGoogle') + '</button>' +
      '<a class="btn btn-primary" href="#/signup">' + ic('mail') + t('withEmail') + '</a>' +
      '<p class="wl-alt">' + t('haveAcc') + ' <button data-x="quick">' + t('signIn') + '</button></p>' +
      '<p class="wl-legal">' + t('legal') + '</p></div></section>';
  };
  VIEWS.welcome.after = function () {
    var i = 0, k = ['sl1', 'sl2', 'sl3'];
    if (!reduceMotion) timers.push(setInterval(function () {
      i = (i + 1) % 3; var el = $('#slogan'); if (!el) return;
      el.style.opacity = 0; setTimeout(function () { el.innerHTML = t(k[i]); el.style.opacity = 1; }, 250);
      $$('#dots i').forEach(function (d, j) { d.classList.toggle('on', j === i); });
    }, 3200));
    var sl = $('#slogan'); if (sl) sl.style.transition = 'opacity .25s';
  };
  VIEWS.signup = function () {
    return '<section class="screen fade-in"><div class="topbar"><a class="icon-btn" href="#/welcome">' + ic('back') + '</a></div><div class="pad">' +
      '<h1 class="h-title" style="margin-bottom:18px">' + t('createAcc') + '</h1>' +
      '<label class="field"><span>' + t('name') + '</span><input class="input" id="suName" autocomplete="name" value="Tomasz Nowak"></label>' +
      '<label class="field"><span>' + t('email') + '</span><input class="input" id="suEmail" type="email" autocomplete="email" value="tomasz@example.com"></label>' +
      '<label class="field"><span>' + t('password') + '</span><input class="input" type="password" autocomplete="new-password" value="demo1234"></label>' +
      '<button class="btn btn-primary" data-x="signup" style="margin-top:8px">' + t('cont') + '</button>' +
      '<p class="wl-legal" style="color:var(--muted);margin-top:14px">' + t('legal') + '</p></div></section>';
  };
  VIEWS.role = function () {
    var r = S.role || 'driver';
    var c = function (v, icn, a, b) { return '<button class="choice' + (r === v ? ' on' : '') + '" data-x="role" data-v="' + v + '"><span class="ch-ic">' + ic(icn) + '</span><span><b>' + t(a) + '</b><small>' + t(b) + '</small></span><span class="radio"></span></button>'; };
    return '<section class="screen fade-in"><div class="topbar"></div><div class="pad"><h1 class="h-title">' + t('roleT') + '</h1><p class="muted" style="margin:6px 0 20px">' + t('roleS') + '</p>' +
      c('driver', 'car', 'roleDriver', 'roleDriverD') + c('host', 'share', 'roleHost', 'roleHostD') + c('both', 'people', 'roleBoth', 'roleBothD') +
      '<button class="btn btn-primary" data-x="roleGo" style="margin-top:10px">' + t('cont') + '</button></div></section>';
  };

  /* ---------- Explore (map & search) ---------- */
  function visibleSpots() {
    var f = S.filters;
    var list = SPOTS.concat(mySpots());
    return list.filter(function (s) {
      if (f.covered && s.feat.indexOf('covered') < 0 && ['garage', 'under'].indexOf(s.type) < 0) return false;
      if (f.ev && s.feat.indexOf('ev') < 0) return false;
      if (f.gate && s.access === 'basic') return false;
      return true;
    });
  }
  VIEWS.explore = function () {
    var f = S.filters, nf = (f.covered ? 1 : 0) + (f.ev ? 1 : 0) + (f.gate ? 1 : 0);
    var chip = function (v, icn, k) { return '<button class="chip' + (S.when === v ? ' on' : '') + '" data-x="when" data-v="' + v + '">' + ic(icn) + t(k) + '</button>'; };
    return '<section class="screen explore fade-in">' +
      '<div class="ex-head"><div class="searchbar">' + ic('search') + '<button class="sb-txt" data-x="cityPick"><small>' + t('curLoc') + '</small><b class="sb-city">' + esc(cityName(S.city)) + ic('chev') + '</b></button><button class="icon-btn" data-x="filters" aria-label="' + t('filters') + '">' + ic('filter') + '</button></div>' +
      '<div class="chips">' + chip('now', 'target', 'now') + chip('1h', 'clock', 'h1') + chip('today', 'calendar', 'today') + '<button class="chip' + (nf ? ' on' : '') + '" data-x="filters">' + ic('filter') + t('filters') + (nf ? ' · ' + nf : '') + '</button></div></div>' +
      '<div class="map" id="map">' + mapSvg() + '<span class="me-dot" style="left:48%;top:60%"></span><div id="pins"></div>' +
      '<div class="live-count"><span class="live-dot"></span><b id="liveN">0</b>&nbsp;' + t('liveNow') + '</div>' +
      '<div class="map-tools"><button class="icon-btn" data-x="locate" aria-label="Locate">' + ic('target') + '</button><button class="icon-btn" data-x="listview" aria-label="List">' + ic('list') + '</button></div>' +
      '<div class="listview" id="listview" hidden></div></div>' +
      '<div class="ex-card" id="exCard"></div></section>' + tabbar('explore');
  };
  VIEWS.explore.after = function () {
    drawPins(); drawCard();
    timers.push(setInterval(function () {
      // spaces appear and disappear as their owners switch sharing on and off
      var dyn = SPOTS.filter(function (s) { return s.dyn; });
      var s = dyn[Math.floor(Math.random() * dyn.length)];
      if (s.id === S.sel) return;
      s.live = !s.live; drawPins();
    }, 4000));
  };
  function drawPins() {
    var box = $('#pins'); if (!box) return;
    var list = visibleSpots(), n = 0;
    box.innerHTML = list.map(function (s) {
      var on = s.live; if (on) n++;
      return '<button class="mpin' + (s.id === S.sel ? ' sel' : '') + (s.mine ? ' mine' : '') + (on ? '' : ' gone') + '" style="left:' + s.x + '%;top:' + s.y + '%" data-x="pin" data-v="' + s.id + '"><span class="bub">' + (s.access !== 'basic' ? ic('key') : '') + (s.mine ? t('yourSpace') : money(s.price)) + '</span></button>';
    }).join('');
    var ln = $('#liveN'); if (ln) ln.textContent = 31 + n;
    var lv = $('#listview'); if (lv && !lv.hidden) drawList();
  }
  function drawList() {
    var lv = $('#listview');
    var list = visibleSpots().filter(function (s) { return s.live; }).sort(function (a, b) { return a.km - b.km; });
    lv.innerHTML = list.length ? list.map(function (s) { return spotRow(s, 'l'); }).join('') : '<p class="empty">' + t('noSpots') + '</p>';
  }
  function spotRow(s, h, tag) {
    return '<a class="spot-row" href="#/spot/' + s.id + '"><span class="thumb">' + thumb(s, h) + '</span><span class="sr-info"><b>' + L(s.name) + '</b><span class="meta"><span>' + ic('pin') + num(s.km, 1) + ' km</span><span>' + ic('car') + s.mins + ' ' + t('min') + '</span>' + (s.rev ? '<span>' + stars(s.rating) + ' (' + s.rev + ')</span>' : '') + '</span>' + accBadge(s.access) + '</span><span class="price"><b>' + money(s.price) + '</b><small>' + t('perHour') + '</small></span></a>';
  }
  function drawCard() {
    var c = $('#exCard'); if (!c) return;
    var s = spot(S.sel) || SPOTS[1];
    c.innerHTML = '<div class="grab"></div>' + spotRow(s, 'c') + '<a class="btn btn-primary" href="#/spot/' + s.id + '">' + t('viewDetails') + '</a>';
  }

  /* ---------- Spot detail ---------- */
  VIEWS.spot = function (id) {
    var s = spot(id) || SPOTS[0];
    var fav = S.fav[s.id];
    var feats = (s.feat.length ? s.feat : []).map(function (f) { var x = FEAT[f]; return '<span>' + ic(x[0]) + x[S.lang === 'pl' ? 2 : 1] + '</span>'; }).join('') + '<span>' + ic('clock') + t('avUntil') + ' ' + s.until + '</span>';
    var accD = { basic: 'accBasicD', connect: 'accConnectD', pro: 'accProD' }[s.access];
    return '<section class="screen fade-in"><div class="hero-img">' + thumb(s, 'h') + '<div class="float-btns"><a class="icon-btn" href="#/explore">' + ic('back') + '</a><button class="icon-btn" data-x="fav" data-v="' + s.id + '" style="color:' + (fav ? 'var(--red)' : 'inherit') + '">' + ic(fav ? 'heartf' : 'heart') + '</button></div></div>' +
      '<div class="detail"><h1>' + L(s.name) + '</h1><p class="meta" style="font-size:14px">' + ic('pin') + ' ' + esc(s.addr) + ' · ' + num(s.km, 1) + ' km</p>' +
      (s.rev ? '<p class="meta" style="font-size:14px">' + stars(s.rating) + ' (' + s.rev + ' ' + t('reviews') + ')</p>' : '') +
      '<div class="feat-chips">' + feats + '</div>' +
      '<div class="box"><div class="box-h"><span class="ic-round">' + ic(ACC[s.access].ic) + '</span><b>' + t('access') + ': ' + t(ACC[s.access].k) + '</b></div><p>' + t(accD) + '</p></div>' +
      '<div class="box host-card"><span class="avatar">' + initials(s.host) + '</span><div style="flex:1"><b style="font-family:var(--fh)">' + esc(s.host) + '</b><p class="small muted">' + t('hostSince') + '</p></div><a class="link" href="#/messages">' + ic('chat') + '</a></div></div>' +
      '<div class="sticky-cta"><div class="price"><b>' + money(s.price) + '</b><small>' + t('perHour') + '</small></div>' + (s.mine ? '<a class="btn btn-dark" href="#/host/space/' + s.own + '">' + t('mySpace') + '</a>' : '<a class="btn btn-primary" href="#/book/' + s.id + '">' + t('bookNow') + '</a>') + '</div></section>';
  };

  /* ---------- Booking & payment ---------- */
  var BK = { start: 0, dur: 3 };
  VIEWS.book = function (id) {
    var s = spot(id) || SPOTS[0];
    BK.id = s.id; if (!BK.fresh) { BK.start = 0; BK.dur = 3; } BK.fresh = false;
    return '<section class="screen fade-in"><div class="topbar"><a class="icon-btn" href="#/spot/' + s.id + '">' + ic('back') + '</a><h1>' + t('complete') + '</h1></div><div class="pad" style="padding-top:4px">' +
      '<div class="bk-spot"><span class="thumb" style="width:72px;height:60px">' + thumb(s, 'b') + '</span><div class="sr-info"><b>' + L(s.name) + '</b><span class="meta">' + esc(s.addr) + '</span>' + (s.rev ? '<span class="meta">' + stars(s.rating) + ' (' + s.rev + ')</span>' : '') + '</div></div>' +
      '<div class="bk-row">' + ic('calendar') + '<div class="grow"><small>' + t('start') + '</small><div class="seg" id="startSeg" style="margin-top:6px"><button data-x="start" data-v="0" class="on">' + t('now') + '</button><button data-x="start" data-v="30">' + t('in30') + '</button><button data-x="start" data-v="60">' + t('in60') + '</button></div></div></div>' +
      '<div class="bk-row">' + ic('clock') + '<div class="grow"><small>' + t('duration') + '</small><b id="bkTimes"></b></div><div class="stepper"><button data-x="dur" data-v="-0.5" aria-label="-">' + ic('minus') + '</button><b id="bkDur"></b><button data-x="dur" data-v="0.5" aria-label="+">' + ic('plus') + '</button></div></div>' +
      '<div class="bk-row">' + ic('car') + '<div class="grow"><small>' + t('carReg') + '</small><b id="bkPlate">' + esc(S.plate) + '</b></div><button class="link" data-x="plate">' + t('change') + '</button></div>' +
      '<h3 class="sec-t">' + t('priceDetails') + '</h3><div class="price-lines" id="bkPrice"></div>' +
      '<h3 class="sec-t">' + t('payMethod') + '</h3><div id="pms"></div>' +
      '<button class="btn btn-primary" data-x="pay" style="margin-top:8px">' + t('payConfirm') + '</button><p class="secure-note">' + ic('shield') + t('secure') + '</p></div></section>';
  };
  VIEWS.book.after = function () { bkUpdate(); };
  function bkUpdate() {
    var s = spot(BK.id); if (!s) return;
    var st = Date.now() + BK.start * 60000, en = st + BK.dur * 3600000, total = s.price * BK.dur;
    $('#bkDur').textContent = num(BK.dur, BK.dur % 1 ? 1 : 0) + ' h';
    $('#bkTimes').textContent = dateStr(st) + ', ' + hm(st) + ' – ' + hm(en);
    $('#bkPrice').innerHTML = '<div><span>' + t('parking') + ' (' + money(s.price) + ' × ' + num(BK.dur, BK.dur % 1 ? 1 : 0) + ' h)</span><span>' + money(total) + '</span></div><div><span>' + t('serviceFee') + '</span><span>' + t('included') + '</span></div><div class="total"><span>' + t('total') + '</span><span>' + money(total) + '</span></div>';
    $$('#startSeg button').forEach(function (b) { b.classList.toggle('on', +b.dataset.v === BK.start); });
    var pm = function (v, icon, label, dis) { return '<button class="pm' + (S.pay === v ? ' on' : '') + (dis ? ' dis' : '') + '" data-x="pm" data-v="' + v + '"><span class="pm-ic' + (v === 'blik' ? ' blik' : '') + '">' + (v === 'blik' ? 'BLIK' : ic(icon)) + '</span>' + label + (dis ? '<em>' + t('soon') + '</em>' : '<span class="radio"></span>') + '</button>'; };
    $('#pms').innerHTML = pm('card', 'card', t('card') + ' · •••• 4242') + pm('blik', '', 'BLIK') + pm('apple', 'phone', 'Apple Pay') + pm('google', 'phone', 'Google Pay') + pm('crypto', 'coin', t('crypto'), true);
    BK.total = total; BK.st = st; BK.en = en;
  }
  function payFlow() {
    var s = spot(BK.id);
    var finish = function () {
      S.booking = { id: 'b' + Date.now(), spot: s.id, start: BK.st, end: BK.en, plate: S.plate, total: BK.total, pay: S.pay, opened: false };
      S.history.unshift({ id: S.booking.id, spot: s.id, start: BK.st, end: BK.en, total: BK.total, plate: S.plate, status: 'active' });
      save();
      var sh = $('.sheet');
      sh.innerHTML = '<div class="grab"></div><div class="success">' + ic('check') + '<h2>' + t('booked') + '</h2><p>' + t('bookedD') + '</p><div class="review-row"><span>' + L(s.name) + '</span><b>' + hm(BK.st) + ' – ' + hm(BK.en) + '</b></div><div class="review-row"><span>' + t('total') + '</span><b>' + money(BK.total) + '</b></div><a class="btn btn-primary" href="#/session" style="margin-top:16px">' + t('goSession') + '</a></div>';
    };
    var wait = function (msg) {
      var sh = $('.sheet'); sh.innerHTML = '<div class="grab"></div><div class="success"><div class="spinner"></div><p>' + msg + '</p></div>';
      setTimeout(finish, 1700);
    };
    if (S.pay === 'blik') {
      sheet('<h2>' + t('enterBlik') + '</h2><p class="lead">' + t('blikHint') + '</p><div class="blik-code"><input id="blik" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="••••••"></div><button class="btn btn-primary" id="blikGo" disabled>' + t('payConfirm') + ' · ' + money(BK.total) + '</button>', function (sh) {
        var inp = $('#blik', sh), b = $('#blikGo', sh);
        setTimeout(function () { inp.focus(); }, 300);
        inp.addEventListener('input', function () { inp.value = inp.value.replace(/\D/g, '').slice(0, 6); b.disabled = inp.value.length !== 6; });
        b.addEventListener('click', function () { wait(t('confirmBank')); });
      });
    } else { sheet(''); wait(t('processing')); }
  }

  /* ---------- Active session ---------- */
  VIEWS.session = function () {
    var b = S.booking;
    if (!b) return '<section class="screen fade-in"><div class="topbar"><h1>' + t('activeBk') + '</h1></div><div class="empty">' + ic('car') + '<b>' + t('noActive') + '</b><p>' + t('noActiveD') + '</p><a class="btn btn-primary" href="#/explore" style="margin-top:18px">' + t('findSpace') + '</a></div></section>' + tabbar('bookings');
    var s = spot(b.spot) || SPOTS[0];
    var access = s.access === 'basic'
      ? '<button class="drow" data-x="instr">' + ic('doc') + '<span class="grow">' + t('accInstr') + '</span>' + ic('chev') + '</button><p class="instr" id="instrTxt" hidden>' + esc(L(s.instr) || '') + '</p>'
      : '<button class="btn gate-btn" data-x="gate">' + ic('key') + t('openGate') + '</button>';
    return '<section class="screen dark fade-in"><div class="topbar"><h1>' + t('activeBk') + '</h1><button class="icon-btn">' + ic('dots') + '</button></div><div class="pad" style="padding-top:0">' +
      '<div class="ring-wrap"><svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="52"/><circle class="ring-fg" id="ring" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="0"/></svg><div class="ring-txt"><b id="remain">0:00:00</b><small id="remainL">' + t('timeLeft') + '</small></div></div>' +
      '<div class="row-btns" style="margin-bottom:16px"><button class="btn btn-outline" data-x="extend">' + t('extend') + '</button><button class="btn btn-outline" data-x="end">' + t('endEarly') + '</button></div>' +
      '<div class="dcard"><div class="spot-row"><span class="thumb" style="width:76px;height:62px">' + thumb(s, 's') + '</span><span class="sr-info"><b>' + L(s.name) + '</b><span class="meta">' + esc(s.addr) + '</span><span class="meta"><span class="plate" style="border-color:rgba(255,255,255,.6);color:#fff">' + esc(b.plate) + '</span> ' + hm(b.start) + ' – ' + hm(b.end) + '</span></span></div></div>' +
      access +
      '<a class="drow" href="https://maps.apple.com/?daddr=' + s.lat + ',' + s.lng + '" target="_blank" rel="noopener">' + ic('route') + '<span class="grow">' + t('navigate') + '</span>' + ic('chev') + '</a>' +
      '<a class="drow" href="#/chat/anna">' + ic('help') + '<span class="grow">' + t('needHelp') + '</span><span class="link">' + t('contactHost') + '</span></a>' +
      '<div class="co2-card" style="margin-top:14px">' + ic('leaf') + '<div><b>' + t('co2T') + '</b><small>' + t('co2D') + '</small></div></div></div></section>' + tabbar('bookings');
  };
  VIEWS.session.after = function () {
    var b = S.booking; if (!b) return;
    var tick = function () {
      var now = Date.now(), el = $('#remain'); if (!el) return;
      var future = now < b.start, rem = future ? b.start - now : b.end - now;
      if (!future && rem <= 0) { endBooking(true); return; }
      var s = Math.max(0, Math.floor(rem / 1000));
      el.textContent = Math.floor(s / 3600) + ':' + ('0' + Math.floor(s / 60) % 60).slice(-2) + ':' + ('0' + s % 60).slice(-2);
      $('#remainL').textContent = t(future ? 'startsIn' : 'timeLeft');
      var frac = future ? 1 : rem / (b.end - b.start);
      $('#ring').style.strokeDashoffset = (326.7 * (1 - frac)).toFixed(1);
    };
    tick(); timers.push(setInterval(tick, 1000));
  };
  function endBooking(auto) {
    var b = S.booking; if (!b) return;
    S.history.forEach(function (h) { if (h.id === b.id) { h.status = 'done'; h.end = Math.min(h.end, Date.now()); } });
    var s = spot(b.spot); if (s && s.mine === undefined) { /* driver booking */ }
    S.booking = null; save(); toast(t('ended')); go('#/bookings');
  }
  function gateFlow() {
    var b = S.booking, s = spot(b.spot), pro = s.access === 'pro';
    var steps = [t('gs1'), t('gs2'), t(pro ? 'gs3p' : 'gs3c'), t(pro ? 'gs4p' : 'gs4c')];
    sheet('<h2>' + t('scanT') + '</h2><div class="scan-view"><div class="scan-qr">' + qrSvg('https://ho-park.com/gate/' + (s.gate || 'HP-RZ-0014')) + '</div><span class="scan-frame"></span><span class="scan-line" id="scanLine"></span></div><ol class="steps-v" id="gSteps">' + steps.map(function (x, i) { return '<li><i>' + (i + 1) + '</i>' + x + '</li>'; }).join('') + '</ol><div id="gDone"></div>', function (sh) {
      var lis = $$('#gSteps li', sh), i = 0;
      var next = function () {
        lis.forEach(function (li, j) { li.classList.toggle('done', j < i); li.classList.toggle('now', j === i); });
        if (i === 1) { var sl = $('#scanLine', sh); if (sl) sl.remove(); }
        if (i >= lis.length) {
          b.opened = true; save();
          $('#gDone', sh).innerHTML = '<div class="success" style="padding-top:0">' + ic('check') + '<h2>' + t('gateOpen') + '</h2><p>' + t('gateOpenD') + '</p><button class="btn btn-primary" data-x="close">' + t('done') + '</button></div>';
          return;
        }
        i++; setTimeout(next, i === 1 ? 1600 : 1100);
      };
      next();
    });
  }

  /* ---------- Bookings list ---------- */
  var bkTab = 'active';
  VIEWS.bookings = function () {
    var now = Date.now();
    var items = S.history.filter(function (h) {
      if (bkTab === 'active') return h.status === 'active' && h.start <= now;
      if (bkTab === 'upcoming') return h.status === 'active' && h.start > now;
      return h.status === 'done';
    });
    var seg = ['active', 'upcoming', 'past'].map(function (k) { return '<button class="' + (bkTab === k ? 'on' : '') + '" data-x="bktab" data-v="' + k + '">' + t(k) + '</button>'; }).join('');
    return '<section class="screen fade-in"><div class="topbar"><h1>' + t('tBookings') + '</h1></div><div class="pad" style="padding-top:4px"><div class="seg" style="margin-bottom:16px">' + seg + '</div>' +
      (items.length ? items.map(function (h) {
        var s = spot(h.spot) || SPOTS[0];
        return '<a class="bk-card" href="' + (h.status === 'active' ? '#/session' : '#/spot/' + s.id) + '"><span class="thumb">' + thumb(s, 'k' + h.id) + '</span><span class="sr-info"><b>' + L(s.name) + '</b><span class="meta">' + dateStr(h.start) + ' · ' + hm(h.start) + '–' + hm(h.end) + '</span><span class="meta"><span class="status ' + (h.status === 'active' ? 'st-active' : 'st-done') + '">' + t(h.status === 'active' ? 'active' : 'past') + '</span> ' + money(h.total) + '</span></span>' + ic('chev') + '</a>';
      }).join('') : '<div class="empty">' + ic('calendar') + '<b>' + t('noBk') + '</b><a class="btn btn-primary" href="#/explore" style="margin-top:16px">' + t('findSpace') + '</a></div>') +
      '</div></section>' + tabbar('bookings');
  };

  /* ---------- Host (Share) ---------- */
  VIEWS.host = function (sub, step) {
    if (sub === 'new') return hostWizard(+step || 1);
    if (sub === 'device') return devicePair(step);
    if (sub === 'space' && findSpace(step)) return spaceDetail(step);
    if (sub === 'start') return hostLanding();
    return ownerDash();
  };
  VIEWS.host.after = function (sub, step) { if (sub === 'new') wizAfter(+step || 1); if (sub === 'start') simAfter(); if (!sub) ownerAfter(); };
  function hostLanding() {
    var hl = function (icn, a, b) { return '<div class="hl-item"><span class="ic-round">' + ic(icn) + '</span><div><b>' + t(a) + '</b><small>' + t(b) + '</small></div></div>'; };
    return '<section class="screen fade-in"><div class="host-hero">' + houseArt() + '<span class="earn-pill">' + ic('wallet') + t('earnPill') + '</span></div><div class="pad">' +
      '<h1 class="h-title">' + t('haveSpace') + '</h1><p class="muted" style="margin-top:10px;line-height:1.5">' + t('haveSpaceD') + '</p>' +
      '<div class="hl-list">' + hl('calendar', 'hl1', 'hl1d') + hl('tag', 'hl2', 'hl2d') + hl('key', 'hl3', 'hl3d') + hl('chart', 'hl4', 'hl4d') + '</div>' +
      simCard() +
      '<a class="btn btn-primary" href="#/host/new/1">' + t('listSpace') + '</a><button class="btn btn-outline" data-x="demoOwner" style="margin-top:10px">' + ic('share') + t('demoOwner') + '</button><a class="btn btn-ghost" href="' + SITE + 'owners.html" target="_top" rel="noopener">' + t('learnMore') + ' ' + ic('ext') + '</a>' +
      '<div class="pilot-card">' + ic('leaf') + '<span>' + t('pilot') + '</span></div></div></section>' + tabbar('host');
  }
  function draft() {
    if (!S.draft) { var p0 = D ? D.suggest(cityOf(S.city), 'c') : 1; S.draft = { type: 'under', address: '', bay: '', photo: null, tier: 'pro', instr: '', now: true, sched: [1, 1, 1, 1, 1, 3, 3], city: S.city, loc: 'c', prices: tri(p0) }; }
    if (!S.draft.city) S.draft.city = S.city; if (!S.draft.loc) S.draft.loc = 'c';
    return S.draft;
  }
  function tri(p0) { return [p0, Math.max(.4, Math.round(p0 * 5) / 10), Math.max(.4, Math.round(p0 * 7) / 10)]; }
  // area averages for the price matrix, from public parking prices in the space's city (simulation)
  function area(d) {
    var c = cityOf(d.city), sug = D ? D.suggest(c, d.loc || 'c') : 1.2, avg = Math.round(sug * 1.08 * 10) / 10;
    var dem = D ? D.model.demand[c.st] * D.model.loc[d.loc || 'c'] : .7;
    return [{ k: 'r1', avg: avg, hours: 200, occ: .5 * dem }, { k: 'r2', avg: Math.max(.4, Math.round(avg * 5) / 10), hours: 180, occ: .22 * dem }, { k: 'r3', avg: Math.max(.4, Math.round(avg * 7.5) / 10), hours: 70, occ: .35 * dem }];
  }
  function hostWizard(n) {
    var d = draft(), body = '';
    var prog = '<div class="progress">' + [1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= n ? 'on' : '') + '"></i>'; }).join('') + '</div>';
    if (n === 1) {
      body = '<h1 class="h-title">' + t('w1T') + '</h1><h3 class="sec-t">' + t('spaceType') + '</h3>' +
        ['drive', 'garage', 'under', 'outdoor', 'company'].map(function (k) { return '<button class="choice' + (d.type === k ? ' on' : '') + '" data-x="dtype" data-v="' + k + '" style="padding:12px 14px"><span class="ch-ic" style="width:38px;height:38px;font-size:19px">' + ic({ drive: 'share', garage: 'roof', under: 'p', outdoor: 'map', company: 'bank' }[k]) + '</span><b style="font-size:15px">' + t(TYPES[k]) + '</b><span class="radio"></span></button>'; }).join('') +
        '<div class="field" style="margin-top:10px"><span>' + t('city') + '</span><button class="input city-btn" data-x="dCity">' + ic('pin') + '<b>' + esc(cityName(d.city)) + '</b>' + ic('chev') + '</button></div>' +
        '<div class="field"><span>' + t('where') + '</span><div class="seg">' + ['c', 'i', 'o'].map(function (k) { return '<button class="' + (d.loc === k ? 'on' : '') + '" data-x="dLoc" data-v="' + k + '">' + t('loc' + k) + '</button>'; }).join('') + '</div></div>' +
        '<label class="field"><span>' + t('address') + '</span><input class="input" id="dAddr" value="' + esc(d.address) + '" placeholder="' + esc(t('addrPh')) + '"></label>' +
        '<label class="field"><span>' + t('bay') + '</span><input class="input" id="dBay" value="' + esc(d.bay) + '"></label>' +
        '<label class="photo-drop" id="photoDrop">' + (d.photo ? '<img src="' + d.photo + '" alt="">' : ic('image') + '<span>' + t('photo') + '</span>') + '<input type="file" accept="image/*" id="dPhoto"></label>' + (d.photo ? '<p class="small muted" style="margin-top:6px;text-align:center">' + t('photoChange') + '</p>' : '');
    } else if (n === 2) {
      var tier = function (k, lvl, name, desc, bullets, icn, rec) {
        return '<button class="tier tier-' + k + (d.tier === k ? ' on' : '') + '" data-x="dtier" data-v="' + k + '">' + (rec ? '<span class="rec">' + t('recommended') + '</span>' : '') + '<div class="tier-h"><span class="ch-ic">' + ic(icn) + '</span><span style="flex:1"><span class="tier-lvl">' + t(lvl) + '</span><b>' + t(name) + '</b></span><span class="radio"></span></div><p>' + t(desc) + '</p><ul>' + bullets.map(function (x) { return '<li>' + ic('tick') + t(x) + '</li>'; }).join('') + '</ul></button>';
      };
      body = '<h1 class="h-title">' + t('w2T') + '</h1><p class="muted" style="margin:6px 0 16px">' + t('w2S') + '</p>' +
        tier('basic', 'lvl1', 'tBasic', 'tBasicD', ['b1', 'b2', 'b3'], 'route') +
        tier('connect', 'lvl2', 'tConnect', 'tConnectD', ['c1', 'c2', 'c3'], 'signal') +
        tier('pro', 'lvl3', 'tPro', 'tProD', ['p1', 'p2', 'p3', 'p4'], 'bt', true) +
        (d.tier === 'basic' ? '<label class="field"><span>' + t('instr') + '</span><textarea class="input" id="dInstr" rows="3" placeholder="' + esc(t('instrPh')) + '">' + esc(d.instr) + '</textarea></label>' : '') +
        '<p class="tier-note">' + t('tierNote') + '</p>';
    } else if (n === 3) {
      body = '<h1 class="h-title">' + t('w3T') + '</h1><div style="margin:16px 0"><button class="switch-card' + (d.now ? ' on' : '') + '" data-x="dnow"><span class="ic-round">' + ic('power') + '</span><span style="flex:1"><b>' + t('shareNow') + '</b><small>' + t('shareNowD') + '</small></span><span class="tgl"></span></button></div>' +
        '<h3 class="sec-t">' + t('schedule') + '</h3><p class="small muted" style="margin:-4px 0 10px">' + t('schedHint') + '</p><div class="sched">' +
        d.sched.map(function (p, i) { var pr = PRESETS[p]; var a = pr.a, b = Math.min(pr.b, 24); var bar = pr.b > 24 ? '<i style="left:' + (a / 24 * 100) + '%;right:0"></i><i style="left:0;width:' + ((pr.b - 24) / 24 * 100) + '%"></i>' : (b > a ? '<i style="left:' + (a / 24 * 100) + '%;width:' + ((b - a) / 24 * 100) + '%"></i>' : ''); return '<button class="sched-row" data-x="dsched" data-v="' + i + '"><b>' + t('d' + (i + 1)) + '</b><span class="sched-bar">' + bar + '</span><span>' + t(pr.k) + '</span></button>'; }).join('') + '</div>';
    } else if (n === 4) {
      body = '<h1 class="h-title">' + t('w4T') + '</h1><p class="muted" style="margin:6px 0 16px">' + t('w4S') + '</p><div class="pr-head"><span></span><span>' + t('areaAvg') + '</span><span>' + t('yourPrice') + '</span></div><div class="pr-table">' +
        area(d).map(function (r, i) { return '<div class="pr-row"><span><b>' + t(r.k) + '</b><small>' + t('perH') + '</small></span><span class="pr-avg">' + money(r.avg) + '</span><label class="pr-in"><span>€</span><input type="number" inputmode="decimal" step="0.1" min="0" value="' + d.prices[i] + '" data-pi="' + i + '"></label><span class="pr-d" id="prd' + i + '"></span></div>'; }).join('') +
        '</div><div class="est-card"><small>' + t('estInc') + '</small><b id="estV"></b><small id="estC"></small></div>';
    } else {
      var schedTxt = d.now ? t('shareNow') : t('schedule');
      body = '<h1 class="h-title">' + t('w5T') + '</h1><div style="margin:14px 0"><span class="thumb" style="width:100%;height:150px;display:block">' + thumb({ id: 'rv', type: d.type, photo: d.photo }, 'r') + '</span></div>' +
        '<div class="review-row"><span>' + t('type') + '</span><b>' + t(TYPES[d.type]) + (d.bay ? ' · ' + esc(d.bay) : '') + '</b></div>' +
        '<div class="review-row"><span>' + t('address') + '</span><b>' + esc((d.address ? d.address + ', ' : '') + cityName(d.city)) + '</b></div>' +
        '<div class="review-row"><span>' + t('accessLvl') + '</span><b>' + t({ basic: 'tBasic', connect: 'tConnect', pro: 'tPro' }[d.tier]) + '</b></div>' +
        '<div class="review-row"><span>' + t('availability') + '</span><b>' + schedTxt + '</b></div>' +
        '<div class="review-row"><span>' + t('price') + '</span><b>' + money(d.prices[0]) + ' ' + t('perHour') + '</b></div>' +
        '<label class="check-row"><input type="checkbox" id="dAgree"><span>' + t('agree') + '</span></label>';
    }
    var nextBtn = n < 5 ? '<button class="btn btn-primary" data-x="wnext" data-v="' + n + '">' + t('cont') + '</button>' : '<button class="btn btn-primary" data-x="publish" id="pubBtn" disabled>' + t('publish') + '</button>';
    return '<section class="screen fade-in"><div class="topbar"><a class="icon-btn" href="' + (n > 1 ? '#/host/new/' + (n - 1) : '#/host') + '"' + (n === 1 ? ' data-x="wizClose"' : '') + '>' + ic(n > 1 ? 'back' : 'close') + '</a><h1 style="font-size:15px;color:var(--muted)">' + (d.editing ? t('editing') + ' · ' : '') + t('step') + ' ' + n + ' ' + t('of') + ' 5</h1></div>' + prog + '<div class="pad">' + body + '</div></section><div class="wiz-foot">' + (n > 1 ? '<a class="btn btn-outline" href="#/host/new/' + (n - 1) + '">' + t('back') + '</a>' : '') + nextBtn + '</div>';
  }
  function wizAfter(n) {
    var d = draft();
    if (n === 1) {
      $('#dAddr').addEventListener('input', function (e) { d.address = e.target.value; save(); });
      $('#dBay').addEventListener('input', function (e) { d.bay = e.target.value; save(); });
      $('#dPhoto').addEventListener('change', function (e) {
        var f = e.target.files[0]; if (!f) return;
        var img = new Image(), url = URL.createObjectURL(f);
        img.onload = function () {
          var c = document.createElement('canvas'), w = 640, h = Math.round(img.height * w / img.width);
          c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0, w, h);
          d.photo = c.toDataURL('image/jpeg', .72); save(); render();
        };
        img.src = url;
      });
    }
    if (n === 2) { var ins = $('#dInstr'); if (ins) ins.addEventListener('input', function (e) { d.instr = e.target.value; save(); }); }
    if (n === 4) {
      var calc = function () {
        var est = 0, base = 0;
        area(d).forEach(function (r, i) {
          var p = d.prices[i], el = $('#prd' + i);
          if (!(p > 0)) { el.textContent = '–'; el.className = 'pr-d'; return; }
          var dl = p / r.avg - 1, pct = Math.round(dl * 100);
          el.className = 'pr-d ' + (dl < -.1 ? 'low' : dl > .1 ? 'high' : 'ok');
          el.textContent = Math.abs(pct) <= 2 ? '≈ ' + t('avgOk') : (pct > 0 ? '+' : '−') + Math.abs(pct) + '%';
          est += r.hours * Math.max(.03, Math.min(.95, r.occ * (1 - 1.2 * dl))) * p * .85;
          base += r.hours * r.occ * r.avg * .85;
        });
        $('#estV').textContent = money(est, 0); $('#estC').textContent = t('atAvg') + ' ' + money(base, 0);
      };
      $$('[data-pi]').forEach(function (inp) { inp.addEventListener('input', function () { d.prices[+inp.dataset.pi] = parseFloat(String(inp.value).replace(',', '.')) || 0; save(); calc(); }); });
      calc();
    }
    if (n === 5) { var a = $('#dAgree'); a.addEventListener('change', function () { $('#pubBtn').disabled = !a.checked; }); }
  }
  /* =====================================================================
     Owner dashboard — mirrors the web Owner Dashboard (dashboard.html):
     demo accounts Private (2 spaces) / Company (7 spaces) with the same generated figures,
     plus "Mine" for spaces the user adds in the app. All bookings are simulated demo data.
     ===================================================================== */
  var SHARE = 0.85;
  var OWN = { tab: 'ov', y: TODAY.getFullYear(), m: TODAY.getMonth(), stars: 0, space: '', replying: null, spf: 'all', q: '', mxc: '' };
  var WTYPE = ['under', 'garage', 'drive', 'company', 'outdoor'];
  var DEMO = {
    private: { owner: 'Anna Kowalska', iban: 'PL •• 4471', spaces: [
      { id: 'a1', name: ['Garage · bay 14', 'Garaż · miejsce 14'], addr: 'ul. Kościuszki 10', city: 'rzeszow', loc: 'c', type: 0, tier: 'pro', price: 1.2, sched: 'wkev', demand: .8, on: true },
      { id: 'a2', name: ['Driveway at home', 'Podjazd przy domu'], addr: 'ul. Słowackiego 8', city: 'rzeszow', loc: 'i', type: 2, tier: 'basic', price: 0.7, sched: 'wk', demand: .55, on: true }
    ] },
    company: { owner: 'Tech Hub Sp. z o.o.', iban: 'PL •• 9032', spaces: [
      { id: 'c1', name: ['Office car park · bay 1', 'Parking biurowy · miejsce 1'], addr: 'al. Piłsudskiego 34', city: 'rzeszow', loc: 'c', type: 3, tier: 'connect', price: 0.9, sched: 'wkev', demand: .75, on: true },
      { id: 'c2', name: ['Office car park · bay 2', 'Parking biurowy · miejsce 2'], addr: 'al. Piłsudskiego 34', city: 'rzeszow', loc: 'c', type: 3, tier: 'connect', price: 0.9, sched: 'wkev', demand: .7, on: true },
      { id: 'c3', name: ['Office car park · bay 3', 'Parking biurowy · miejsce 3'], addr: 'al. Piłsudskiego 34', city: 'rzeszow', loc: 'c', type: 3, tier: 'connect', price: 0.9, sched: 'wk', demand: .6, on: false },
      { id: 'c4', name: ['Kraków office · garage B2', 'Biuro Kraków · garaż B2'], addr: 'ul. Lubicz 23', city: 'krakow', loc: 'c', type: 0, tier: 'pro', price: 2.4, sched: 'all', demand: .85, on: true },
      { id: 'c5', name: ['Kraków office · outdoor', 'Biuro Kraków · na zewnątrz'], addr: 'ul. Lubicz 23', city: 'krakow', loc: 'i', type: 4, tier: 'basic', price: 1.1, sched: 'wk', demand: .6, on: true },
      { id: 'c6', name: ['Warsaw hub · level -1', 'Hub Warszawa · poziom -1'], addr: 'ul. Prosta 51', city: 'warsaw', loc: 'i', type: 0, tier: 'pro', price: 1.3, sched: 'all', demand: .8, on: true },
      { id: 'c7', name: ['Warsaw hub · visitor bay', 'Hub Warszawa · miejsce gościnne'], addr: 'ul. Prosta 51', city: 'warsaw', loc: 'i', type: 4, tier: 'connect', price: 0.8, sched: 'wk', demand: .5, on: true }
    ] }
  };
  var SCHED = { wk: [1, 1, 1, 1, 1, 0, 0], wkev: [1, 1, 1, 1, 1, 0, 0], all: [3, 3, 3, 3, 3, 3, 3] };
  // demo spaces in the app's space format (overrides for on/off and price are kept on this phone)
  function demoList(acct) {
    var ov = S.demoOv || {};
    return DEMO[acct].spaces.map(function (w) {
      var o = ov[w.id] || {}, p = o.price || w.price;
      return { id: w.id, web: w, demo: true, type: WTYPE[w.type], address: w.addr, bay: '', city: w.city, loc: w.loc, tier: w.tier, instr: '', sched: SCHED[w.sched], schedKey: w.sched, prices: [p, Math.max(.4, Math.round(p * 5) / 10), Math.max(.4, Math.round(p * 7) / 10)], sharing: o.on != null ? o.on : w.on, paired: w.tier !== 'basic', demand: w.demand };
    });
  }
  function acctKey() { var a = S.ownAcct || 'private'; if (a === 'mine' && !S.spaces.length) a = 'private'; return a; }
  function ownerSpaces() { var a = acctKey(); return a === 'mine' ? S.spaces : demoList(a); }
  function ownerInfo() { var a = acctKey(); return a === 'mine' ? { owner: (S.user && S.user.name) || 'Ho-Park', iban: 'PL •• 4471' } : DEMO[a]; }
  function findSpace(id) { var all = S.spaces.concat(demoList('private'), demoList('company')); return all.filter(function (x) { return x.id === id; })[0]; }
  function rng(seed) {
    var h = 2166136261; for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    var a = h >>> 0;
    return function () { a = (a + 0x6D2B79F5) | 0; var q = Math.imul(a ^ (a >>> 15), 1 | a); q = (q + Math.imul(q ^ (q >>> 7), 61 | q)) ^ q; return ((q ^ (q >>> 14)) >>> 0) / 4294967296; };
  }
  function daysIn(y, m) { return new Date(y, m + 1, 0).getDate(); }
  function payDay(y, m) { return Math.min(30, daysIn(y, m)); }
  function schedKey(h) { if (h.schedKey) return h.schedKey; var s = h.sched || []; if (s.every(function (x) { return x === 3; })) return 'all'; if (s.slice(0, 5).some(function (x) { return x === 2 || x === 3; })) return 'wkev'; return 'wk'; }
  function sharedH(h, wd) { var k = schedKey(h), we = wd === 0 || wd === 6; if (we && k !== 'all') return 0; return k === 'all' ? 24 : k === 'wkev' ? 14 : 10; }
  // same generator as the web dashboard, so both show identical figures
  function dayData(h, y, m, d) {
    var date = new Date(y, m, d, 12); if (date > TODAY) return null;
    var k = schedKey(h), r = rng(h.id + y + '-' + m + '-' + d), wd = date.getDay(), we = wd === 0 || wd === 6;
    if (we && k !== 'all') return { n: 0, h: 0, g: 0 };
    var lam = (h.demand || .7) * (we ? 1.2 : k === 'wk' ? 2.2 : 3.0), n = 0, p = Math.exp(-lam), cum = p, u = r();
    while (u > cum && n < 7) { n++; p *= lam / n; cum += p; }
    var hrs = 0; for (var i = 0; i < n; i++) hrs += 1 + Math.round(r() * 8) / 2;
    return { n: n, h: hrs, g: hrs * h.prices[0] };
  }
  function sum(list, y, m, from, to) {
    var tot = { n: 0, h: 0, g: 0, days: [] };
    for (var d = 1; d <= daysIn(y, m); d++) {
      var x = null;
      if (d >= (from || 1) && d <= (to == null ? 31 : to)) list.forEach(function (h) { var q = dayData(h, y, m, d); if (q) { x = x || { n: 0, h: 0, g: 0 }; x.n += q.n; x.h += q.h; x.g += q.g; } });
      tot.days.push(x); if (x) { tot.n += x.n; tot.h += x.h; tot.g += x.g; }
    }
    tot.net = tot.g * SHARE; return tot;
  }
  function period(y, m, list) {
    list = list || ownerSpaces();
    var pm = m ? m - 1 : 11, py = m ? y : y - 1, a = sum(list, py, pm, payDay(py, pm) + 1, 31), b = sum(list, y, m, 1, payDay(y, m));
    return { n: a.n + b.n, g: a.g + b.g, net: (a.g + b.g) * SHARE, start: new Date(py, pm, payDay(py, pm) + 1), end: new Date(y, m, payDay(y, m)) };
  }
  var NAMES = ['Marek W.', 'Katarzyna P.', 'Jan K.', 'Ola S.', 'Piotr Z.', 'Ewa M.', 'Tomasz R.', 'Agnieszka L.', 'Michał D.', 'Zofia B.', 'Paweł G.', 'Natalia C.', 'Łukasz H.', 'Magda T.'];
  var REV = {
    5: [['Easy to find, the gate opened straight away. Perfect for my meeting nearby.', 'Łatwo trafić, brama otworzyła się od razu. Idealnie na spotkanie w okolicy.'], ['Clean, safe and exactly where the app said. Will book again.', 'Czysto, bezpiecznie i dokładnie tam, gdzie wskazała aplikacja. Zarezerwuję ponownie.'], ['Great price for the city centre and no circling the block.', 'Świetna cena jak na centrum i bez krążenia wokół kwartału.'], ['The owner replied quickly when I extended my booking. Thanks!', 'Właściciel szybko odpisał, gdy przedłużałem rezerwację. Dziękuję!']],
    4: [['Good spot, slightly tight for an SUV but fine.', 'Dobre miejsce, trochę ciasne dla SUV-a, ale w porządku.'], ['All good, the entrance sign could be clearer.', 'Wszystko OK, oznaczenie wjazdu mogłoby być wyraźniejsze.'], ['Convenient and quiet. Took a minute to find the bay number.', 'Wygodnie i cicho. Chwilę szukałem numeru miejsca.']],
    3: [['Okay, but the access instructions were not very clear.', 'W porządku, ale instrukcja dojazdu nie była zbyt jasna.'], ['Fine location, the driveway is a bit narrow.', 'Dobra lokalizacja, podjazd jest trochę wąski.']],
    2: [['The gate needed two tries to open.', 'Brama otworzyła się dopiero za drugim razem.']],
    1: [['Another car was parked in the bay when I arrived.', 'Gdy przyjechałem, na miejscu stał inny samochód.']]
  };
  function reviews(h) {
    var r = rng('rev' + h.id), n = 6 + Math.floor(r() * 10), out = [];
    for (var i = 0; i < n; i++) {
      var u = r(), st = u < .62 ? 5 : u < .88 ? 4 : u < .96 ? 3 : u < .99 ? 2 : 1, pool = REV[st], when = new Date(TODAY);
      when.setDate(when.getDate() - Math.floor(r() * 75) - 1);
      out.push({ id: h.id + '-' + i, h: h, who: NAMES[Math.floor(r() * NAMES.length)], st: st, txt: pool[Math.floor(r() * pool.length)], date: when });
    }
    return out;
  }
  function allRev() { var a = []; ownerSpaces().forEach(function (h) { a = a.concat(reviews(h)); }); return a.sort(function (x, y) { return y.date - x.date; }); }
  function avgSt(l) { return l.length ? l.reduce(function (a, r) { return a + r.st; }, 0) / l.length : 0; }
  function starRow(n) { var s = ''; for (var i = 1; i <= 5; i++) s += '<i class="' + (i <= Math.round(n) ? 'on' : '') + '">★</i>'; return '<span class="st5" aria-label="' + num(n, 1) + ' / 5">' + s + '</span>'; }
  function spaceName(h) { return h.web ? L(h.web.name) : t(TYPES[h.type]) + (h.bay ? ' · ' + h.bay : ''); }
  function dshort(d) { return d.toLocaleDateString(S.lang === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'short' }); }
  function monthLbl(y, m) { return new Date(y, m, 1).toLocaleDateString(S.lang === 'pl' ? 'pl-PL' : 'en-GB', { month: 'long', year: 'numeric' }); }
  function schedLbl(h) { var k = schedKey(h); return t(k === 'all' ? 's247' : k === 'wkev' ? 'sWkev' : 'sWk'); }
  function tierPill(k) { return '<span class="opill p-' + k + '">' + t({ basic: 'tBasic', connect: 'tConnect', pro: 'tPro' }[k]) + '</span>'; }
  function onPill(on) { return '<span class="opill ' + (on ? 'p-on' : 'p-off') + '">● ' + t(on ? 'sharing' : 'paused') + '</span>'; }

  function ownerDash() {
    var tabs = [['ov', 'tOv'], ['sp', 'tSp'], ['pay', 'tPay'], ['ops', 'tOps'], ['rate', 'tRate']], a = acctKey(), demo = a !== 'mine';
    var seg = '<div class="oacct"><button class="' + (a === 'private' ? 'on' : '') + '" data-x="oacct" data-v="private">' + t('acPriv') + ' · ' + DEMO.private.spaces.length + '</button><button class="' + (a === 'company' ? 'on' : '') + '" data-x="oacct" data-v="company">' + t('acComp') + ' · ' + DEMO.company.spaces.length + '</button>' +
      (S.spaces.length ? '<button class="' + (a === 'mine' ? 'on' : '') + '" data-x="oacct" data-v="mine">' + t('acMine') + ' · ' + S.spaces.length + '</button>' : '') + '</div>';
    var body = { ov: ownOverview, sp: ownSpaces, pay: ownPayouts, rate: ownRatings, ops: ownOps }[OWN.tab]();
    return '<section class="screen fade-in owner"><div class="topbar"><div class="grow"><h1>' + t('ownerT') + '</h1>' + (demo ? '<span class="demo-badge">' + t('demoBadge') + '</span>' : '') + '</div><a class="icon-btn" href="#/host/new/1" aria-label="' + t('addSpace') + '">' + ic('plus') + '</a></div>' +
      '<div class="pad" style="padding-top:0;padding-bottom:10px">' + seg + '</div>' +
      '<div class="otabs">' + tabs.map(function (x) { return '<button class="' + (OWN.tab === x[0] ? 'on' : '') + '" data-x="otab" data-v="' + x[0] + '">' + t(x[1]) + '</button>'; }).join('') + '</div>' +
      '<div class="pad" style="padding-top:8px">' + body + '<p class="small muted demo-note">' + t('simNote') + '</p></div></section>' + tabbar('host');
  }
  function ownerAfter() {
    var a = $('.otabs .on'); if (a && a.scrollIntoView) a.scrollIntoView({ inline: 'center', block: 'nearest' });
    $$('.orep-f').forEach(function (f) { var ta = $('textarea', f); ta.focus(); f.addEventListener('submit', function (e) { e.preventDefault(); if (!ta.value.trim()) return; S.replies[f.dataset.rid] = ta.value.trim(); OWN.replying = null; save(); toast(t('replied')); render(); }); });
    var q = $('#oq'); if (q) q.addEventListener('input', function () { OWN.q = q.value; var pos = q.selectionStart; render(); var n = $('#oq'); n.focus(); n.setSelectionRange(pos, pos); });
    var mc = $('#omx'); if (mc) mc.addEventListener('change', function () { OWN.mxc = mc.value; render(); });
    var rs = $('#ors'); if (rs) rs.addEventListener('change', function () { OWN.space = rs.value; render(); });
  }

  function chart(days, y, m) {
    var W = 360, H = 170, pl = 34, pr = 6, pt = 10, pb = 22, n = days.length, ty = TODAY.getFullYear(), tm = TODAY.getMonth(), td = TODAY.getDate();
    var vals = days.map(function (x) { return x ? x.g * SHARE : 0; }), max = Math.max.apply(null, vals.concat([1]));
    var step = max > 60 ? 20 : max > 30 ? 10 : max > 12 ? 5 : 2, top = Math.ceil(max / step) * step, bw = (W - pl - pr) / n, s = '<svg class="ochart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + t('dailyE') + '">';
    for (var v = 0; v <= top; v += step) { var yy = pt + (H - pt - pb) * (1 - v / top); s += '<line class="g" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yy + '" y2="' + yy + '"/><text x="' + (pl - 4) + '" y="' + (yy + 3) + '" text-anchor="end">' + v + '€</text>'; }
    var f = vals.filter(function (v, i) { return days[i]; }), avg = f.length ? f.reduce(function (a, b) { return a + b; }, 0) / f.length : 0;
    vals.forEach(function (v, i) {
      var h = (H - pt - pb) * v / top, x = pl + i * bw + bw * .18, wd = new Date(y, m, i + 1).getDay();
      if (days[i]) s += '<rect class="b' + ((wd === 0 || wd === 6) ? ' we' : '') + (y === ty && m === tm && i + 1 === td ? ' td' : '') + '" x="' + x.toFixed(1) + '" y="' + (H - pb - h).toFixed(1) + '" width="' + (bw * .64).toFixed(1) + '" height="' + Math.max(h, v > 0 ? 1.5 : 0).toFixed(1) + '" rx="1.5"/>';
      if ((i + 1) % 5 === 0 || i === 0) s += '<text x="' + (pl + i * bw + bw / 2).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + (i + 1) + '</text>';
    });
    var ay = pt + (H - pt - pb) * (1 - avg / top);
    return s + '<line class="avg" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + ay.toFixed(1) + '" y2="' + ay.toFixed(1) + '"/><text class="avgt" x="' + (W - pr) + '" y="' + (ay - 4).toFixed(1) + '" text-anchor="end">' + t('avgDay') + ' ' + money(avg) + '</text></svg>';
  }

  function ownOverview() {
    var list = ownerSpaces(), info = ownerInfo(), y = TODAY.getFullYear(), m = TODAY.getMonth(), d = TODAY.getDate(), cur = sum(list, y, m, 1, d);
    var pm = m ? m - 1 : 11, py = m ? y : y - 1, prev = sum(list, py, pm, 1, Math.min(d, daysIn(py, pm)));
    var ch = prev.net ? Math.round((cur.net / prev.net - 1) * 100) : 0, pd = payDay(y, m), per = period(y, m), left = pd - d, revs = allRev();
    var shared = 0; list.forEach(function (h) { if (h.sharing) for (var k = 1; k <= d; k++) shared += sharedH(h, new Date(y, m, k).getDay()); });
    var occ = shared ? Math.min(100, cur.h / shared * 100) : 0;
    var top = list.map(function (h) { return { h: h, s: sum([h], y, m, 1, d) }; }).sort(function (a, b) { return b.s.net - a.s.net; });
    var recent = []; list.forEach(function (h) { for (var k = d; k >= Math.max(1, d - 6); k--) { var x = dayData(h, y, m, k); if (x && x.n) recent.push({ h: h, d: k, x: x }); } });
    recent.sort(function (p, q) { return q.d - p.d || q.x.g - p.x.g; });
    return '<h2 class="hello">' + t('hello').replace('{n}', esc(acctKey() === 'company' ? info.owner : info.owner.split(' ')[0])) + '</h2><p class="small muted" style="margin:2px 0 12px">' + monthLbl(y, m) + ' · ' + list.length + ' ' + t('spacesL') + '</p>' +
      '<div class="okpi">' +
      '<div class="ok-hero"><small>' + t('earnedM') + '</small><b>' + money(cur.net) + '</b><span>' + (ch >= 0 ? '▲ ' : '▼ ') + Math.abs(ch) + '% ' + t('vsLast') + '</span></div>' +
      '<div><small>' + t('timesUsed') + '</small><b>' + cur.n + '</b><em>' + t('bkMonth') + '</em></div><div><small>' + t('hoursB') + '</small><b>' + num(cur.h) + ' h</b><em>' + t('avgPer').replace('{x}', num(cur.n ? cur.h / cur.n : 0, 1)) + '</em></div>' +
      '<div><small>' + t('occ') + '</small><b>' + num(occ) + '%</b><em>' + t('occSub') + '</em></div><div><small>' + t('avgRating') + '</small><b>' + num(avgSt(revs), 1) + ' ★</b><em>' + revs.length + ' ' + t('reviews') + '</em></div>' +
      '<button class="ok-pay" data-x="otab" data-v="pay"><small>' + t('nextPay') + '</small><b>' + money(per.net, 0) + '</b><span>★ ' + dshort(new Date(y, m, pd)) + ' · ' + (left <= 0 ? t('payToday') : left === 1 ? t('payTomorrow') : t('payIn').replace('{d}', left)) + '</span></button></div>' +
      '<div class="dash-card"><div class="box-h"><b style="flex:1">' + t('dailyE') + '</b><span class="small muted">' + t('afterFee') + '</span></div>' + chart(cur.days, y, m) + '</div>' +
      '<h3 class="sec-t">' + t('bestSp') + '</h3>' + top.slice(0, 4).map(function (x) { return spaceRow(x.h, x.s); }).join('') +
      '<h3 class="sec-t">' + t('recentBk') + '</h3><div class="olist">' + recent.slice(0, 6).map(function (r) { return '<div class="orow"><span class="grow"><b>' + esc(spaceName(r.h)) + '</b><small>' + new Date(y, m, r.d).toLocaleDateString(S.lang === 'pl' ? 'pl-PL' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + r.x.n + '× · ' + num(r.x.h, 1) + ' h</small></span><b>+' + money(r.x.g * SHARE) + '</b></div>'; }).join('') + '</div>' +
      '<h3 class="sec-t">' + t('latestRev') + '</h3>' + revs.slice(0, 3).map(revHtml).join('');
  }
  function spaceRow(h, s) {
    return '<a class="ospace" href="#/host/space/' + h.id + '"><span class="thumb">' + thumb(asSpot(h, 0), 'o' + h.id) + '</span><span class="grow"><b>' + esc(spaceName(h)) + '</b><small>' + esc(cityName(h.city)) + ' · ' + s.n + '× · ' + num(s.h) + ' h</small>' + onPill(h.sharing) + '</span><span class="r"><b>' + money(s.net) + '</b>' + ic('chev') + '</span></a>';
  }
  function ownSpaces() {
    var all = ownerSpaces(), y = TODAY.getFullYear(), m = TODAY.getMonth(), d = TODAY.getDate();
    var list = all.filter(function (h) { return (OWN.spf === 'all' || (OWN.spf === 'on' ? h.sharing : !h.sharing)) && (!OWN.q || (spaceName(h) + ' ' + h.address + ' ' + cityName(h.city)).toLowerCase().indexOf(OWN.q.toLowerCase()) >= 0); });
    var chip = function (k, lbl, n) { return '<button class="chip' + (OWN.spf === k ? ' on' : '') + '" data-x="ospf" data-v="' + k + '">' + lbl + ' · ' + n + '</button>'; };
    return '<div class="chips" style="padding:0;flex-wrap:wrap;margin-bottom:8px">' + chip('all', t('allR'), all.length) + chip('on', t('sharing'), all.filter(function (h) { return h.sharing; }).length) + chip('off', t('paused'), all.filter(function (h) { return !h.sharing; }).length) + '</div>' +
      '<input class="input" id="oq" type="search" placeholder="' + t('searchSp') + '" value="' + esc(OWN.q) + '" style="margin-bottom:12px">' +
      (list.length ? list.map(function (h) {
        var s = sum([h], y, m, 1, d), rv = reviews(h);
        return '<div class="ocard"><a class="ocard-h" href="#/host/space/' + h.id + '"><span class="thumb">' + thumb(asSpot(h, 0), 'c' + h.id) + '</span><span class="grow"><b>' + esc(spaceName(h)) + '</b><small>' + esc(h.address) + ', ' + esc(cityName(h.city)) + ' · ' + t('loc' + h.loc) + '</small></span><span class="oprice">' + money(h.prices[0]) + '<small>' + t('perHour') + '</small></span></a>' +
          '<div class="opills">' + onPill(h.sharing) + tierPill(h.tier) + '<span class="opill">' + t(TYPES[h.type]) + '</span><span class="opill">' + schedLbl(h) + '</span></div>' +
          '<div class="ostats"><div><small>' + t('bookingsN') + '</small><b>' + s.n + '</b></div><div><small>' + t('hoursS') + '</small><b>' + num(s.h) + '</b></div><div><small>' + t('earnS') + '</small><b>' + money(s.net, 0) + '</b></div><div><small>' + t('rating') + '</small><b>' + num(avgSt(rv), 1) + '★</b></div></div>' +
          '<button class="otgl' + (h.sharing ? ' on' : '') + '" data-x="share" data-v="' + h.id + '"><span class="tgl' + (h.sharing ? ' on' : '') + '"></span>' + t(h.sharing ? 'sharing' : 'paused') + '</button></div>';
      }).join('') : '<p class="muted">' + t('noMatch') + '</p>') +
      '<a class="btn btn-primary" href="#/host/new/1" style="margin-top:6px">' + ic('plus') + t('addSpace') + '</a>';
  }
  function ownPayouts() {
    var list = ownerSpaces(), info = ownerInfo(), y = OWN.y, m = OWN.m, ty = TODAY.getFullYear(), tm = TODAY.getMonth(), td = TODAY.getDate();
    var isCur = y === ty && m === tm, fut = y > ty || (y === ty && m > tm), mm = sum(list, y, m, 1, isCur ? td : fut ? 0 : 31), pd = payDay(y, m), per = period(y, m, list);
    var dows = S.lang === 'pl' ? ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    var cells = dows.map(function (x) { return '<span class="cdow">' + x + '</span>'; }).join('');
    for (var i = 0; i < (new Date(y, m, 1).getDay() + 6) % 7; i++) cells += '<span class="cday blank"></span>';
    for (var d = 1; d <= daysIn(y, m); d++) {
      var x = mm.days[d - 1], pay = d === pd, today = isCur && d === td, dots = '';
      if (x) for (var k = 0; k < Math.min(x.n, 6); k++) dots += '<i></i>';
      cells += '<span class="cday' + (pay ? ' pay' : '') + (today ? ' today' : '') + (x ? '' : ' fut') + '"><b>' + d + '</b>' + (pay ? '<em>★ ' + t('payout') + '</em>' : '') + '<small>' + (x && x.g ? Math.round(x.g * SHARE) + '€' : x ? '–' : '') + '</small><span class="cdots">' + dots + '</span></span>';
    }
    var status = fut ? t('scheduled') : isCur ? (td === pd ? t('sendToday') : td < pd ? t('scheduled') : t('paid')) : t('paid');
    var hist = ''; for (var k2 = 1; k2 <= 6; k2++) { var hm = tm - k2, hy = ty; while (hm < 0) { hm += 12; hy--; } var pp = period(hy, hm, list); hist += '<div class="orow"><span class="grow"><b style="text-transform:capitalize">' + monthLbl(hy, hm) + '</b><small>' + dshort(new Date(hy, hm, payDay(hy, hm))) + ' · ' + pp.n + ' ' + t('bkShort') + '</small></span><b>' + money(pp.net) + '</b><span class="opill p-on">' + t('paid') + '</span></div>'; }
    return '<div class="cal-h"><button class="icon-btn" data-x="ocal" data-v="-1" aria-label="Previous">' + ic('back') + '</button><button class="link" data-x="ocal" data-v="0"><b>' + monthLbl(y, m) + '</b></button><button class="icon-btn" data-x="ocal" data-v="1" aria-label="Next">' + ic('chev') + '</button></div>' +
      '<div class="ocal">' + cells + '</div>' +
      '<div class="olegend"><span><i class="lg-e"></i>' + t('lgEarn') + '</span><span><i class="lg-d"></i>' + t('lgBk') + '</span><span><i class="lg-t"></i>' + t('today') + '</span><span><i class="lg-p"></i>★ ' + t('payout') + '</span></div>' +
      '<p class="small muted" style="margin:8px 0 14px">' + t('payRule') + '</p>' +
      '<div class="pay-box"><div class="box-h"><span class="pc-star">★</span><b style="flex:1">' + t('payout') + ' · ' + dshort(new Date(y, m, pd)) + '</b><span class="opill ' + (status === t('paid') ? 'p-on' : 'p-warn') + '">' + status + '</span></div>' +
      '<b class="pay-big">' + money(per.net) + '</b><p class="small muted" style="margin:-4px 0 6px">' + per.n + ' ' + t('bkShort') + '</p>' +
      '<div class="review-row"><span>' + t('period') + '</span><b>' + dshort(per.start) + ' – ' + dshort(per.end) + '</b></div><div class="review-row"><span>' + t('grossL') + '</span><b>' + money(per.g) + '</b></div>' +
      '<div class="review-row"><span>' + t('feeL') + '</span><b>− ' + money(per.g - per.net) + '</b></div><div class="review-row"><span><b>' + t('netL') + '</b></span><b class="up">' + money(per.net) + '</b></div><div class="review-row"><span>' + t('bank') + '</span><b>' + info.iban + '</b></div></div>' +
      '<h3 class="sec-t">' + t('payHist') + '</h3><div class="olist">' + hist + '</div>';
  }
  function revHtml(r) {
    var rep = S.replies[r.id];
    return '<div class="orev"><div class="orev-h"><span class="avatar">' + initials(r.who) + '</span><span class="grow"><b>' + esc(r.who) + '</b><small>' + esc(spaceName(r.h)) + ' · ' + dshort(r.date) + '</small></span>' + starRow(r.st) + '</div><p>' + esc(L(r.txt)) + '</p>' +
      (rep ? '<div class="orep"><b>' + t('yourReply') + '</b>' + esc(rep) + '</div>' : OWN.replying === r.id ? '<form class="orep-f" data-rid="' + r.id + '"><textarea class="input" rows="3" placeholder="' + t('replyPh') + '"></textarea><div class="row-btns"><button type="button" class="btn btn-outline btn-sm" data-x="ocancel">' + t('cancel') + '</button><button class="btn btn-primary btn-sm" type="submit">' + t('sendReply') + '</button></div></form>' : '<button class="link" data-x="oreply" data-v="' + r.id + '">' + ic('chat') + ' ' + t('reply') + '</button>') + '</div>';
  }
  function ownRatings() {
    var spaces = ownerSpaces(), all = allRev(), base = all.filter(function (r) { return !OWN.space || r.h.id === OWN.space; }), list = base.filter(function (r) { return !OWN.stars || r.st === OWN.stars; }), avg = avgSt(base);
    var dist = [5, 4, 3, 2, 1].map(function (n) { var c = base.filter(function (r) { return r.st === n; }).length; return '<div class="drow5"><span>' + n + '★</span><span class="dbar"><i style="width:' + (base.length ? c / base.length * 100 : 0) + '%"></i></span><span>' + c + '</span></div>'; }).join('');
    var per = spaces.map(function (h) { var rv = reviews(h); return '<div class="orow"><span class="grow"><b>' + esc(spaceName(h)) + '</b><small>' + rv.length + ' ' + t('reviews') + '</small></span>' + starRow(avgSt(rv)) + '<b>' + num(avgSt(rv), 1) + '</b></div>'; }).join('');
    return '<div class="rate-top"><div class="rate-avg"><b>' + num(avg, 1) + '</b>' + starRow(avg) + '<small>' + base.length + ' ' + t('reviews') + '</small></div><div class="grow">' + dist + '</div></div>' +
      '<h3 class="sec-t">' + t('perSpace') + '</h3><div class="olist">' + per + '</div>' +
      '<select class="input" id="ors" style="margin:14px 0 8px"><option value="">' + t('allSpaces') + '</option>' + spaces.map(function (h) { return '<option value="' + h.id + '"' + (OWN.space === h.id ? ' selected' : '') + '>' + esc(spaceName(h)) + '</option>'; }).join('') + '</select>' +
      '<div class="chips" style="padding:0;margin:0 0 6px;flex-wrap:wrap">' + [0, 5, 4, 3, 2, 1].map(function (n) { return '<button class="chip' + (OWN.stars === n ? ' on' : '') + '" data-x="ostars" data-v="' + n + '">' + (n ? n + ' ★' : t('allR')) + '</button>'; }).join('') + '</div>' +
      (list.length ? list.map(revHtml).join('') : '<p class="muted">' + t('noRev') + '</p>');
  }
  function ownOps() {
    var list = ownerSpaces(), y = TODAY.getFullYear(), m = TODAY.getMonth(), d = TODAY.getDate(), out = '', ideas = [];
    list.forEach(function (h) {
      var c = cityOf(h.city), pub = D.publicEur(c, h.loc), sug = D.suggest(c, h.loc), avg = Math.round(sug * 1.08 * 10) / 10, p = h.prices[0];
      var dl = p / avg - 1, pos = dl < -.1 ? 'low' : dl > .1 ? 'high' : 'ok', s = sum([h], y, m, 1, d), full = s.h / d * daysIn(y, m);
      var impact = (full * (1 - 1.2 * (sug / p - 1)) * sug - full * p) * SHARE, k = schedKey(h);
      out += '<div class="dash-card"><div class="box-h"><b style="flex:1">' + esc(spaceName(h)) + '</b><span class="pr-d ' + pos + '">' + t(pos === 'low' ? 'below' : pos === 'high' ? 'above' : 'around') + (pos === 'ok' ? '' : ' ' + (dl > 0 ? '+' : '−') + Math.round(Math.abs(dl) * 100) + '%') + '</span></div><p class="small muted" style="margin:-4px 0 8px">' + esc(cityName(h.city)) + ' · ' + t('loc' + h.loc) + '</p>' +
        '<div class="ops4"><div><small>' + t('pubP') + '</small><b>' + money(pub) + '</b></div><div><small>' + t('sugP') + '</small><b>' + money(sug) + '</b></div><div><small>' + t('areaA') + '</small><b>' + money(avg) + '</b></div><div><small>' + t('yourP') + '</small><b>' + money(p) + '</b></div></div>' +
        (Math.abs(p - sug) > .049 ? '<div class="ops-f"><span class="' + (impact >= 0 ? 'up' : 'down') + '">' + (impact >= 0 ? '+' : '−') + money(Math.abs(impact), 0) + ' ' + t('perMo') + '*</span><button class="btn btn-outline btn-sm" data-x="useSug" data-v="' + h.id + '">' + t('useSug') + ' ' + money(sug) + '</button></div>' : '') + '</div>';
      if (h.sharing && k === 'wk') ideas.push({ k: 'idEve', g: 22 * 4 * .12 * (h.demand || .7) * p * .7 * SHARE, s: h });
      if (h.sharing && k !== 'all') ideas.push({ k: 'idWe', g: 8.7 * 10 * .4 * .35 * (h.demand || .7) * p * SHARE, s: h });
      if (h.tier === 'basic') ideas.push({ k: 'idGate', g: full * .15 * p * SHARE, s: h });
      if (pos === 'high') ideas.push({ k: 'idPrice', g: Math.max(0, impact), s: h });
      if (!h.sharing) ideas.push({ k: 'idOn', g: full * p * SHARE || 15, s: h });
    });
    ideas = ideas.filter(function (x) { return x.g >= 1; }).sort(function (a, b) { return b.g - a.g; }).slice(0, 5);
    var mine = {}; list.forEach(function (h) { mine[h.city] = 1; });
    var nm = function (c) { return S.lang === 'pl' ? c.pl : c.en; };
    var ccs = Object.keys(D.countries).sort(function (a, b) { return D.countries[a][S.lang === 'pl' ? 1 : 0].localeCompare(D.countries[b][S.lang === 'pl' ? 1 : 0]); });
    var mx = D.list.filter(function (c) { return !OWN.mxc || c.cc === OWN.mxc; }).sort(function (a, b) { return (mine[b.id] ? 1 : 0) - (mine[a.id] ? 1 : 0) || a.st - b.st || nm(a).localeCompare(nm(b)); });
    return '<h3 class="sec-t" style="margin-top:4px">' + t('yourVsMkt') + '</h3>' + out +
      '<h3 class="sec-t">' + t('ideas') + '</h3>' + (ideas.length ? ideas.map(function (x) { return '<div class="idea">' + ic('bolt') + '<span class="grow"><b>' + t(x.k) + '</b><small>' + esc(spaceName(x.s)) + ' · ' + esc(cityName(x.s.city)) + '</small></span><b class="up">+' + money(x.g, 0) + '</b></div>'; }).join('') : '<p class="muted small">' + t('noIdeas') + '</p>') +
      '<h3 class="sec-t">' + t('mxT') + '</h3><select class="input" id="omx" style="margin-bottom:8px"><option value="">' + t('allCountries') + '</option>' + ccs.map(function (cc) { return '<option value="' + cc + '"' + (OWN.mxc === cc ? ' selected' : '') + '>' + D.countries[cc][S.lang === 'pl' ? 1 : 0] + '</option>'; }).join('') + '</select>' +
      '<div class="mxl"><div class="mxr mxh"><span class="grow">' + t('city') + '</span><span>' + t('pubP') + '</span><span>' + t('sugP') + '</span></div>' + mx.map(function (c) { var h = D.hours(c, 'c', ['wk']), e = D.earn(c, 'c', ['wk'], null, h); return '<div class="mxr' + (mine[c.id] ? ' mine' : '') + '"><span class="grow"><b>' + esc(nm(c)) + '</b><small>' + t('stage') + ' ' + c.st + ' · ≈ ' + money(e.net, 0) + ' ' + t('perMo') + '*</small></span><span>' + money(D.publicEur(c, 'c')) + '</span><b>' + money(D.suggest(c, 'c')) + '</b></div>'; }).join('') + '</div>' +
      '<p class="small muted" style="margin-top:8px">' + t('opsNote') + '</p><a class="btn btn-outline" href="#/host/start" style="margin-top:12px">' + ic('tag') + t('simLink') + '</a>';
  }

  function spaceDetail(id) {
    var h = findSpace(id), sp = asSpot(h, 0), y = TODAY.getFullYear(), m = TODAY.getMonth(), d = TODAY.getDate(), s = sum([h], y, m, 1, d), rv = reviews(h);
    var tierName = t({ basic: 'tBasic', connect: 'tConnect', pro: 'tPro' }[h.tier]), own = !h.demo;
    var dev = h.tier === 'basic' ? '' : (h.paired ? '<p class="dev-status"><i></i>' + t('devOnline') + '</p>' : '<p class="dev-status off"><i></i>' + t('devPair') + '</p><a class="btn btn-primary btn-sm" href="#/host/device/' + h.id + '" style="margin-top:10px">' + ic('qr') + t('pairDev') + '</a>');
    var recent = []; for (var k = d; k >= 1 && recent.length < 4; k--) { var x = dayData(h, y, m, k); if (x && x.n) recent.push({ d: k, x: x }); }
    var plates = ['RZ 4K21', 'KR 123AB', 'WA 77TP', 'RZE 5512', 'KR 9ME01'];
    var edit = function (step) { return own ? '<button class="link" data-x="editSpace" data-v="' + h.id + '" data-step="' + step + '">' + t('edit') + '</button>' : ''; };
    return '<section class="screen fade-in"><div class="topbar"><a class="icon-btn" href="#/host">' + ic('back') + '</a><h1>' + esc(spaceName(h)) + '</h1>' + (own ? '<button class="icon-btn" data-x="editSpace" data-v="' + h.id + '" data-step="1" aria-label="' + t('edit') + '">' + ic('gear') + '</button>' : '<span class="demo-badge">' + t('demo') + '</span>') + '</div><div class="pad" style="padding-top:4px">' +
      '<div class="spot-row" style="margin-bottom:14px"><span class="thumb">' + thumb(sp, 'sd') + '</span><span class="sr-info"><b>' + esc(spaceName(h)) + '</b><span class="meta">' + esc(h.address + ', ' + cityName(h.city)) + '</span>' + accBadge(h.tier) + '</span></div>' +
      '<button class="switch-card' + (h.sharing ? ' on' : '') + '" data-x="share" data-v="' + h.id + '"><span class="ic-round">' + ic('power') + '</span><span style="flex:1"><b>' + t(h.sharing ? 'sharing' : 'notSharing') + '</b><small>' + t(h.sharing ? 'sharingD' : 'notSharingD') + '</small></span><span class="tgl"></span></button>' +
      '<div class="ostats" style="margin:14px 0 12px"><div><small>' + t('earnS') + '</small><b>' + money(s.net, 0) + '</b></div><div><small>' + t('bookingsN') + '</small><b>' + s.n + '</b></div><div><small>' + t('hoursS') + '</small><b>' + num(s.h) + '</b></div><div><small>' + t('rating') + '</small><b>' + num(avgSt(rv), 1) + '★</b></div></div>' +
      '<div class="dash-card"><div class="box-h"><span class="ic-round">' + ic(ACC[h.tier].ic) + '</span><b style="flex:1">' + t('accMethod') + '</b>' + edit(2) + '</div><p style="font-weight:600">' + tierName + '</p>' + dev + '</div>' +
      '<div class="dash-card"><div class="box-h"><span class="ic-round">' + ic('tag') + '</span><b style="flex:1">' + t('price') + '</b>' + edit(4) + '</div><p>' + money(h.prices[0]) + ' ' + t('perHour') + ' · ' + schedLbl(h) + '</p></div>' +
      '<div class="dash-card"><b style="font-family:var(--fh)">' + t('bkYour') + '</b>' + (recent.length ? recent.map(function (r, i) { return '<div class="bk-item" style="margin-top:8px"><span class="plate">' + plates[(i * 2 + r.d) % plates.length] + '</span><span style="flex:1">' + dshort(new Date(y, m, r.d)) + ' · ' + r.x.n + '× · ' + num(r.x.h, 1) + ' h</span><b>+' + money(r.x.g * SHARE) + '</b></div>'; }).join('') : '<p class="small muted" style="margin-top:6px">' + t('noBkYet') + '</p>') + '</div>' +
      '<h3 class="sec-t">' + t('latestRev') + '</h3>' + rv.sort(function (a, b) { return b.date - a.date; }).slice(0, 3).map(revHtml).join('') +
      (own ? '<button class="btn btn-ghost" data-x="delSpace" data-v="' + h.id + '" style="color:var(--red)">' + t('delBtn') + '</button>' : '') +
      '</div></section>' + tabbar('host');
  }
  function devicePair(id) {
    var h = findSpace(id) || S.spaces[0] || {}, pro = h.tier === 'pro';
    return '<section class="screen fade-in"><div class="topbar"><a class="icon-btn" href="' + (h.id ? '#/host/space/' + h.id : '#/host') + '">' + ic('back') + '</a><h1>' + t('pairT') + '</h1></div><div class="pad">' +
      '<div class="dev-hero">' + deviceArt() + '</div>' +
      '<div class="hl-list">' +
      '<div class="hl-item"><span class="ic-round">1</span><div><b>' + t('pair1') + '</b><small>' + t(pro ? 'pair1p' : 'pair1c') + '</small></div></div>' +
      '<div class="hl-item"><span class="ic-round">2</span><div><b>' + t('pair2') + '</b><small>' + t('pair2d') + '</small></div></div>' +
      '<div class="hl-item"><span class="ic-round">3</span><div><b>' + t('pair3') + '</b><small>' + t('pair3d') + '</small></div></div></div>' +
      '<button class="btn btn-primary" data-x="pairScan" data-v="' + (h.id || '') + '">' + ic('camera') + t('scanPair') + '</button><a class="btn btn-ghost" href="' + (h.id ? '#/host/space/' + h.id : '#/host') + '">' + t('later') + '</a></div></section>';
  }

  /* ---------- city picker (57 EU cities) ---------- */
  function citySheet(cur, onPick) {
    var nm = function (c) { return S.lang === 'pl' ? c.pl : c.en; };
    var list = D.list.slice().sort(function (a, b) { return a.st - b.st || nm(a).localeCompare(nm(b)); });
    var html = function (q) {
      q = (q || '').toLowerCase();
      return list.filter(function (c) { return !q || (nm(c) + ' ' + c.en + ' ' + D.countries[c.cc].join(' ')).toLowerCase().indexOf(q) >= 0; }).map(function (c) {
        return '<button class="mrow' + (c.id === cur ? ' on' : '') + '" data-city="' + c.id + '">' + ic('pin') + '<span class="grow"><b>' + esc(nm(c)) + '</b><small>' + esc(D.countries[c.cc][S.lang === 'pl' ? 1 : 0]) + ' · ' + t('stage') + ' ' + c.st + '</small></span>' + (c.id === cur ? ic('check') : '') + '</button>';
      }).join('') || '<p class="muted small">' + t('noCity') + '</p>';
    };
    sheet('<h2>' + t('chooseCity') + '</h2><input class="input" id="cityQ" placeholder="' + t('cityPh') + '" autocomplete="off" style="margin-bottom:10px"><div class="menu city-list" id="cityL">' + html('') + '</div>', function (sh) {
      var q = $('#cityQ', sh), l = $('#cityL', sh);
      q.addEventListener('input', function () { l.innerHTML = html(q.value); });
      l.addEventListener('click', function (e) { var b = e.target.closest('[data-city]'); if (!b) return; closeSheet(); onPick(b.dataset.city); });
    });
  }

  /* ---------- earnings simulator (Share landing) ---------- */
  var SIM = { city: null, loc: 'c' };
  function simCard() {
    if (!D) return '';
    SIM.city = SIM.city || S.city;
    return '<div class="sim-card"><b class="sim-t">' + ic('chart') + t('simT') + '</b>' +
      '<button class="input city-btn" data-x="simCity">' + ic('pin') + '<b id="simCityN">' + esc(cityName(SIM.city)) + '</b>' + ic('chev') + '</button>' +
      '<div class="seg" style="margin:10px 0">' + ['c', 'i', 'o'].map(function (k) { return '<button class="' + (SIM.loc === k ? 'on' : '') + '" data-x="simLoc" data-v="' + k + '">' + t('loc' + k) + '</button>'; }).join('') + '</div>' +
      '<div class="sim-res"><div><small>' + t('sugP') + '</small><b id="simP"></b></div><div><small>' + t('hoursB') + '</small><b id="simH"></b></div><div class="big"><small>' + t('perMoEst') + '*</small><b id="simE"></b></div></div>' +
      '<p class="small muted" style="margin-top:8px">' + t('simLegal') + '</p></div>';
  }
  function simAfter() {
    if (!D || !$('#simE')) return;
    var c = cityOf(SIM.city), h = D.hours(c, SIM.loc, ['wk']), e = D.earn(c, SIM.loc, ['wk'], null, h);
    $('#simP').textContent = money(D.suggest(c, SIM.loc)) + t('perHour'); $('#simH').textContent = h + ' h'; $('#simE').textContent = money(e.net, 0);
  }

  /* ---------- Messages ---------- */
  VIEWS.messages = function () {
    var th = function (id, name, av, last, time) { return '<a class="thread" href="#/chat/' + id + '"><span class="avatar"' + (av === 'HP' ? ' style="background:var(--navy-800)"' : '') + '>' + av + '</span><span class="grow"><b>' + name + '</b><p>' + last + '</p></span><time>' + time + '</time></a>'; };
    var lastOf = function (id) { var c = S.chats[id]; var m = c[c.length - 1]; return esc(m.k ? t(m.k) : m.text); };
    return '<section class="screen fade-in"><div class="topbar"><h1>' + t('tMessages') + '</h1></div>' +
      th('anna', 'Anna · ' + t('host'), 'A', lastOf('anna'), '09:50') + th('team', t('team'), 'HP', lastOf('team'), '08:00') +
      '</section>' + tabbar('messages');
  };
  VIEWS.chat = function (id) {
    id = S.chats[id] ? id : 'anna';
    var name = id === 'anna' ? 'Anna · ' + t('host') : t('team');
    return '<section class="screen fade-in"><div class="topbar"><a class="icon-btn" href="#/messages">' + ic('back') + '</a><h1>' + name + '</h1></div><div class="chat" id="chat">' +
      S.chats[id].map(function (m) { return '<div class="msg ' + (m.me ? 'me' : 'them') + '">' + esc(m.k ? t(m.k) : m.text) + '</div>'; }).join('') +
      '</div></section><form class="chat-input" id="chatForm" data-id="' + id + '"><input id="chatIn" placeholder="' + t('typeMsg') + '" autocomplete="off"><button type="submit" aria-label="Send">' + ic('send') + '</button></form>';
  };
  VIEWS.chat.after = function () {
    $('#chatForm').addEventListener('submit', function (e) {
      e.preventDefault(); var v = $('#chatIn').value.trim(); if (!v) return;
      var id = e.target.dataset.id; S.chats[id].push({ me: 1, text: v }); save(); render();
      setTimeout(function () { if (location.hash.indexOf('/chat/' + id) < 0) return; S.chats[id].push({ me: 0, text: S.lang === 'pl' ? 'Dzięki, odpiszę za chwilę!' : 'Thanks, I’ll reply shortly!' }); save(); render(); }, 1400);
    });
  };

  /* ---------- Profile & earnings ---------- */
  VIEWS.profile = function () {
    var u = S.user || { name: 'Ho-Park' }, isHost = true, OS = ownerSpaces();
    var row = function (icn, k, extra, act, href) { return (href ? '<a class="mrow" href="' + href + '"' + (href.indexOf('http') === 0 || href.indexOf(SITE) === 0 ? ' target="_top"' : '') + '>' : '<button class="mrow" data-x="' + act + '">') + ic(icn) + '<span class="grow">' + t(k) + '</span>' + (extra || '') + ic('chev') + (href ? '</a>' : '</button>'); };
    var earn = '';
    if (isHost) {
      var y = TODAY.getFullYear(), m = TODAY.getMonth(), d = TODAY.getDate(), cur = sum(OS, y, m, 1, d), wk = [0, 0, 0, 0];
      for (var k = 0; k < 28; k++) { var dt = new Date(TODAY); dt.setDate(dt.getDate() - k); OS.forEach(function (h) { var x = dayData(h, dt.getFullYear(), dt.getMonth(), dt.getDate()); if (x) wk[3 - Math.floor(k / 7)] += x.g * SHARE; }); }
      var max = Math.max.apply(null, wk.concat([1]));
      earn = '<div class="earn-card"><div class="earn-top"><div><small>' + t('earnedM') + '</small><b>' + money(cur.net) + '</b></div><span class="host-badge" style="background:var(--soft);color:var(--ink2)">' + t('last4w') + '</span></div>' +
        '<div class="bars">' + wk.map(function (v, i) { return '<div><i style="height:' + Math.max(6, v / max * 100) + '%"></i><span>' + t('week') + (i + 1) + '</span></div>'; }).join('') + '</div>' +
        '<button class="btn btn-primary" data-x="toPay" style="margin-top:12px">★ ' + t('nextPay') + ' · ' + dshort(new Date(y, m, payDay(y, m))) + '</button></div>';
    }
    var revs = isHost ? allRev() : [];
    return '<section class="screen fade-in"><div class="topbar"><span style="flex:1"></span><a class="icon-btn" href="#/settings">' + ic('gear') + '</a></div>' +
      '<div class="prof-head"><span class="avatar lg">' + initials(u.name) + '</span><div><h1>' + esc(u.name) + '</h1>' + (isHost ? '<span class="host-badge">' + ic('share') + t('host') + '</span>' : '') + '<p class="small muted">' + esc(cityName(S.city)) + '</p></div></div>' +
      '<div class="stats3"><div><b>' + S.history.length + '</b><small>' + t('bookingsN') + '</small></div><div><b>' + (revs.length ? num(avgSt(revs), 1) : '–') + '</b><small>' + t('rating') + '</small></div><div><span class="ok">' + (S.verified ? ic('check') : ic('shield')) + '</span><small>' + t(S.verified ? 'verified' : 'notVerified') + '</small></div></div>' +
      earn +
      '<div class="menu">' + row('share', 'mySpaces', '<em>' + OS.length + '</em>', null, '#/host') + row('bank', 'payout', '<em>•• 4471</em>', 'payout') +
      row('doc', 'docs', '<em class="' + (S.verified ? 'ok' : '') + '">' + t(S.verified ? 'verified' : 'notVerified') + '</em>', 'verify') + row('help', 'help', '', null, SITE + 'index.html#contact') + row('gear', 'theme', '<em>' + t('th' + THEME[0].toUpperCase() + THEME.slice(1)) + '</em>', null, '#/settings') + row('gear', 'settings', '', null, '#/settings') + '</div></section>' + tabbar('profile');
  };
  VIEWS.settings = function () {
    return '<section class="screen fade-in"><div class="topbar"><a class="icon-btn" href="#/profile">' + ic('back') + '</a><h1>' + t('settings') + '</h1></div><div class="pad">' +
      '<h3 class="sec-t" style="margin-top:4px">' + t('language') + '</h3><div class="seg"><button class="' + (S.lang === 'en' ? 'on' : '') + '" data-x="lang" data-v="en">English</button><button class="' + (S.lang === 'pl' ? 'on' : '') + '" data-x="lang" data-v="pl">Polski</button></div>' +
      '<h3 class="sec-t">' + t('theme') + '</h3><div class="themes">' + Object.keys(THEMES).map(function (k) { var n = k[0].toUpperCase() + k.slice(1), w = THEMES[k].sw;
        return '<button class="th-card' + (THEME === k ? ' on' : '') + '" data-x="theme" data-v="' + k + '" aria-pressed="' + (THEME === k) + '"><span class="th-prev" style="background:' + w[0] + '"><i style="background:' + w[1] + '"></i><i style="background:' + w[2] + '"></i><em style="background:' + w[1] + '"></em></span><b>' + t('th' + n) + '</b><small>' + t('th' + n + 'D') + '</small>' + (THEME === k ? '<span class="th-ok">' + ic('check') + '</span>' : '') + '</button>'; }).join('') + '</div><p class="small muted" style="margin:6px 2px 0">' + t('themeD') + '</p>' +
      '<div class="menu" style="margin:16px 0">' +
      '<button class="mrow' + (S.notif ? ' on' : '') + '" data-x="notif">' + ic('bell') + '<span class="grow">' + t('notif') + '</span><span class="tgl' + (S.notif ? ' on' : '') + '"></span></button>' +
      '<button class="mrow" data-x="install">' + ic('sharei') + '<span class="grow">' + t('install') + '</span>' + ic('chev') + '</button>' +
      '<a class="mrow" href="' + SITE + 'index.html" target="_top">' + ic('globe') + '<span class="grow">' + t('website') + '</span>' + ic('ext') + '</a>' +
      '<button class="mrow" data-x="reset">' + ic('power') + '<span class="grow">' + t('reset') + '</span>' + ic('chev') + '</button>' +
      '<button class="mrow" data-x="logout">' + ic('user') + '<span class="grow">' + t('logout') + '</span>' + ic('chev') + '</button></div>' +
      '<p class="small muted" style="text-align:center">Ho-Park · ' + t('version') + ' ' + VERSION + '</p></div></section>';
  };

  /* =====================================================================
     Illustrations
     ===================================================================== */
  function skyline() {
    var b = '', x = 0, seed = 7;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    while (x < 400) { var w = 18 + rnd() * 30, h = 40 + rnd() * 110; b += '<rect x="' + x.toFixed(0) + '" y="' + (220 - h).toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '"/>'; x += w - 2; }
    var lights = ''; for (var i = 0; i < 60; i++) lights += '<rect x="' + (rnd() * 400).toFixed(0) + '" y="' + (110 + rnd() * 105).toFixed(0) + '" width="2.5" height="3.5" fill="' + (rnd() < .2 ? '#4fd1a5' : '#ffd27a') + '" opacity=".8"/>';
    return '<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice"><g fill="#0f2b33">' + b + '</g><path d="M200 220V60l12-30 12 30v160Z" fill="#0f2b33"/>' + lights + '</svg>';
  }
  function mapSvg() {
    return '<svg class="mapbg" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect width="400" height="520" fill="#e8efe9"/>' +
      '<path d="M250 0C230 80 290 150 260 230S200 360 240 440 300 520 300 520H360C340 470 280 420 300 340S360 200 330 120 320 40 320 0Z" fill="#b9dcec"/>' +
      '<path d="M40 300h90v80H40zM300 80h70v60h-70z" fill="#cfe5d6"/><circle cx="170" cy="150" r="34" fill="#cfe5d6"/>' +
      '<g stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none"><path d="M0 220H400M150 0V520M0 420C120 400 200 430 400 380"/><path d="M60 0 100 520"/></g>' +
      '<g stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"><path d="M0 120H250M0 320H260M210 0V300M80 220 120 120M300 220V520M150 260H300M20 470H220"/></g>' +
      '<g stroke="#f7e3b0" stroke-width="5" fill="none" opacity=".9"><path d="M0 220H400"/></g>' +
      (S.city === 'rzeszow' ? '<text x="228" y="168" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#7a8b88">Rynek</text><text x="282" y="300" font-family="Inter,sans-serif" font-size="10" fill="#5e8ea6" transform="rotate(-70 282 300)">Wisłok</text>' : '<text x="200" y="168" font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="#7a8b88">' + esc(cityName(S.city)) + '</text>') + '</svg>';
  }
  function houseArt() {
    return '<svg viewBox="0 0 390 230" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd3c1"/><stop offset="1" stop-color="#eaf6f1"/></linearGradient></defs><rect width="390" height="230" fill="url(#hsky)"/><circle cx="320" cy="60" r="28" fill="#fff" opacity=".6"/><rect y="182" width="390" height="48" fill="#cfd9d6"/><path d="M60 182v-80l90-56 90 56v80Z" fill="#f4f7f6"/><path d="M50 106l100-64 100 64" fill="none" stroke="#0c2b33" stroke-width="8" stroke-linejoin="round"/><rect x="95" y="122" width="110" height="60" fill="#9fb0ae"/><g stroke="#87999a" stroke-width="2.5"><path d="M95 137h110M95 152h110M95 167h110"/></g><rect x="214" y="122" width="18" height="24" rx="3" fill="#137a5f"/><rect x="216" y="128" width="14" height="10" rx="2" fill="#fff"/><circle cx="300" cy="150" r="36" fill="#2f8a63"/><circle cx="284" cy="166" r="24" fill="#3aa575"/><path d="M100 230l20-48h60l20 48Z" fill="#b7c3c0"/></svg>';
  }
  function deviceArt() {
    return '<svg class="device-art" viewBox="0 0 220 300"><rect x="26" y="16" width="168" height="260" rx="24" fill="#061a21"/><rect x="20" y="10" width="168" height="260" rx="24" fill="#14404b"/><rect x="38" y="30" width="28" height="28" rx="7" fill="#137a5f"/><text x="74" y="50" font-family="Plus Jakarta Sans,sans-serif" font-weight="800" font-size="19" fill="#fff">ho-park</text><g transform="translate(44 74)"><rect width="120" height="120" rx="10" fill="#fff"/><g transform="translate(8 8) scale(.96)">' + qrSvg('https://ho-park.com/gate/HP-RZ-0014').replace('<svg', '<svg class="qr-in" x="0" y="0" width="108" height="108"') + '</g></g><rect x="74" y="214" width="60" height="7" rx="3.5" fill="#4fd1a5"/><text x="104" y="246" text-anchor="middle" font-family="ui-monospace,monospace" font-size="10" fill="#7fa3a6" letter-spacing="1.2">HP-RZ-0014</text></svg>';
  }

  /* =====================================================================
     Actions (event delegation)
     ===================================================================== */
  var ACT = {
    close: function () { closeSheet(); },
    quick: function () { S.user = { name: 'Tomasz Nowak', email: 'tomasz@example.com' }; save(); go('#/role'); },
    signup: function () { S.user = { name: $('#suName').value.trim() || 'Ho-Park user', email: $('#suEmail').value.trim() }; save(); go('#/role'); },
    role: function (v) { S.role = v; save(); $$('.choice').forEach(function (c) { c.classList.toggle('on', c.dataset.v === v); }); },
    roleGo: function () { if (!S.role) S.role = 'driver'; var n = S.next; S.next = null; save(); go(n || (S.role === 'host' ? '#/host' : '#/explore')); },
    when: function (v) { S.when = v; save(); $$('.chip[data-x="when"]').forEach(function (c) { c.classList.toggle('on', c.dataset.v === v); }); },
    pin: function (v) { S.sel = v; save(); drawPins(); drawCard(); },
    locate: function () { S.sel = 's2'; drawPins(); drawCard(); toast(cityName(S.city)); },
    cityPick: function () { citySheet(S.city, function (id) { S.city = id; makeSpots(id); S.sel = 's2'; save(); render(); toast(t('cityNow') + ' ' + cityName(id)); }); },
    listview: function () { var lv = $('#listview'); lv.hidden = !lv.hidden; if (!lv.hidden) drawList(); },
    filters: function () {
      var f = S.filters;
      var row = function (k, label, icn) { return '<button class="mrow' + (f[k] ? ' on' : '') + '" data-x="ftoggle" data-v="' + k + '">' + ic(icn) + '<span class="grow">' + t(label) + '</span><span class="tgl' + (f[k] ? ' on' : '') + '"></span></button>'; };
      sheet('<h2>' + t('filters') + '</h2><div class="menu" style="margin:0 0 16px">' + row('covered', 'fCovered', 'roof') + row('ev', 'fEv', 'bolt') + row('gate', 'fGate', 'key') + '</div><div class="row-btns"><button class="btn btn-outline" data-x="fclear">' + t('clear') + '</button><button class="btn btn-primary" data-x="fapply">' + t('apply') + '</button></div>');
    },
    ftoggle: function (v, el) { S.filters[v] = !S.filters[v]; el.classList.toggle('on', S.filters[v]); $('.tgl', el).classList.toggle('on', S.filters[v]); save(); },
    fclear: function () { S.filters = { covered: false, ev: false, gate: false }; save(); closeSheet(); render(); },
    fapply: function () { closeSheet(); render(); },
    fav: function (v) { S.fav[v] = !S.fav[v]; save(); render(); },
    start: function (v) { BK.start = +v; bkUpdate(); },
    dur: function (v) { BK.dur = Math.max(.5, Math.min(12, BK.dur + +v)); bkUpdate(); },
    plate: function () {
      sheet('<h2>' + t('carReg') + '</h2><input class="input" id="plateIn" value="' + esc(S.plate) + '" style="text-transform:uppercase;font-family:var(--fh);font-weight:700;font-size:20px;text-align:center;margin:8px 0 14px"><button class="btn btn-primary" id="plateOk">' + t('done') + '</button>', function (sh) {
        $('#plateOk', sh).addEventListener('click', function () { S.plate = ($('#plateIn', sh).value || S.plate).toUpperCase(); save(); $('#bkPlate').textContent = S.plate; closeSheet(); });
      });
    },
    pm: function (v) { S.pay = v; save(); bkUpdate(); },
    pay: function () { payFlow(); },
    instr: function () { var p = $('#instrTxt'); p.hidden = !p.hidden; },
    gate: function () { gateFlow(); },
    extend: function () {
      var s = spot(S.booking.spot);
      confirmSheet(t('extendT'), t('extendD') + ' <b>' + money(s.price * .5) + '</b>', t('extend'), function () { S.booking.end += 1800000; S.booking.total += s.price * .5; S.history.forEach(function (h) { if (h.id === S.booking.id) { h.end = S.booking.end; h.total = S.booking.total; } }); save(); toast(t('extended')); render(); });
    },
    end: function () { confirmSheet(t('endT'), t('endD'), t('endBtn'), function () { endBooking(); }, true); },
    bktab: function (v) { bkTab = v; render(); },
    dtype: function (v) { draft().type = v; save(); $$('[data-x="dtype"]').forEach(function (c) { c.classList.toggle('on', c.dataset.v === v); }); },
    dtier: function (v) { draft().tier = v; save(); render(); },
    dnow: function () { var d = draft(); d.now = !d.now; save(); render(); },
    dsched: function (v) { var d = draft(); d.sched[v] = (d.sched[v] + 1) % PRESETS.length; save(); render(); },
    wnext: function (v) { go('#/host/new/' + (+v + 1)); },
    publish: function () {
      var d = draft(), id = d.editing || ('m' + Date.now().toString(36)), old = ownSpace(id);
      var sp = { id: id, type: d.type, address: d.address, bay: d.bay, photo: d.photo, tier: d.tier, instr: d.instr, sched: d.sched, prices: d.prices, city: d.city, loc: d.loc, sharing: old ? old.sharing : true, paired: old ? old.paired : false, demand: old ? old.demand : .7 };
      if (old) S.spaces[S.spaces.indexOf(old)] = sp; else S.spaces.push(sp);
      S.draft = null; S.city = sp.city; S.ownAcct = 'mine'; OWN.tab = 'ov'; makeSpots(S.city); save(); toast(t(old ? 'saved' : 'published'));
      go(sp.tier !== 'basic' && !sp.paired ? '#/host/device/' + id : '#/host/space/' + id);
    },
    share: function (v) { var h = ownSpace(v); if (h) h.sharing = !h.sharing; else { h = findSpace(v); S.demoOv = S.demoOv || {}; S.demoOv[v] = S.demoOv[v] || {}; S.demoOv[v].on = !h.sharing; h.sharing = !h.sharing; } save(); toast(t(h.sharing ? 'sharing' : 'notSharing')); render(); },
    oacct: function (v) { S.ownAcct = v; OWN.space = ''; OWN.q = ''; save(); render(); },
    ospf: function (v) { OWN.spf = v; render(); },
    dCity: function () { var d = draft(); citySheet(d.city, function (id) { d.city = id; d.prices = tri(D.suggest(cityOf(id), d.loc)); save(); render(); }); },
    dLoc: function (v) { var d = draft(); d.loc = v; d.prices = tri(D.suggest(cityOf(d.city), v)); save(); render(); },
    wizClose: function () { S.draft = null; save(); },
    editSpace: function (v, el) { var h = ownSpace(v); S.draft = JSON.parse(JSON.stringify(h)); S.draft.editing = v; S.draft.now = h.sharing; save(); go('#/host/new/' + (el.dataset.step || 1)); },
    delSpace: function (v) { confirmSheet(t('delT'), t('delD'), t('delBtn'), function () { S.spaces = S.spaces.filter(function (x) { return x.id !== v; }); if (!S.spaces.length) S.ownAcct = 'private'; save(); toast(t('deleted')); go('#/host'); }, true); },
    demoOwner: function () { S.ownAcct = 'private'; OWN.tab = 'ov'; save(); go('#/host'); },
    simCity: function () { citySheet(SIM.city, function (id) { SIM.city = id; render(); }); },
    simLoc: function (v) { SIM.loc = v; render(); },
    seeMap: function (v) { S.city = v; makeSpots(v); save(); },
    toPay: function () { OWN.tab = 'pay'; go('#/host'); },
    otab: function (v) { OWN.tab = v; render(); },
    ocal: function (v) { v = +v; if (!v) { OWN.y = TODAY.getFullYear(); OWN.m = TODAY.getMonth(); } else { OWN.m += v; if (OWN.m < 0) { OWN.m = 11; OWN.y--; } if (OWN.m > 11) { OWN.m = 0; OWN.y++; } } render(); },
    ostars: function (v) { OWN.stars = +v; render(); },
    oreply: function (v) { OWN.replying = v; render(); },
    ocancel: function () { OWN.replying = null; render(); },
    useSug: function (v) { var h = findSpace(v), p = D.suggest(cityOf(h.city), h.loc), o = ownSpace(v); if (o) o.prices[0] = p; else { S.demoOv = S.demoOv || {}; S.demoOv[v] = S.demoOv[v] || {}; S.demoOv[v].price = p; } save(); toast(t('priceSet') + ' ' + money(p)); render(); },
    pairScan: function (v) {
      var pid = v || (S.spaces[0] && S.spaces[0].id), ph = ownSpace(pid);
      sheet('<h2>' + t('pair3') + '</h2><div class="scan-view"><div class="scan-qr">' + qrSvg('https://ho-park.com/gate/HP-RZ-0014') + '</div><span class="scan-frame"></span><span class="scan-line"></span></div><div id="pairRes"><div class="spinner"></div></div>', function (sh) {
        setTimeout(function () { if (ph) ph.paired = true; save(); $('#pairRes', sh).innerHTML = '<div class="success" style="padding-top:0">' + ic('check') + '<h2>' + t('paired') + ' · HP-RZ-0014</h2><p>' + t('pairedD') + '</p><a class="btn btn-primary" href="#/host/space/' + pid + '">' + t('done') + '</a></div>'; var l = $('.scan-line', sh); if (l) l.remove(); }, 2000);
      });
    },
    withdraw: function () { confirmSheet(t('withdrawT'), t('withdrawD') + ' •• 4471: <b>' + money(S.balance) + '</b>', t('withdraw'), function () { S.balance = 0; save(); toast(t('withdrawn')); render(); }); },
    earnHist: function () { sheet('<h2>' + t('earnHist') + '</h2>' + S.earnings.map(function (v, i) { return '<div class="review-row"><span>' + t('earnRows') + ' ' + (i + 1) + '</span><b>' + money(v) + '</b></div>'; }).join('') + '<button class="btn btn-outline" data-x="close" style="margin-top:16px">' + t('done') + '</button>'); },
    payout: function () { sheet('<h2>' + t('payout') + '</h2><div class="review-row"><span>' + t('bank') + '</span><b>PL •• •••• 4471</b></div><p class="small muted" style="margin:12px 0 16px">' + t('verifyD') + '</p><button class="btn btn-outline" data-x="close">' + t('done') + '</button>'); },
    verify: function () {
      if (S.verified) { toast(t('verifiedT')); return; }
      sheet('<h2>' + t('verifyT') + '</h2><p class="lead">' + t('verifyD') + '</p><button class="btn btn-primary" id="vGo">' + t('verifyBtn') + '</button>', function (sh) {
        $('#vGo', sh).addEventListener('click', function () { sh.innerHTML = '<div class="grab"></div><div class="success"><div class="spinner"></div></div>'; setTimeout(function () { S.verified = true; save(); closeSheet(); toast(t('verifiedT')); render(); }, 1500); });
      });
    },
    theme: function (v) { var dark0 = THEMES[THEME].bar !== 'default'; applyTheme(v, true); render(); toast(t('themeSet') + ' · ' + t('th' + v[0].toUpperCase() + v.slice(1))); if (standalone && dark0 !== (THEMES[v].bar !== 'default')) setTimeout(function () { toast(t('themeBar')); }, 2300); },
    lang: function (v) { S.lang = v; makeSpots(S.city); save(); document.documentElement.lang = v; deskTexts(); render(); },
    notif: function () { S.notif = !S.notif; save(); render(); },
    install: function () { sheet('<h2>' + t('install') + '</h2><p class="lead">' + t('installD') + '</p><button class="btn btn-primary" data-x="close">' + t('done') + '</button>'); },
    reset: function () { confirmSheet(t('resetT'), t('resetD'), t('reset'), resetDemo, true); },
    logout: function () { S.user = null; save(); go('#/welcome'); }
  };
  function resetDemo() { try { localStorage.removeItem(STORE); } catch (e) {} S = clone(DEFAULT); makeSpots(S.city); SPOTS.forEach(function (s) { if (s.dyn) s.live = s.id === 's5'; }); go('#/welcome'); }
  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-x]'); if (!el || !app.contains(el)) return;
    var fn = ACT[el.dataset.x]; if (!fn) return;
    e.preventDefault(); fn(el.dataset.v, el);
  });

  /* =====================================================================
     Desktop (iMac) demo frame + install helpers
     ===================================================================== */
  var standalone = window.navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  var DESK = {
    en: ['Ho-Park app — demo', 'This is a working demo of the Ho-Park app. Click through it here, or open it on your iPhone and add it to your Home Screen.', 'Scan with your iPhone camera to open the app', ['Open the link in <b>Safari</b> on your iPhone.', 'Tap <b>Share</b>, then <b>Add to Home Screen</b>.', 'Open <b>Ho-Park</b> from your Home Screen — it runs full screen like an app.'], '← Ho-Park website', 'For space owners', 'Reset demo', 'Upload the website to your server to open the app on your iPhone.'],
    pl: ['Aplikacja Ho-Park — demo', 'To działające demo aplikacji Ho-Park. Klikaj tutaj albo otwórz ją na iPhonie i dodaj do ekranu początkowego.', 'Zeskanuj aparatem iPhone’a, aby otworzyć aplikację', ['Otwórz link w <b>Safari</b> na iPhonie.', 'Dotknij <b>Udostępnij</b>, a potem <b>Do ekranu początkowego</b>.', 'Otwórz <b>Ho-Park</b> z ekranu początkowego — działa na pełnym ekranie jak aplikacja.'], '← Strona Ho-Park', 'Dla właścicieli', 'Resetuj demo', 'Wgraj stronę na serwer, aby otworzyć aplikację na iPhonie.']
  };
  function deskTexts() {
    var d = DESK[S.lang] || DESK.en;
    $('#dpTitle').textContent = d[0]; $('#dpText').textContent = d[1];
    var web = /^https?:/.test(location.protocol);
    $('#dpQrCap').textContent = web ? d[2] : d[7];
    $('#dpSteps').innerHTML = d[3].map(function (x) { return '<li>' + x + '</li>'; }).join('');
    $('#dpWeb').textContent = d[4]; $('#dpOwners').textContent = d[5]; $('#dpReset').textContent = d[6];
  }
  function setupDesk() {
    var dw = $('#dpWeb'), dow = $('#dpOwners'); if (dw) dw.href = SITE + 'index.html'; if ($('#dpLogo')) $('#dpLogo').href = SITE + 'index.html'; if (dow) dow.href = SITE + 'owners.html';
    if (EMBED) { document.body.classList.add('embed'); $('#deskPanel').hidden = true; $('#statusbar').hidden = false; $('#sbTime').textContent = '9:41'; return; }
    var wide = window.innerWidth >= 700 && window.innerHeight >= 700 && !standalone && !('ontouchstart' in window && window.innerWidth < 1000);
    document.body.classList.toggle('desk', wide);
    $('#deskPanel').hidden = !wide; $('#statusbar').hidden = !wide;
    if (wide) {
      var web = /^https?:/.test(location.protocol);
      $('#dpQr').innerHTML = web ? qrSvg(location.href.split('#')[0]) : qrSvg('https://ho-park.com/app/');
      $('#dpQr').style.opacity = web ? 1 : .35;
      deskTexts();
      var tm = function () { var d = new Date(); $('#sbTime').textContent = d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2); }; tm(); setInterval(tm, 30000);
    }
  }
  $('#dpReset').addEventListener('click', function () { resetDemo(); });
  window.addEventListener('resize', function () { setupDesk(); });
  document.documentElement.lang = S.lang;
  makeSpots(S.city);
  setupDesk();
  if (EMBED) {
    var START = { host: '#/host', explore: '#/explore', tiers: '#/host/new/2', price: '#/host/new/4', profile: '#/profile', session: '#/explore' };
    if (!location.hash) history.replaceState(null, '', location.pathname + location.search + (START[EMBED] || '#/host'));
    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin || !e.data || e.data.type !== 'hp-lang') return;
      if (e.data.lang !== S.lang) { S.lang = e.data.lang === 'pl' ? 'pl' : 'en'; document.documentElement.lang = S.lang; render(); }
    });
  }
  render();

  if (!EMBED && 'serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
