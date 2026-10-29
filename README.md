# Pams Mart 🛍️🎀

**Your Most Suited Supermarket** — A delightful, aesthetic web application inspired by supermarket convenience (base: [Pothys Mart](https://pothysmart.com/home_)) faithfully bringing to life the user's hand-crafted catalog and category designs.

---

## 📸 Implemented Design Mockups & Categories

1. **Home Landing Page** (from Image 5)
   - Pastel blue & white watercolor gingham checkerboard pattern
   - Retro window title bar with `[-] [□] [✕]` controls
   - Outlined `PAMS` header with cute cursive `Mart`
   - Subtitle: `YOUR MOST SUITED SUPERMARKET`
   - `LEARN MORE` pill button navigating to Catalog
   - Interactive search input with `🔍`
   - Supermarket cart artwork adorned with ribbon bows and sparkles

2. **Catalog Page** (from Image 1)
   - Scalloped blush pink background border & ribbon pill texture
   - Prominent `CATALOG` banner header
   - 2x2 Ticket-bordered Category Cards:
     - **SELF-CARE** (Facewash, Lip Balm, Sunscreen)
     - **CHOCOLATE** (Kit Kat, Snickers, Dairy Milk)
     - **SNACKS** (Potato Chips, Nacho Cheese, Pringles)
     - **DRINKS** (Strawberry Milk, Banana Milk, Coca Cola)
     - Docked Shopping Basket quick-access button

3. **Dedicated Category Aisles** (from Images 2, 3, 4)
   - **Chocolate Aisle**:
     - Kit Kat (`₹20`)
     - Snickers (`₹45`)
     - Dairy Milk Silk (`₹40`)
   - **Self-Care Aisle**:
     - Lakmé Blush & Glow Strawberry Facewash (`₹135`)
     - Laneige Lip Glowy Balm (`₹750`)
     - Dot & Key Watermelon Cooling Sunscreen SPF 50+ (`₹499`)
   - **Drinks Aisle**:
     - Korean Strawberry Milk Carton (`₹50`)
     - Binggrae Banana Flavored Milk (`₹140`)
     - Limited Edition Pink Hello Kitty Coca Cola (`₹45`)
   - **Snacks Aisle**:
     - Classic Sea Salt Potato Chips (`₹30`)
     - Crispy Cheesy Nachos (`₹50`)
     - Sour Cream & Onion Pringles (`₹110`)

4. **Convenient Supermarket Features**
   - **Cart Drawer**: Slide-out basket with live subtotal calculation in INR (`₹`), quantity counters (`+` / `-`), remove items, and clear basket.
   - **Live Search**: Instant product lookup across all aisles.
   - **Simple Checkout Modal**: Delivery address & customer contact form with Cash on Delivery or UPI options, leading to an Order Confirmation screen.

---

## 🧪 Automated Selenium Testing & UI/UX Audit

A complete Selenium automated test suite was developed and executed to ensure **zero UI/UX breaking**:

### Test Scenarios Checked:
- **Functional Navigation**: Home &rarr; Catalog &rarr; Categories &rarr; Cart &rarr; Checkout.
- **Product & Price Validation**: Exact matching of all product names, categories, and prices (`₹`).
- **Cart Math**: Accurate tally of items, multiple quantities, subtotal calculations.
- **Search Filtering**: Live query filtering and empty-state handling.
- **UI/UX Breaking Checks**:
  - **Horizontal Overflow Check**: Verified across 4 standard viewports (Desktop `1920x1080`, Laptop `1280x800`, Tablet `768x1024`, Mobile `375x667`) that `scrollWidth <= window.innerWidth` (no broken side-scrolling).
  - **Broken Image Check**: Verified that 100% of images load with valid natural dimensions (`naturalWidth > 0`).
  - **Console Errors Check**: Inspected browser console logs for `SEVERE` JavaScript exceptions.
  - **Clickability Check**: Ensured buttons and controllers are interactable without overlap.

### Test Results:
- **Total Tests**: `45`
- **Passed**: `45`
- **Failed**: `0`
- **Pass Rate**: `100.0%`
- **Full Report**: Located at [tests/reports/report.html](tests/reports/report.html)
- **Screenshots**: Located in [tests/reports/screenshots/](tests/reports/screenshots/)

---

## 🚀 Running the Project Locally

### 1. Start the Local Server
```bash
python -m http.server 8085
```
Open [http://localhost:8085](http://localhost:8085) in any modern browser.

### 2. Run the Selenium Test Suite
```bash
python tests/test_pams_mart.py
```
View the generated test summary at [tests/reports/report.html](tests/reports/report.html).
