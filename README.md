# Ho-Park app — demo

Working demo of the Ho-Park parking app (Progressive Web App). No user accounts yet:
everything you do is stored only on the phone you use. Bookings, payments, earnings
and reviews are **simulated** — nothing is charged or paid out.

**What's inside**
- Drivers: map of 57 EU cities (stage 1 Rzeszów, stage 2 all EU capitals, stage 3 major metros),
  live spaces, booking & payment flow (BLIK / card / Apple Pay / Google Pay, demo), active booking
  with timer, gate opening (Open access / Gate Connect / Gate Pro), messages.
- Space owners: add several spaces in any city, three access levels, weekly schedule, price matrix,
  owner dashboard — earnings this month, times used, payout calendar with ★ payout on the 30th,
  ratings with replies, opportunities (your price vs. public parking and suggested Ho-Park price).
- English / Polish, works offline after the first visit, installs on the Home Screen.

---

## 1. Put it on GitHub (5 minutes, free)

1. Sign in at **github.com** → top right **+** → **New repository**.
   Name: `ho-park-app` · Public · **Create repository**.
2. On the new repository page click **uploading an existing file**.
3. Unzip the package on your computer, open the `ho-park-app` folder, select **all files
   and the `icons` folder** and drag them into the browser window. Click **Commit changes**.
   (`.nojekyll` is a hidden file — if your computer hides it, that's fine, the app works without it.)
4. Go to **Settings → Pages**. Under *Build and deployment* choose
   **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)** → **Save**.
5. Wait 1–2 minutes and refresh the page. GitHub shows the address, e.g.
   `https://YOUR-NAME.github.io/ho-park-app/`

## 2. Install it on your iPhone

1. Open the address in **Safari** (tip: open it on your Mac first — the page shows a QR code
   you can scan with the iPhone camera).
2. Tap **Share** (square with arrow) → **Add to Home Screen** → **Add**.
3. Start **Ho-Park** from the Home Screen. It opens full screen, like a native app.

Android: open the address in Chrome → menu ⋮ → **Install app** / **Add to Home screen**.

## 3. Testing tips

- Tap **Create account with email** — any details work (demo).
- **Share** tab → *Load demo owner account (4 spaces)* fills the owner dashboard with example spaces
  in Rzeszów, Kraków and Budapest. Or add your own space with **List my space**.
- **Explore** → tap the city name at the top to switch between 57 EU cities.
- **Profile → Settings → Reset demo data** starts from scratch.

## 4. Updating the app

Upload the changed files to the repository again (Add file → Upload files → Commit).
Pages updates within a minute or two. On the phone, close and reopen the app twice
(the first start downloads the new version in the background).

---

### Po polsku — w skrócie
1. github.com → **New repository** → nazwa `ho-park-app`, Public → Create.
2. **uploading an existing file** → przeciągnij wszystkie pliki i folder `icons` → **Commit changes**.
3. **Settings → Pages** → Source: *Deploy from a branch*, Branch: *main*, */ (root)* → **Save**.
4. Po 1–2 min adres: `https://TWOJA-NAZWA.github.io/ho-park-app/`.
5. iPhone: otwórz adres w **Safari** → **Udostępnij** → **Do ekranu początkowego**.
6. Aktualizacja: wgraj zmienione pliki ponownie; na telefonie zamknij i otwórz aplikację dwa razy.

Demo — dane zapisują się tylko na danym telefonie; rezerwacje, płatności i zarobki są symulowane.
Szacunki cen i zarobków nie są ofertą handlową.
