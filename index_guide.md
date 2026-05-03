# ATOM `index.html` Structure Guide

Since `index.html` is quite large (~978 lines), this document breaks down the file section by section. Whenever you need to make changes, look up the relevant feature here to find its exact line numbers before diving into the code.

## 1. Document Head & CSS Styles (Lines 1 - 322)
*This section contains all the styling and metadata for the website. No HTML content is presented here, just CSS definitions.*
- **Lines 1 - 25**: HTML document setup, meta tags, Google Fonts imports, and core CSS Variables (Brand colors, typography, spacing).
- **Lines 26 - 116**: Global Utility Classes (`.section-label`, `.btn-primary`, `.reveal` animation classes) and Navigation Bar CSS.
- **Lines 117 - 150**: CSS for the Hero (Top banner) section and layout rules.
- **Lines 151 - 294**: CSS targeting all internal site sections (Marquee, About, Earthy banner, Catalog grid, Process flow, Corporate gifting, Team, and Footer).
- **Lines 295 - 320**: Responsive Media Queries (`@media(max-width:...)`). Modifies styles for mobile and tablet views.

## 2. Navigation Bar (Lines 323 - 346)
- Contains the exact HTML for the site `<nav>`. 
- Includes the ATOM SVG logo and five main links: About, Catalog, Our Process, Corporate Gifts, Enquire. 
- Includes the mobile menu hamburger button.

## 3. Hero / Main Landing Section (Lines 348 - 369)
- The first visual section when users land. 
- Headline: *"Design Your Calm Space."*
- Contains main paragraph summary, two call-to-action buttons (Explore Catalog, Corporate Gifting), and the three bottom metric stats (25+ Designs, 100% Handcrafted, Custom).

## 4. Brand Marquee Strip (Lines 371 - 381)
- The infinitely scrolling horizontal text strip containing brand phrases like "Handcrafted Planters", "Premium Gifting", "Made in Pune".

## 5. About ATOM Section (Lines 383 - 420)
- Elaborates on the brand identity. Contains a left-side image visual.
- Headline: *"More than a planter brand."*
- Lists three core brand pillars: **01. Premium Aesthetics**, **02. Emotional Resonance**, and **03. Implicit Sustainability**. 

## 6. Earthy Banner Strip (Lines 422 - 427)
- A small image break containing the text *"Living decor that grows with you."* Used simply as a visual separator in the page.

## 7. Product Catalog (Lines 428 - 711)
- The largest HTML section, housing all individual products broken down into categories.
- **Lines 430 - 442**: Category filtering tabs (Anime, Desi/Hindi, Love & Aesthetic, etc.).
- **Lines 444 - 703**: The actual product cards. 
  - To change a specific category, look here:
    - **Anime Product Cards**: Lines 445 - 480 (Naruto, Luffy, Gojo)
    - **Desi/Hindi Product Cards**: Lines 482 - 530 (Bhukkad, Padhaku, etc.)
    - **Love & Aesthetic Cards**: Lines 531 - 603 (LOVE Heart, No Bad Vibes, Main Character, CHILL, XO, etc.)
    - **Pop Culture Cards**: Lines 604 - 652 (Arctic Monkeys, Error 4:04, F1, NYC, etc.)
    - **Nature & Art Cards**: Lines 653 - 689 (Sunflower styles, Japanese Street)
    - **Custom Product Example**: Lines 690 - 702 (Kalakar Example)
- **Lines 705 - 710**: Footer call-to-action for the catalog promoting custom designs.

## 8. Development Process (Lines 713 - 750)
- Dark section explaining the 4-step manufacturing pipeline: **01. Design/Concept**, **02. Mould/Material**, **03. Print/Cure**, and **04. Quality/Ship**.

## 9. Corporate Gifting (Lines 752 - 798)
- Targeted specifically at B2B clientele. Includes an image and the headline *"Corporate Gifting Redefined."*
- Features three main bullet points: Custom Branding, Bulk Fulfillment, and Event/HR Gifting.

## 10. The Team (Lines 800 - 828)
- Short visual grid showcasing the ATOM founding team.
- Profiles: Atharv Jagtap (Founder), Kaushal Pawar (Partner), Ayush Chavan (Partner).

## 11. Contact & Enquiry Form (Lines 830 - 892)
- Side-by-side dark layout.
- **Left Side (830 - 865)**: Physical contact details (Phone number, Instagram tag, Location).
- **Right Side (866 - 892)**: The Enquiry `<form>` inputs (Name, Phone number, Type of Enquiry Dropdown, Message Textbox, and Submit Button).

## 12. Footer (Lines 894 - 910)
- Contains the bottom page copyright string, site logo, and the clickable Instagram page link.

## 13. JavaScript Logic (Lines 912 - 978)
*The dynamic functions running the interactions on the website.*
- **Lines 913-920**: `goTo(id)` smooth scrolling functionality.
- **Lines 922-926**: Logic to shrink the navbar border padding on scroll.
- **Lines 928-935**: IntersectionObserver. Triggers the CSS `.reveal` animations as elements enter the viewport.
- **Lines 937-947**: Product Catalog Filtering. Hides and displays catalog items based on which button is clicked.
- **Lines 949-963**: Logic for opening/closing the mobile dropdown nav.
- **Lines 965-975**: Captures data from the contact form and formats it into a direct WhatsApp message URL when clicking the form submit button.
