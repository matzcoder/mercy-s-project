"""
Selenium Automated Test Suite for Pams Mart
Tests functional flows, navigation, shopping cart, checkout, search,
and checks for UI/UX breaking across viewports (overflow, broken images, console errors, clickability).
"""

import os
import sys
import time
import json

# Ensure UTF-8 output on Windows terminal
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

BASE_URL = "http://localhost:8085"
REPORTS_DIR = os.path.join(os.path.dirname(__file__), "reports")
SCREENSHOTS_DIR = os.path.join(REPORTS_DIR, "screenshots")

os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

class PamsMartTestRunner:
    def __init__(self):
        self.results = []
        self.chrome_options = Options()
        self.chrome_options.add_argument("--headless=new")
        self.chrome_options.add_argument("--disable-gpu")
        self.chrome_options.add_argument("--no-sandbox")
        self.chrome_options.add_argument("--disable-dev-shm-usage")
        self.chrome_options.add_argument("--window-size=1440,900")
        
        # Enable logging to catch JS errors
        self.chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
        self.driver = webdriver.Chrome(options=self.chrome_options)
        self.wait = WebDriverWait(self.driver, 6)

    def log_result(self, test_name, status, details=""):
        res = {"test": test_name, "status": status, "details": details}
        self.results.append(res)
        status_icon = "✅ PASS" if status == "PASS" else "❌ FAIL"
        print(f"[{status_icon}] {test_name}: {details}")

    def capture_screenshot(self, name):
        filepath = os.path.join(SCREENSHOTS_DIR, f"{name}.png")
        self.driver.save_screenshot(filepath)
        return filepath

    def check_console_errors(self, stage_name):
        logs = self.driver.get_log('browser')
        severe_errors = [entry for entry in logs if entry['level'] == 'SEVERE']
        if severe_errors:
            msg = f"Console errors in {stage_name}: " + "; ".join([e['message'] for e in severe_errors])
            self.log_result(f"Console Errors Check ({stage_name})", "FAIL", msg)
            return False
        else:
            self.log_result(f"Console Errors Check ({stage_name})", "PASS", "No severe browser console errors")
            return True

    def check_broken_images(self, stage_name):
        broken = self.driver.execute_script("""
            const images = Array.from(document.querySelectorAll('img'));
            return images.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src || img.alt);
        """)
        if broken:
            self.log_result(f"Broken Images Check ({stage_name})", "FAIL", f"Broken images: {broken}")
            return False
        else:
            self.log_result(f"Broken Images Check ({stage_name})", "PASS", "All images loaded with valid natural dimensions")
            return True

    def check_horizontal_overflow(self, viewport_name):
        has_overflow = self.driver.execute_script("""
            return document.documentElement.scrollWidth > window.innerWidth;
        """)
        scroll_w = self.driver.execute_script("return document.documentElement.scrollWidth;")
        client_w = self.driver.execute_script("return window.innerWidth;")
        if has_overflow:
            self.log_result(f"Horizontal Overflow Check ({viewport_name})", "FAIL", 
                            f"Layout broke horizontally! scrollWidth={scroll_w}px > window.innerWidth={client_w}px")
            return False
        else:
            self.log_result(f"Horizontal Overflow Check ({viewport_name})", "PASS", 
                            f"No overflow. scrollWidth={scroll_w}px <= window.innerWidth={client_w}px")
            return True

    def run_all_tests(self):
        try:
            print("\n=================== STARTING PAMS MART SELENIUM TESTS ===================")
            
            # --- 1. Home Page Load & Branding ---
            self.driver.get(BASE_URL)
            time.sleep(1)
            title = self.driver.title
            if "Pams Mart" in title:
                self.log_result("Page Title Test", "PASS", f"Title correctly is '{title}'")
            else:
                self.log_result("Page Title Test", "FAIL", f"Unexpected title: '{title}'")

            # Check Hero Branding & Tagline
            hero_title = self.driver.find_element(By.ID, "home-title").text
            hero_subtitle = self.driver.find_element(By.ID, "home-subtitle").text
            if "PAMS" in hero_title and "YOUR MOST SUITED SUPERMARKET" in hero_subtitle:
                self.log_result("Hero Branding Verification", "PASS", f"Found '{hero_title}' with subtitle '{hero_subtitle}'")
            else:
                self.log_result("Hero Branding Verification", "FAIL", f"Title: {hero_title}, Subtitle: {hero_subtitle}")

            self.check_broken_images("Home Page")
            self.check_console_errors("Home Page")
            self.capture_screenshot("01_home_desktop")

            # --- 2. Navigation: 'LEARN MORE' to Catalog ---
            learn_more_btn = self.driver.find_element(By.ID, "hero-learn-more-btn")
            learn_more_btn.click()
            time.sleep(0.5)

            catalog_view = self.driver.find_element(By.ID, "view-catalog")
            if catalog_view.is_displayed():
                self.log_result("Learn More Navigation", "PASS", "Clicked 'LEARN MORE' and successfully navigated to Catalog view")
            else:
                self.log_result("Learn More Navigation", "FAIL", "Catalog view not displayed after clicking 'LEARN MORE'")

            self.capture_screenshot("02_catalog_view")
            self.check_broken_images("Catalog View")

            # --- 3. Verify All 4 Categories Exist in Catalog ---
            categories_found = []
            for cat_id in ["self-care", "chocolate", "snacks", "drinks"]:
                card = self.driver.find_element(By.ID, f"catalog-card-{cat_id}")
                if card.is_displayed():
                    categories_found.append(cat_id)
            
            if len(categories_found) == 4:
                self.log_result("Catalog 4-Categories Verification", "PASS", f"All 4 categories present: {categories_found}")
            else:
                self.log_result("Catalog 4-Categories Verification", "FAIL", f"Missing categories. Found: {categories_found}")

            # --- 4. Category Details: CHOCOLATE ---
            choco_card = self.driver.find_element(By.ID, "catalog-card-chocolate")
            choco_card.click()
            time.sleep(0.5)

            cat_title = self.driver.find_element(By.ID, "active-category-title").text
            self.log_result("Category Title Test", "PASS" if cat_title == "CHOCOLATE" else "FAIL", f"Category title is {cat_title}")

            # Verify Chocolate products: Kit Kat (₹20), Snickers (₹45), Dairy Milk (₹40)
            kitkat_card = self.driver.find_element(By.ID, "product-card-kitkat")
            snickers_card = self.driver.find_element(By.ID, "product-card-snickers")
            dairymilk_card = self.driver.find_element(By.ID, "product-card-dairymilk")

            kitkat_price = kitkat_card.find_element(By.CLASS_NAME, "product-price-val").text
            snickers_price = snickers_card.find_element(By.CLASS_NAME, "product-price-val").text
            dairymilk_price = dairymilk_card.find_element(By.CLASS_NAME, "product-price-val").text

            if kitkat_price == "₹20" and snickers_price == "₹45" and dairymilk_price == "₹40":
                self.log_result("Chocolate Products & Pricing Verification", "PASS", 
                                f"Kit Kat={kitkat_price}, Snickers={snickers_price}, Dairy Milk={dairymilk_price}")
            else:
                self.log_result("Chocolate Products & Pricing Verification", "FAIL", 
                                f"Unexpected prices: KitKat={kitkat_price}, Snickers={snickers_price}, Dairy Milk={dairymilk_price}")

            self.capture_screenshot("03_chocolate_category")
            self.check_broken_images("Chocolate Category View")

            # --- 5. Category Details: SELF-CARE ---
            self.driver.get(f"{BASE_URL}/#self-care")
            time.sleep(0.5)
            facewash_card = self.driver.find_element(By.ID, "product-card-facewash")
            lipbalm_card = self.driver.find_element(By.ID, "product-card-lipbalm")
            sunscreen_card = self.driver.find_element(By.ID, "product-card-sunscreen")

            fw_price = facewash_card.find_element(By.CLASS_NAME, "product-price-val").text
            lb_price = lipbalm_card.find_element(By.CLASS_NAME, "product-price-val").text
            ss_price = sunscreen_card.find_element(By.CLASS_NAME, "product-price-val").text

            if fw_price == "₹135" and lb_price == "₹750" and ss_price == "₹499":
                self.log_result("Self-Care Products & Pricing Verification", "PASS", 
                                f"Facewash={fw_price}, Lip Balm={lb_price}, Sunscreen={ss_price}")
            else:
                self.log_result("Self-Care Products & Pricing Verification", "FAIL", 
                                f"Unexpected prices: Facewash={fw_price}, Lip Balm={lb_price}, Sunscreen={ss_price}")

            self.capture_screenshot("04_self_care_category")
            self.check_broken_images("Self-Care Category View")

            # --- 6. Category Details: DRINKS ---
            self.driver.get(f"{BASE_URL}/#drinks")
            time.sleep(0.5)
            sm_card = self.driver.find_element(By.ID, "product-card-strawberry-milk")
            bm_card = self.driver.find_element(By.ID, "product-card-banana-milk")
            cc_card = self.driver.find_element(By.ID, "product-card-coca-cola")

            sm_price = sm_card.find_element(By.CLASS_NAME, "product-price-val").text
            bm_price = bm_card.find_element(By.CLASS_NAME, "product-price-val").text
            cc_price = cc_card.find_element(By.CLASS_NAME, "product-price-val").text

            if sm_price == "₹50" and bm_price == "₹140" and cc_price == "₹45":
                self.log_result("Drinks Products & Pricing Verification", "PASS", 
                                f"Strawberry Milk={sm_price}, Banana Milk={bm_price}, Coca Cola={cc_price}")
            else:
                self.log_result("Drinks Products & Pricing Verification", "FAIL", 
                                f"Unexpected prices: Strawberry Milk={sm_price}, Banana Milk={bm_price}, Coca Cola={cc_price}")

            self.capture_screenshot("05_drinks_category")
            self.check_broken_images("Drinks Category View")

            # --- 7. Category Details: SNACKS ---
            self.driver.get(f"{BASE_URL}/#snacks")
            time.sleep(0.5)
            chips_card = self.driver.find_element(By.ID, "product-card-potato-chips")
            nachos_card = self.driver.find_element(By.ID, "product-card-nacho-cheese")
            pringles_card = self.driver.find_element(By.ID, "product-card-pringles")

            chips_price = chips_card.find_element(By.CLASS_NAME, "product-price-val").text
            nachos_price = nachos_card.find_element(By.CLASS_NAME, "product-price-val").text
            pringles_price = pringles_card.find_element(By.CLASS_NAME, "product-price-val").text

            if chips_price == "₹30" and nachos_price == "₹50" and pringles_price == "₹110":
                self.log_result("Snacks Products & Pricing Verification", "PASS", 
                                f"Potato Chips={chips_price}, Nachos={nachos_price}, Pringles={pringles_price}")
            else:
                self.log_result("Snacks Products & Pricing Verification", "FAIL", 
                                f"Unexpected prices: Potato Chips={chips_price}, Nachos={nachos_price}, Pringles={pringles_price}")

            self.capture_screenshot("06_snacks_category")
            self.check_broken_images("Snacks Category View")

            # --- 8. Add to Cart & Basket Math ---
            # Clear any initial cart state
            self.driver.execute_script("clearCart();")
            time.sleep(0.3)

            # Add Potato Chips (₹30)
            add_chips_btn = self.driver.find_element(By.ID, "add-btn-potato-chips")
            add_chips_btn.click()
            time.sleep(0.5)

            # Verify Cart Counter is 1
            badge_text = self.driver.find_element(By.ID, "cart-item-count").text
            if badge_text == "1":
                self.log_result("Add to Cart - Badge Update", "PASS", "Cart badge incremented to 1")
            else:
                self.log_result("Add to Cart - Badge Update", "FAIL", f"Expected badge '1', got '{badge_text}'")

            # Increase quantity using in-card controller
            inc_chips_btn = self.driver.find_element(By.CSS_SELECTOR, "#qty-ctrl-potato-chips .btn-inc")
            inc_chips_btn.click()
            time.sleep(0.3)
            qty_count = self.driver.find_element(By.ID, "qty-count-potato-chips").text
            if qty_count == "2":
                self.log_result("In-Card Quantity Increase", "PASS", "Quantity successfully incremented to 2")
            else:
                self.log_result("In-Card Quantity Increase", "FAIL", f"Expected qty 2, got '{qty_count}'")

            # Navigate to Chocolate and add Kit Kat (₹20)
            self.driver.get(f"{BASE_URL}/#chocolate")
            time.sleep(0.5)
            add_kitkat_btn = self.driver.find_element(By.ID, "add-btn-kitkat")
            add_kitkat_btn.click()
            time.sleep(0.5)

            # Open Cart Drawer
            cart_btn = self.driver.find_element(By.ID, "open-cart-btn")
            cart_btn.click()
            time.sleep(0.5)

            cart_drawer = self.driver.find_element(By.ID, "cart-drawer")
            if "open" in cart_drawer.get_attribute("class"):
                self.log_result("Cart Drawer Open", "PASS", "Cart drawer smoothly slid open")
            else:
                self.log_result("Cart Drawer Open", "FAIL", "Cart drawer did not receive 'open' class")

            # Verify Basket Total: 2 * 30 (Chips) + 1 * 20 (KitKat) = ₹80
            total_text = self.driver.find_element(By.ID, "cart-total-price").text
            if total_text == "₹80":
                self.log_result("Cart Calculation Test", "PASS", f"Subtotal and Total correctly calculated as {total_text}")
            else:
                self.log_result("Cart Calculation Test", "FAIL", f"Expected ₹80, got {total_text}")

            self.capture_screenshot("07_cart_drawer")

            # --- 9. Checkout Flow ---
            checkout_trigger = self.driver.find_element(By.ID, "cart-checkout-btn")
            checkout_trigger.click()
            time.sleep(0.5)

            checkout_modal = self.driver.find_element(By.ID, "checkout-backdrop")
            if checkout_modal.is_displayed():
                self.log_result("Checkout Modal Trigger", "PASS", "Checkout modal opened with order summary")
            else:
                self.log_result("Checkout Modal Trigger", "FAIL", "Checkout modal not visible")

            self.capture_screenshot("08_checkout_modal")

            # Fill checkout form
            self.driver.find_element(By.ID, "cust-name").send_keys("Priya Nair")
            self.driver.find_element(By.ID, "cust-phone").send_keys("9876543210")
            self.driver.find_element(By.ID, "cust-address").send_keys("14 Blossom Lane, Pastel Garden, Chennai 600028")

            # Submit order
            submit_btn = self.driver.find_element(By.ID, "btn-submit-order")
            submit_btn.click()
            time.sleep(0.8)

            success_modal = self.driver.find_element(By.ID, "success-backdrop")
            if success_modal.is_displayed():
                order_id = self.driver.find_element(By.ID, "success-order-id").text
                self.log_result("Order Placement & Confirmation", "PASS", f"Order confirmed successfully! {order_id}")
            else:
                self.log_result("Order Placement & Confirmation", "FAIL", "Success modal not displayed")

            self.capture_screenshot("09_order_success")

            # Close success modal
            self.driver.find_element(By.ID, "btn-success-close").click()
            time.sleep(0.5)

            # Verify cart badge is reset to 0
            reset_badge = self.driver.find_element(By.ID, "cart-item-count").text
            if reset_badge == "0":
                self.log_result("Post-Order Cart Reset", "PASS", "Cart count successfully reset to 0")
            else:
                self.log_result("Post-Order Cart Reset", "FAIL", f"Expected 0, got {reset_badge}")

            # --- 10. Search Functionality ---
            search_input = self.driver.find_element(By.ID, "global-search-input")
            search_input.clear()
            search_input.send_keys("Milk")
            time.sleep(0.5)

            search_view = self.driver.find_element(By.ID, "view-search")
            if search_view.is_displayed():
                self.log_result("Search Live Activation", "PASS", "Search view triggered on typing 'Milk'")
            else:
                self.log_result("Search Live Activation", "FAIL", "Search view not active")

            # Verify Strawberry Milk and Banana Milk appear in search results
            search_cards = self.driver.find_elements(By.CSS_SELECTOR, "#search-results-list .product-item-card")
            card_texts = [c.text for c in search_cards]
            has_strawberry = any("STRAWBERRY MILK" in t for t in card_texts)
            has_banana = any("BANANA MILK" in t for t in card_texts)

            if has_strawberry and has_banana:
                self.log_result("Search Filtering Test", "PASS", "Search correctly returned Strawberry Milk and Banana Milk")
            else:
                self.log_result("Search Filtering Test", "FAIL", f"Results: {card_texts}")

            self.capture_screenshot("10_search_results")

            # --- 11. Multi-Viewport Responsive & UI/UX Breaking Checks ---
            viewports = [
                ("Desktop 1920x1080", 1920, 1080),
                ("Laptop 1280x800", 1280, 800),
                ("Tablet 768x1024", 768, 1024),
                ("Mobile 375x667", 375, 667)
            ]

            for vp_name, width, height in viewports:
                self.driver.set_window_size(width, height)
                time.sleep(0.5)
                self.driver.get(f"{BASE_URL}/#home")
                time.sleep(0.5)
                self.check_horizontal_overflow(f"{vp_name} - Home")
                self.check_broken_images(f"{vp_name} - Home")
                self.check_console_errors(f"{vp_name} - Home")

                # Check on Catalog
                self.driver.get(f"{BASE_URL}/#catalog")
                time.sleep(0.5)
                self.check_horizontal_overflow(f"{vp_name} - Catalog")

                # Check on Category
                self.driver.get(f"{BASE_URL}/#chocolate")
                time.sleep(0.5)
                self.check_horizontal_overflow(f"{vp_name} - Category")

                self.capture_screenshot(f"responsive_{width}x{height}")

            print("\n=================== TEST RUN COMPLETED ===================")
            
            # Write summary report
            total_tests = len(self.results)
            passed_tests = sum(1 for r in self.results if r["status"] == "PASS")
            failed_tests = total_tests - passed_tests

            report_summary = {
                "total": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "pass_rate": f"{(passed_tests/total_tests)*100:.1f}%",
                "results": self.results
            }

            report_path = os.path.join(REPORTS_DIR, "selenium_test_report.json")
            with open(report_path, "w", encoding="utf-8") as f:
                json.dump(report_summary, f, indent=2)

            print(f"\nSummary: {passed_tests}/{total_tests} passed ({report_summary['pass_rate']})")
            print(f"Report saved to: {report_path}")
            return failed_tests == 0

        finally:
            self.driver.quit()

if __name__ == "__main__":
    runner = PamsMartTestRunner()
    success = runner.run_all_tests()
    sys.exit(0 if success else 1)
