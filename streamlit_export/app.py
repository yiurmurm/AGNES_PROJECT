import streamlit as st
import pandas as pd
import json
import base64
from PIL import Image
import io
import time

# Import our complete data and functions from data.py
from data import PRODUCTS, CONDITIONS, INGREDIENT_DETAILS, TRADITIONAL_INGREDIENTS, get_remedy_recipe, NEWS_ITEMS

# Ensure layout is wide and clean
st.set_page_config(
    page_title="Agnes Skincare Sanctuary - Streamlit Port",
    page_icon="🪵",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS Injection to replicate the gorgeous editorial aesthetic: F9F6F2 bg, 2D423F/D18A6A brand colors
st.markdown("""
<style>
/* Base container and layout */
.stApp {
    background-color: #F9F6F2;
    color: #1C1C1C;
    font-family: 'Georgia', 'Playfair Display', serif;
}

/* Custom cards */
.sanctuary-card {
    background-color: #ffffff;
    border: 1px solid #E6DFD5;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(45, 66, 63, 0.03);
    transition: all 0.3s ease;
}
.sanctuary-card:hover {
    box-shadow: 0 6px 18px rgba(45, 66, 63, 0.07);
    border-color: #8B9474;
}

/* Header styled banner */
.header-banner {
    background-color: #2D423F;
    color: #FAF7F2;
    padding: 32px;
    border-radius: 8px;
    margin-bottom: 30px;
    text-align: center;
}
.header-banner h1 {
    font-family: 'Playfair Display', 'Georgia', serif;
    font-weight: 300;
    letter-spacing: -0.02em;
    font-size: 2.8rem;
    color: #FAF7F2 !important;
}

/* Accent labels */
.badge-category {
    background-color: #8B9474;
    color: #FAF7F2;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    padding: 4px 10px;
    border-radius: 20px;
    display: inline-block;
}
.badge-brand {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 600;
    color: #D18A6A;
}

/* Compatibility scores rendering */
.comp-score {
    font-size: 2.2rem;
    font-weight: 300;
    color: #2D423F;
    text-align: center;
}

/* Custom interactive inputs styling */
div.stButton > button {
    background-color: #1C1C1C;
    color: #ffffff;
    border: none;
    padding: 10px 24px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}
div.stButton > button:hover {
    background-color: #2D423F;
    color: #FAF7F2;
}

/* Custom back button style */
.back-btn-container {
    margin-bottom: 20px;
}

/* Slide up and push transitions mockup */
.animated-entry {
    animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
""", unsafe_allow_html=True)


# Initialize Session States comfortable for persistent in-memory operations
if "current_screen" not in st.session_state:
    st.session_state.current_screen = "welcome"

if "selected_product_id" not in st.session_state:
    st.session_state.selected_product_id = "prod_minimalist_b5"

if "user_profile" not in st.session_state:
    st.session_state.user_profile = {
        "name": "Sweet Agnes",
        "gender": "Female",
        "experienceLevel": "Regular User",
        "favoriteBrands": ["CeraVe", "The Ordinary"],
    }

if "quiz_state" not in st.session_state:
    st.session_state.quiz_state = {
        "faceFeel": None,
        "sensitivityLevel": 3,
        "bodyTexture": None,
        "bodyHydration": None,
        "lipFeel": None,
        "completed": False,
    }

if "donation_logs" not in st.session_state:
    st.session_state.donation_logs = []

if "morning_checks" not in st.session_state:
    st.session_state.morning_checks = {
        "Cleanse (Water wash)": False,
        "Hydrating Toner/Essence": False,
        "Treatment/Serum (Non-irritant)": False,
        "Barrier Moisturizer": False,
        "Mineral Sunscreen SPF 50+": False,
    }

if "evening_checks" not in st.session_state:
    st.session_state.evening_checks = {
        "Double Cleanse (Micellar/Oil)": False,
        "Soothing Hydrating Gel": False,
        "Rebuilding Lipid Barrier Fluid": False,
        "Chapped Lips Salve": False,
    }

if "mixing_bowl" not in st.session_state:
    st.session_state.mixing_bowl = []

if "scanned_results" not in st.session_state:
    st.session_state.scanned_results = None


# Helper function to compute matching product compatibility based on quiz metrics
def calculate_dynamic_compatibility(product, quiz):
    if not quiz or not quiz.get("completed", False):
        return product.get("compatibilityScore", 90) # Return database baseline default if quiz not complete
        
    suitability = product.get("skinTypeSuitability", {})
    face_feel = quiz.get("faceFeel")
    sensitivity = quiz.get("sensitivityLevel", 3)
    
    # Map faceFeel to skinTypeSuitability keys:
    # "Tight/flaky" -> trueDry
    # "Shiny/greasy" -> trueOily
    # "Shininess in T-zone, dry in cheeks" -> oilyDehydrated
    # "Comfortable" -> custom average
    suitability_key = "oilyDehydrated"
    if face_feel == "Tight/flaky":
        suitability_key = "trueDry" if sensitivity < 4 else "severelyDryDehydrated"
    elif face_feel == "Shiny/greasy":
        suitability_key = "trueOily"
    elif face_feel == "Shininess in T-zone, dry in cheeks":
        suitability_key = "oilyDehydrated"
    else:
        # Default or comfortable skin
        return 95 - (sensitivity * 2)

    base_score = suitability.get(suitability_key, 85)
    
    # Adjust score based on sensitivity
    if sensitivity >= 4:
        # Penalize if product has known irritants
        has_irritants = len(product.get("scannerFlags", {}).get("irritants", [])) > 0
        if has_irritants:
            base_score = max(30, base_score - 20)
        else:
            base_score = min(100, base_score + 2)
            
    # Adjust score for dry skins and body texture issues
    if quiz.get("bodyTexture") == "Rough/bumpy/strawberry" and product.get("id") == "prod_cetaphil_dam":
        base_score = min(100, base_score + 5)
        
    return int(base_score)


# Side panel controller providing user state summary, profile editing controls and navigation resets
def render_sidebar():
    with st.sidebar:
        st.markdown(f"### 🪵 Welcome, **{st.session_state.user_profile['name']}**")
        st.markdown("*Apothecary Level: Regular Caretaker*")
        
        # Micro profile widget
        st.info(f"""
        **Current Skin Chemistry:**
        - **Face State:** {st.session_state.quiz_state['faceFeel'] or 'Not Scanned (Quiz pending)'}
        - **Sensitivity:** {st.session_state.quiz_state['sensitivityLevel']}/5
        - **Body Moisture:** {st.session_state.quiz_state['bodyHydration'] or 'Unknown'}
        - **Brands Favored:** {", ".join(st.session_state.user_profile['favoriteBrands'])}
        """)
        
        st.markdown("---")
        st.markdown("### 🗝️ Quick Navigation Navigation")
        
        # Compact side navigation panel mimicking full React route transitions
        if st.button("🏛️ Main Sanctuary"):
            st.session_state.current_screen = "sanctuary"
            st.rerun()
            
        if st.button("🧪 Diagnostics & News"):
            st.session_state.current_screen = "diagnostics"
            st.rerun()

        if st.button("📝 Skin Chemistry Quiz"):
            st.session_state.current_screen = "quiz"
            st.rerun()

        if st.button("📸 Ingredient Label Scanner"):
            st.session_state.current_screen = "scan"
            st.rerun()

        if st.button("🗓️ Ritual Alignment"):
            st.session_state.current_screen = "ritual"
            st.rerun()
            
        if st.button("👤 Update Profile Setting"):
            st.session_state.current_screen = "personalize"
            st.rerun()

        st.markdown("---")
        if st.button("⚙️ Re-initialize Database & Reset Cached Cache"):
            st.session_state.current_screen = "welcome"
            st.session_state.quiz_state = {
                "faceFeel": None,
                "sensitivityLevel": 3,
                "bodyTexture": None,
                "bodyHydration": None,
                "lipFeel": None,
                "completed": False,
            }
            st.session_state.user_profile = {
                "name": "Sweet Agnes",
                "gender": "Female",
                "experienceLevel": "Regular User",
                "favoriteBrands": ["CeraVe", "The Ordinary"],
            }
            st.session_state.scanned_results = None
            st.session_state.mixing_bowl = []
            st.session_state.morning_checks = {k: False for k in st.session_state.morning_checks}
            st.session_state.evening_checks = {k: False for k in st.session_state.evening_checks}
            st.success("Database and local storage parameters re-initialized cleanly.")
            time.sleep(0.5)
            st.rerun()


# ==================== SCREEN 1: WELCOME SCREEN ====================
def render_welcome_screen():
    st.markdown("<div class='animated-entry'>", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.markdown("<div style='text-align: center; margin-top: 10%; margin-bottom: 50px;'>", unsafe_allow_html=True)
        st.markdown("<span style='font-family: Georgia, serif; font-size: 3rem; font-style: italic; color: #8B9474;'>Agnes.</span>", unsafe_allow_html=True)
        st.markdown("<h4 style='letter-spacing: 0.35em; font-size: 0.85rem; margin-top: 15px; color: #D18A6A;'>VOLUME I — THE APOTHECARY SANCTUARY</h4>", unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)
        
        st.markdown("""
        <div style="background-color: #ffffff; border: 1px solid #E6DFD5; padding: 40px; border-radius: 8px; text-align: center; box-shadow: 0 10px 30px rgba(45, 66, 63, 0.04);">
            <h1 style="font-family: 'Playfair Display', serif; font-weight: 300; font-size: 2.5rem; margin-bottom: 20px; color: #2D423F;">
                Your Skincare <span style="font-style: italic;">Sanctuary</span>
            </h1>
            <p style="font-size: 1.1rem; line-height: 1.8; color: #3A3A3A; font-style: italic; margin-bottom: 35px;">
                "A curated scientific space designed for your unique biological chemistry. Where advanced cosmetic science meets the comforting art of home-healing. Discover the formulas that speak to your soul and your skin barrier."
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("<div style='text-align: center; margin-top: 40px;'>", unsafe_allow_html=True)
        if st.button("Enter the Custom Sanctuary", key="enter_sanctuary_btn"):
            st.session_state.current_screen = "sanctuary"
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)
        
    st.markdown("</div>", unsafe_allow_html=True)


# ==================== SCREEN 2: MAIN DASHBOARD (SANCTUARY) ====================
def render_sanctuary_dashboard():
    render_sidebar()
    st.markdown("<div class='animated-entry'>", unsafe_allow_html=True)
    
    # Beautiful Header Banner
    st.markdown(f"""
    <div class="header-banner">
        <p style="letter-spacing: 0.3em; font-size: 0.8rem; text-transform: uppercase; color: #FAF7F2; opacity: 0.8;">The Agnes Shelf & Compounder</p>
        <h1>YOUR SKINCARE SANCTUARY</h1>
        <p style="font-style: italic; color: #FAF7F2; opacity: 0.9; font-size: 1.05rem;">
            "We build a personalized digital barrier matrix to guide you through complex formulas safely."
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Grid of Active Diagnostics/Stats
    st.markdown("### 📊 Live Diagnostic Insights")
    stat_col1, stat_col2, stat_col3, stat_col4 = st.columns(4)
    
    with stat_col1:
        st.markdown(f"""
        <div style="background-color: #2D423F; color: #FAF7F2; padding: 15px; border-radius: 6px; text-align: center;">
            <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px;">Active Profile</p>
            <h3 style="margin: 0; color: #FAF7F2;">{st.session_state.user_profile['name']}</h3>
        </div>
        """, unsafe_allow_html=True)
    with stat_col2:
        skin_state = st.session_state.quiz_state['faceFeel'] or "Pending Scan"
        st.markdown(f"""
        <div style="background-color: #ffffff; border: 1px solid #E6DFD5; padding: 15px; border-radius: 6px; text-align: center;">
            <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; color: #666;">Analysis Type</p>
            <h3 style="margin: 0; color: #2D423F;">{skin_state}</h3>
        </div>
        """, unsafe_allow_html=True)
    with stat_col3:
        sens_color = "#D18A6A" if st.session_state.quiz_state['sensitivityLevel'] >= 4 else "#8B9474"
        st.markdown(f"""
        <div style="background-color: #ffffff; border: 1px solid #E6DFD5; padding: 15px; border-radius: 6px; text-align: center;">
            <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; color: #666;">Sensitivity Tier</p>
            <h3 style="margin: 0; color: {sens_color};">{st.session_state.quiz_state['sensitivityLevel']}/5</h3>
        </div>
        """, unsafe_allow_html=True)
    with stat_col4:
        st.markdown(f"""
        <div style="background-color: #ffffff; border: 1px solid #E6DFD5; padding: 15px; border-radius: 6px; text-align: center;">
            <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; color: #666;">Catalog Loaded</p>
            <h3 style="margin: 0; color: #2D423F;">{len(PRODUCTS)} Products</h3>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("---")
    
    # Main Dashboard Workspace Selection tabs
    dashboard_tab, mixer_tab, path_tab = st.tabs([
        "🌿 Personalized Product Shelf", 
        "🥣 Traditional Apothecary Mortar Mixer", 
        "📖 Skin Pathology Dictionary"
    ])
    
    # TAB 1: PRODUCT SHELF
    with dashboard_tab:
        st.markdown("### Browse Personalized Products")
        st.markdown("We dynamically rank your skin's compatibility score using parameters retrieved from your Skin Quiz.")
        
        # Filtering Controls Grid
        filter_col1, filter_col2 = st.columns([1, 2])
        
        with filter_col1:
            st.markdown("##### Filter by Ritual Theme")
            category_options = ["All Rituals", "Nourishing Ritual", "Radiance Ritual", "Purifying Ritual", "Sun Protection"]
            selected_category = st.selectbox(
                "Filter Category",
                options=category_options
            )
            
        with filter_col2:
            st.markdown("##### Set Budget Constraint (₹)")
            budget_option = st.radio(
                "Price Limit Limits",
                options=["No Limit", "₹400 Limit", "₹500 Limit", "₹700 Limit"],
                horizontal=True
            )
            budget_val = 1500
            if budget_option == "₹400 Limit": budget_val = 400
            elif budget_option == "₹500 Limit": budget_val = 500
            elif budget_option == "₹700 Limit": budget_val = 700
            
        # Map products with computed pricing and matching score dynamically
        filtered_products = []
        for p in PRODUCTS:
            # Category match
            if selected_category != "All Rituals" and p["category"] != selected_category:
                continue
            # Budget match
            if p["price"] > budget_val:
                continue
            
            # Compute dynamic compatibility score based on current quiz
            dynamic_score = calculate_dynamic_compatibility(p, st.session_state.quiz_state)
            p_copy = p.copy()
            p_copy["computed_score"] = dynamic_score
            filtered_products.append(p_copy)
            
        # Rank by score descending
        filtered_products.sort(key=lambda x: x["computed_score"], reverse=True)
        
        # Render product grid
        if not filtered_products:
            st.warning("No products found matching your current active ritual filters and budget limits.")
        else:
            p_col1, p_col2, p_col3 = st.columns(3)
            for idx, prod in enumerate(filtered_products):
                # Distribute columns equally
                target_col = p_col1 if idx % 3 == 0 else (p_col2 if idx % 3 == 1 else p_col3)
                
                with target_col:
                    st.markdown(f"""
                    <div class="sanctuary-card">
                        <span class="badge-category">{prod['category']}</span>
                        <p class="badge-brand" style="margin-top: 10px; margin-bottom: 2px;">{prod['brand']}</p>
                        <h4 style="margin: 0; color: #1C1C1C; font-size: 1.15rem; line-height: 1.3; min-height: 52px;">{prod['name']}</h4>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; border-top: 1px solid #FAF7F2; padding-top: 15px;">
                            <div>
                                <span style="font-size: 0.8rem; color: #666; text-transform: uppercase;">Price</span>
                                <p style="font-weight: bold; font-size: 1.15rem; margin: 0; color: #2D423F;">₹{prod['price']}</p>
                            </div>
                            <div style="text-align: right;">
                                <span style="font-size: 0.8rem; color: #666; text-transform: uppercase;">Match</span>
                                <h4 style="color: {'#8B9474' if prod['computed_score'] >= 90 else '#D18A6A'}; margin: 0; font-size: 1.3rem;">{prod['computed_score']}%</h4>
                            </div>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    if st.button(f"🔍 Inspect {prod['brand']} Detailed Ingredients", key=f"inspect_{prod['id']}"):
                        st.session_state.selected_product_id = prod["id"]
                        st.session_state.current_screen = "product"
                        st.rerun()
                        
    # TAB 2: TRADITIONAL APOTHECARY MORTAR MIXER
    with mixer_tab:
        st.markdown("### 🥣 Ancient apothecary mortar mixing bowl")
        st.markdown("""
        Select organic compounds from ancient skincare medicine books. Mix up to 3 inside our virtual stoneware mortar to reveal their historic heritage recipe formulas and biological benefits.
        """)
        
        ingredients_selected = []
        mix_cols = st.columns(len(TRADITIONAL_INGREDIENTS))
        
        for index, ing in enumerate(TRADITIONAL_INGREDIENTS):
            with mix_cols[index]:
                # Custom selection states
                is_checked = st.checkbox(
                    f"{ing['icon']}\n{ing['name']}",
                    key=f"check_{ing['id']}",
                    value=(ing["id"] in st.session_state.mixing_bowl)
                )
                if is_checked:
                    ingredients_selected.append(ing["id"])
                    
        # Update session state list
        st.session_state.mixing_bowl = ingredients_selected[:3] # Cap to max 3
        if len(ingredients_selected) > 3:
            st.warning("Please restrict your mixture to 3 active raw herbs maximum so they blend safely in the mortar.")
            
        st.markdown("---")
        
        # Display mortar compound
        if len(st.session_state.mixing_bowl) > 0:
            recipe = get_remedy_recipe(st.session_state.mixing_bowl)
            
            st.markdown(f"""
            <div style="background-color: #FAF7F2; border: 2px dashed #8B9474; border-radius: 8px; padding: 25px; margin-top: 15px;">
                <span class="badge-category" style="background-color: #D18A6A;">Successful Compound Completed</span>
                <h2 style="font-family: 'Playfair Display', serif; color: #2D423F; margin-top: 15px; margin-bottom: 10px;">{recipe['title']}</h2>
                <p style="font-style: italic; color: #555; line-height: 1.6; margin-bottom: 15px;">"Heritage Record: {recipe['heritage']}"</p>
                <div style="background-color: #ffffff; border-radius: 6px; padding: 15px; border: 1px solid #E6DFD5;">
                    <p style="margin: 0;">🧬 <strong>Clinical Suitability & Benefits:</strong> {recipe['benefits']}</p>
                    <p style="margin: 10px 0 0 0;">🥣 <strong>How to Ritualize & Apply:</strong> {recipe['routine']}</p>
                </div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.info("Check boxes of up to 3 raw elements above to begin crushing them inside your stone apothecary bowl.")
            
    # TAB 3: SKIN PATHOLOGY ATLAS DICTIONARY 
    with path_tab:
        st.markdown("### 📖 Skincare Pathologies Atlas Catalog")
        st.markdown("Select a clinical skin pathology and consult official medicine reference books directly.")
        
        # Search filter
        search_path = st.text_input("🔍 Search conditions by name or symptoms...", "")
        
        matched_conditions = [c for c in CONDITIONS if search_path.lower() in c["name"].lower() or search_path.lower() in c["symptoms"].lower()]
        
        selected_cond_name = st.selectbox(
            "Select Condition to view Details",
            options=[c["name"] for c in matched_conditions] if matched_conditions else ["No matches found"]
        )
        
        # Display detail file card matching selected option
        target_cond = next((c for c in CONDITIONS if c["name"] == selected_cond_name), None)
        
        if target_cond:
            st.markdown(f"""
            <div style="background-color: #ffffff; border: 1px solid #E6DFD5; border-radius: 8px; padding: 30px; box-shadow: 0 4px 15px rgba(45,66,63,0.02)">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; color: #D18A6A;">Category: {target_cond['category']}</span>
                <h2 style="font-family: 'Playfair Display', serif; color: #2D423F; margin-top: 10px; margin-bottom: 15px;">{target_cond['name']}</h2>
                
                <h5 style="color: #1C1C1C; margin-bottom: 5px;">🔥 Surface Symptoms & Signs</h5>
                <p style="color: #4A4A4A; line-height: 1.5; margin-bottom: 20px;">{target_cond['symptoms']}</p>
                
                <h5 style="color: #1C1C1C; margin-bottom: 5px;">🔬 Modern Pathological Overview</h5>
                <p style="color: #4A4A4A; line-height: 1.5; margin-bottom: 20px;">{target_cond['clinicalOverview']}</p>
                
                <div style="padding: 15px; border-radius: 6px; background-color: #FAF7F2; margin-top: 15px;">
                    <p style="margin: 0; color: #2D423F;">🌿 <strong>Target Treatment Ingredients:</strong> {', '.join(target_cond['compatibleIngredients'])}</p>
                    <p style="margin: 10px 0 0 0; color: #B35243;">❌ <strong>Strictly Forbidden Elements:</strong> {', '.join(target_cond['forbiddenIngredients'])}</p>
                </div>
                
                <div style="border-left: 3px solid #8B9474; padding-left: 15px; margin-top: 20px; font-style: italic; color: #555;">
                     "Apothecary Note: {target_cond['apothecaryRitualNote']}"
                </div>
            </div>
            """, unsafe_allow_html=True)
            
    st.markdown("</div>", unsafe_allow_html=True)


# ==================== SCREEN 3: SKIN CHEMISTRY QUIZ ====================
def render_quiz_screen():
    render_sidebar()
    st.markdown("<div class='animated-entry'>", unsafe_allow_html=True)
    
    # Back button mimicking home routing
    if st.button("← Back to Main Sanctuary", key="back_from_quiz"):
        st.session_state.current_screen = "sanctuary"
        st.rerun()
        
    st.markdown("<div class='header-banner' style='background-color: #8B9474;'>", unsafe_allow_html=True)
    st.markdown("<p style='letter-spacing: 0.3em; font-size: 0.8rem; text-transform: uppercase; color: #FAF7F2;'>The Diagnostics Module</p>", unsafe_allow_html=True)
    st.markdown("<h1 style='color: #FAF7F2 !important; font-family: Playfair Display, serif;'>SKIN CHEMISTRY QUIZ</h1>", unsafe_allow_html=True)
    st.markdown("<p style='font-style: italic; color: #FAF7F2; opacity: 0.9;'>Identify structural barrier defects, seasonal lipid loss, and sensitivity parameters.</p>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
    st.markdown("### Answer the following diagnostic questions:")
    
    with st.form("skin_quiz_registration_form"):
        feel_opt = st.selectbox(
            "1. How does your face skin feel 2 hours after washing with a standard soap?",
            options=[
                "Tight/flaky",
                "Shiny/greasy",
                "Shininess in T-zone, dry in cheeks",
                "Comfortable"
            ]
        )
        
        sens_opt = st.slider(
            "2. Tactile Skin Sensitivity Metric (Specify degree of redness, itch, or burning to chemical compounds)",
            min_value=1,
            max_value=5,
            value=3,
            help="1 is structurally robust, 5 is chronic hypersensitive barrier damage"
        )
        
        body_tex_opt = st.selectbox(
            "3. Body Skin Texture Characterization",
            options=[
                "Rough/bumpy/strawberry",
                "Smooth",
                "Itchy patches"
            ]
        )
        
        body_hyd_opt = st.selectbox(
            "4. Body Water Hydration Category",
            options=[
                "Severely dry/scaly",
                "Normally hydrated"
            ]
        )
        
        lip_opt = st.selectbox(
            "5. Lip Surface and Boundary Seal",
            options=[
                "Chapped/cracked",
                "Smooth/healthy"
            ]
        )
        
        submit_quiz = st.form_submit_button("🧪 CALIBRATE SKIN CHEMISTRY PROFILE")
        
        if submit_quiz:
            st.session_state.quiz_state = {
                "faceFeel": feel_opt,
                "sensitivityLevel": sens_opt,
                "bodyTexture": body_tex_opt,
                "bodyHydration": body_hyd_opt,
                "lipFeel": lip_opt,
                "completed": True,
            }
            st.success("Calibration complete! Your Dynamic Compatibility ratings across the product catalog have been calibrated accordingly.")
            time.sleep(1)
            st.session_state.current_screen = "sanctuary"
            st.rerun()
            
    st.markdown("</div>", unsafe_allow_html=True)


# ==================== SCREEN 4: INGREDIENT LABEL SCANNER ====================
def render_scanner_screen():
    render_sidebar()
    st.markdown("<div class='animated-entry'>", unsafe_allow_html=True)
    
    if st.button("← Back to Main Sanctuary", key="back_from_scanner"):
        st.session_state.current_screen = "sanctuary"
        st.rerun()
        
    st.markdown("<div class='header-banner'>", unsafe_allow_html=True)
    st.markdown("<p style='letter-spacing: 0.3em; font-size: 0.8rem; text-transform: uppercase; color: #FAF7F2;'>The Scanning Lab</p>", unsafe_allow_html=True)
    st.markdown("<h1 style='color: #FAF7F2 !important; font-family: Playfair Display, serif;'>SKINCARE LABELS RECIPE SCANNER</h1>", unsafe_allow_html=True)
    st.markdown("<p style='font-style: italic; color: #FAF7F2; opacity: 0.9;'>Paste lists of cosmetic elements or snap an image of your product label to run safety rating assessments.</p>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Selection Mode for Scanner
    input_mode = st.radio("Choose Input Method", ["⌨️ Paste Ingredients List Text", "📸 Upload Labelling Photo (JSON Gemini OCR)"])
    
    if input_mode == "⌨️ Paste Ingredients List Text":
        ingredients_txt = st.text_area(
            "Paste full INCI cosmetic ingredients list (separated by commas):",
            "Aqua, Panthenol, Glycerin, Sodium Hyaluronate, Phenoxyethanol, Fragrance, Ethylhexylglycerin"
        )
        
        if st.button("🧪 RUN SAFETY CHEMICAL SCANNING"):
            # Clean paste parsing
            items = [i.strip() for i in ingredients_txt.replace("\n", ",").split(",") if i.strip()]
            
            # Simulated diagnostic assessment
            flagged_irritants = []
            flagged_humectants = []
            
            for item in items:
                # Direct check matching detail database
                cleaned = item.lower()
                if "fragrance" in cleaned or "parfum" in cleaned or "alcohol denat" in cleaned:
                    flagged_irritants.append((item, "Synthetic fragrance elements can trigger micro-flares in sensitive barriers."))
                elif "panthenol" in cleaned or "glycerin" in cleaned or "hyaluronate" in cleaned or "water" in cleaned or "aqua" in cleaned:
                    flagged_humectants.append(item)
                    
            st.session_state.scanned_results = {
                "productName": "Scanned Custom Formula",
                "scannedIngredients": items,
                "safetyRating": "Generally Safe" if len(flagged_irritants) == 0 else "Potential Sensitizer",
                "verdict": "This paste formulation has high moisturizing factors, but caution is advised for sensitive skins due to fragrance or stabilizer compounds present.",
                "potentialIrritants": [{"ingredient": i[0], "reason": i[1]} for i in flagged_irritants],
                "beneficialIngredients": [{"ingredient": h, "benefits": "Instantly binds localized water weights onto the epidermis."} for h in flagged_humectants]
            }
            
    else:
        st.markdown("##### Upload Product Label Photo")
        uploaded_file = st.file_uploader("Snap or select image file", type=["png", "jpg", "jpeg"])
        
        if uploaded_file is not None:
            # Render selected asset preview
            image = Image.open(uploaded_file)
            st.image(image, caption="Uploaded Skincare Label Target.", width=300)
            
            # Setup base64 conversion for Gemini payload proxy
            buffered = io.BytesIO()
            image.save(buffered, format="JPEG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            
            if st.button("🚀 REQUEST GEMINI-3.5-FLASH AI OCR ANALYZER"):
                # Run complete visual progress bar
                with st.spinner("Decoding image pixel grids with Agnes AI..."):
                    time.sleep(1.5)
                    
                # To maintain standalone compatibility, we verify if API keys exist.
                # If they do, we use google-genai, otherwise we present a beautiful structured fallback analysis!
                api_key = st.secrets.get("GEMINI_API_KEY", None)
                if api_key:
                    try:
                        from google import genai
                        from google.genai import types
                        
                        client = genai.Client(api_key=api_key)
                        
                        ocr_prompt = """
                        Analyze this skincare product ingredient label.
                        Identify and parse naming lists, suitability indexes, safety ratings, verdicts, specific irritants, and active beneficial properties.
                        """
                        
                        # Request schema structures exactly matching server.ts specs
                        response = client.models.generate_content(
                            model="gemini-3.5-flash",
                            contents=[
                                types.Part.from_bytes(data=buffered.getvalue(), mime_type="image/jpeg"),
                                ocr_prompt
                            ],
                            config=types.GenerateContentConfig(
                                response_mime_type="application/json",
                                temperature=0.2
                            )
                        )
                        
                        raw_json = json.loads(response.text)
                        st.session_state.scanned_results = raw_json
                        st.success("Successfully completed Gemini AI Scanning analysis!")
                        
                    except Exception as e:
                        st.error(f"Failed to query local Gemini library: {str(e)}. Proceeding with high-fidelity Simulated Fallback.")
                        api_key = None
                        
                if not api_key:
                    # Fallback structural mock assessment
                    st.session_state.scanned_results = {
                        "productName": "Spotted Botanicals Cream",
                        "scannedIngredients": ["Aqua", "Panthenol", "Glycerin", "Ceramide NP", "Squalane", "Citrus Lemon Peel Oil"],
                        "safetyRating": "Potential Sensitizer",
                        "verdict": "This parsed custom formula contains key lipids and skin repair ingredients, but CITRUS oil components create high risk for solar photo-toxicity flags.",
                        "potentialIrritants": [
                            {"ingredient": "Citrus Lemon Peel Oil", "reason": "Citrus oils behave as strong phototoxins when exposed directly to sunlight waves."}
                        ],
                        "beneficialIngredients": [
                            {"ingredient": "Ceramide NP", "benefits": "Seals intercellular cracks in the lipid bilayer barrier."},
                            {"ingredient": "Squalane", "benefits": "Silky skin emollient mimic."}
                        ]
                    }
                    st.info("Demonstration fallback analysis loaded successfully.")
                    
    # Display scanner outcome cards
    if st.session_state.scanned_results:
        res = st.session_state.scanned_results
        st.markdown(f"""
        <div style="background-color: #ffffff; border: 1px solid #E6DFD5; padding: 25px; border-radius: 8px; margin-top: 30px;">
            <p style="text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em; color: #D18A6A; margin: 0;">Scanner Report Card</p>
            <h2 style="font-family: 'Playfair Display', serif; color: #2D423F; margin-top: 8px;">{res.get('productName', 'Scanned Formula')}</h2>
            
            <div style="display: flex; gap: 15px; margin: 15px 0;">
                <span class="badge-category" style="background-color: {'#8B9474' if 'Safe' in res.get('safetyRating','') else '#D18A6A'};">
                    Rating: {res.get('safetyRating', 'Review')}
                </span>
            </div>
            
            <p style="line-height: 1.6; color: #555;"><strong>Verdict:</strong> {res.get('verdict', '')}</p>
            
            <h5 style="margin-top: 20px;">📜 Detected Raw Ingredients:</h5>
            <p style="font-family: monospace; background-color: #FAF7F2; padding: 10px; border-radius: 4px; font-size: 0.85rem; color: #444;">
                {", ".join(res.get('scannedIngredients', []))}
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        # Grid of detailed Beneficial elements and Irritant warnings
        grid_col1, grid_col2 = st.columns(2)
        with grid_col1:
            st.markdown("##### ✅ Highly Beneficial Ingredients")
            for item in res.get("beneficialIngredients", []):
                st.markdown(f"""
                <div style="padding: 10px; border-left: 3px solid #8B9474; margin-bottom: 10px; background-color: #ffffff; border-radius: 0 4px 4px 0; border-top: 1px solid #FAF7F2; border-right: 1px solid #FAF7F2; border-bottom: 1px solid #FAF7F2;">
                    <strong>{item['ingredient']}</strong>: {item['benefits']}
                </div>
                """, unsafe_allow_html=True)
                
        with grid_col2:
            st.markdown("##### ⚠️ Flagged Potential Irritants")
            irritants = res.get("potentialIrritants", [])
            if not irritants:
                st.write("Zero irritants flagged in scanning safety bounds.")
            else:
                for item in irritants:
                    st.markdown(f"""
                    <div style="padding: 10px; border-left: 3px solid #B35243; margin-bottom: 10px; background-color: #ffffff; border-radius: 0 4px 4px 0; border-top: 1px solid #FAF7F2; border-right: 1px solid #FAF7F2; border-bottom: 1px solid #FAF7F2;">
                        <strong style="color: #B35243;">{item['ingredient']}</strong>: {item['reason']}
                    </div>
                    """, unsafe_allow_html=True)
                    
    st.markdown("</div>", unsafe_allow_html=True)


# ==================== SCREEN 5: PRODUCT DETAILED INSIGHTS ====================
def render_product_insights_screen():
    render_sidebar()
    st.markdown("<div class='animated-entry'>", unsafe_allow_html=True)
    
    if st.button("← Back to Main Sanctuary", key="back_from_insights"):
        st.session_state.current_screen = "sanctuary"
        st.rerun()
        
    p_id = st.session_state.selected_product_id
    prod = next((p for p in PRODUCTS if p["id"] == p_id), PRODUCTS[0])
    
    # Calculate score
    score = calculate_dynamic_compatibility(prod, st.session_state.quiz_state)
    
    st.markdown(f"""
    <div style="background-color: #ffffff; border: 1px solid #E6DFD5; border-radius: 8px; padding: 35px; box-shadow: 0 4px 15px rgba(0,0,0,0.015);">
        <span class="badge-category">{prod['category']}</span>
        <span class="badge-brand" style="margin-left: 15px;">{prod['brand']}</span>
        <h1 style="font-family: 'Playfair Display', serif; color: #2D423F; margin-top: 15px; margin-bottom: 25px;">{prod['name']}</h1>
    </div>
    """, unsafe_allow_html=True)
    
    main_col1, main_col2 = st.columns([1, 1.5])
    
    with main_col1:
        st.image(prod["imgUrl"], caption=prod["name"], use_container_width=True)
        st.markdown(f"""
        <div style="background-color: #FAF7F2; border: 1px dashed #D18A6A; padding: 20px; border-radius: 6px; text-align: center; margin-top: 20px;">
            <p style="text-uppercase: uppercase; font-size: 11px; color: #666; margin: 0;">Calculated Chemistry Match Rating</p>
            <h1 style="font-family: 'Playfair Display', serif; font-size: 3.5rem; color: #2D423F; margin: 5px 0;">{score}%</h1>
            <p style="font-size: 0.9rem; font-style: italic; color: #333;">Mapped automatically using your current active Quiz answers.</p>
        </div>
        """, unsafe_allow_html=True)
        
    with main_col2:
        st.markdown(f"""
        <div style="border-left: 3px solid #8B9474; padding-left: 20px; font-style: italic; font-size: 1.15rem; color: #444; margin-bottom: 30px; line-height: 1.6;">
            {prod['quote']}
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("### 📋 Product Ingredients dictionary")
        for ingredient_elem in prod.get("ingredientsDictionary", []):
            st.markdown(f"""
            <div style="background-color: #ffffff; border-bottom: 1px solid #FAF7F2; padding: 12px 0;">
                <p style="margin: 0; font-size: 1.05rem;">🧬 <strong style="color: #2D423F;">{ingredient_elem['ingredient']}</strong></p>
                <p style="margin: 4px 0 0 24px; color: #555; font-size: 0.95rem; line-height: 1.5;">{ingredient_elem['function']}</p>
            </div>
            """, unsafe_allow_html=True)
            
        st.markdown("---")
        
        # Display Dermatologist Expert Panel
        st.markdown(f"""
        <div style="background-color: #FAF7F2; border: 1px solid #E6DFD5; border-radius: 8px; padding: 25px; margin-top: 30px; display: flex; align-items: flex-start; gap: 20px;">
            <img src="{prod['expertAvatar']}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #8B9474;" />
            <div>
                <span class="badge-category" style="background-color: #D18A6A;">Expert Advisory Board Review</span>
                <h4 style="margin: 8px 0 2px 0; color: #2D423F;">{prod['expertName']}</h4>
                <p style="font-size: 0.8rem; text-transform: uppercase; color: #555; margin-bottom: 15px;">{prod['expertRole']}</p>
                <p style="font-style: italic; line-height: 1.6; color: #333; margin: 0;">"{prod['expertReview']}"</p>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("</div>", unsafe_allow_html=True)


# ==================== SCREEN 6: DAILY RITUAL ALIGNMENT ====================
def render_ritual_screen():
    render_sidebar()
    st.markdown("<div class='animated-entry'>", unsafe_allow_html=True)
    
    if st.button("← Back to Main Sanctuary", key="back_from_ritual"):
        st.session_state.current_screen = "sanctuary"
        st.rerun()
        
    st.markdown("<div class='header-banner' style='background-color: #C97D54;'>", unsafe_allow_html=True)
    st.markdown("<p style='letter-spacing: 0.3em; font-size: 0.8rem; text-transform: uppercase; color: #FAF7F2;'>The Scheduler Coordinator</p>", unsafe_allow_html=True)
    st.markdown("<h1 style='color: #FAF7F2 !important; font-family: Playfair Display, serif;'>DAILY RITUAL ALIGNMENT CHECKLIST</h1>", unsafe_allow_html=True)
    st.markdown("<p style='font-style: italic; color: #FAF7F2; opacity: 0.9;'>Stay consistent with your daily morning protecting shields and night replenishing locks.</p>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Custom safety warning if sensitivity is high
    if st.session_state.quiz_state["sensitivityLevel"] >= 4:
        st.warning("⚠️ **High sensitivity alert** configured! Keep chemical acid products spaced back completely list.")
        
    col_morning, col_evening = st.columns(2)
    
    with col_morning:
        st.markdown("### 🌅 Morning Protect Rituals")
        st.markdown("Apply structural protective filters and hydration envelopes before environmental exposure.")
        
        for k in list(st.session_state.morning_checks.keys()):
            st.session_state.morning_checks[k] = st.checkbox(
                k,
                value=st.session_state.morning_checks[k],
                key=f"morning_{k.replace(' ', '_')}"
            )
            
    with col_evening:
        st.markdown("### 🌃 Evening Rebuilding Rituals")
        st.markdown("Remove surface pollutants, accelerate skin cell restoration, and lock lipid levels deep.")
        
        for k in list(st.session_state.evening_checks.keys()):
            st.session_state.evening_checks[k] = st.checkbox(
                k,
                value=st.session_state.evening_checks[k],
                key=f"evening_{k.replace(' ', '_')}"
            )
            
    # Calculate Completion rate
    total_items = len(st.session_state.morning_checks) + len(st.session_state.evening_checks)
    completed_items = sum(st.session_state.morning_checks.values()) + sum(st.session_state.evening_checks.values())
    completion_rate = int((completed_items / total_items) * 100) if total_items > 0 else 0
    
    st.markdown("---")
    st.markdown(f"### Current Daily Completion Progress: **{completion_rate}%**")
    st.progress(completion_rate / 100)
    
    if completion_rate == 100:
        st.balloons()
        st.success("Magnificent progress! Today's structural barrier cycles have been fully met.")
        
    st.markdown("</div>", unsafe_allow_html=True)


# ==================== SCREEN 7: CLINICAL DIAGNOSTICS & DONATIONS ====================
def render_diagnostics_screen():
    render_sidebar()
    st.markdown("<div class='animated-entry'>", unsafe_allow_html=True)
    
    if st.button("← Back to Main Sanctuary", key="back_from_diagnostics"):
        st.session_state.current_screen = "sanctuary"
        st.rerun()
        
    st.markdown("<div class='header-banner' style='background-color: #2D423F;'>", unsafe_allow_html=True)
    st.markdown("<p style='letter-spacing: 0.3em; font-size: 0.8rem; text-transform: uppercase; color: #FAF7F2;'>The Medical Registry Division</p>", unsafe_allow_html=True)
    st.markdown("<h1 style='color: #FAF7F2 !important; font-family: Playfair Display, serif;'>CLINICAL DIAGNOSTICS & RESEARCH</h1>", unsafe_allow_html=True)
    st.markdown("<p style='font-style: italic; color: #FAF7F2; opacity: 0.9;'>Read peer-reviewed biological breakthroughs and support charity Golden Years Elder Care.</p>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
    news_col, donation_col = st.columns([1.5, 1])
    
    with news_col:
        st.markdown("### 🔬 Recent Skin Biology Breakthroughs")
        for article in NEWS_ITEMS:
            st.markdown(f"""
            <div style="background-color: #ffffff; border: 1px solid #E6DFD5; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.015);">
                <span class="badge-category" style="font-size: 9px;">{article['source']}</span>
                <span style="font-size: 0.8rem; color: #666; margin-left: 15px;">Published: {article['time']} — {article['author']}</span>
                <h4 style="font-family: 'Playfair Display', serif; color: #2D423F; margin-top: 10px; margin-bottom: 12px;">{article['title']}</h4>
                <p style="color: #444; line-height: 1.6; font-size: 0.95rem;">{article['description']}</p>
                <a href="{article['url']}" target="_blank" style="color: #D18A6A; font-weight: bold; text-decoration: none; font-size: 0.9rem;">Consult Original Clinical Papers →</a>
            </div>
            """, unsafe_allow_html=True)
            
    with donation_col:
        st.markdown("### 💝 Compassionate Tiny Donation Box")
        st.markdown("""
        "We believe healing skin is only part of our mission. Restoring local community safety nets is the true pillar of longevity."
        
        Support **Golden Years Elder Care**, funding physical therapy, nutritional support, and care items for seniors.
        """)
        
        # Exact updated pricing models: ₹5, ₹10, ₹20, ₹50, custom
        preset_options = ["₹5", "₹10", "₹20", "₹50", "Custom Amount"]
        preset_sel = st.radio("Choose Donation Amount Preset (INR)", options=preset_options, horizontal=True)
        
        donation_val = 20 # Default matching previous React fix (setDonationAmount(20))
        if preset_sel == "₹5": donation_val = 5
        elif preset_sel == "₹10": donation_val = 10
        elif preset_sel == "₹20": donation_val = 20
        elif preset_sel == "₹50": donation_val = 50
        else:
            donation_val = st.number_input("Enter Custom Amount (₹)", min_value=1, max_value=10000, value=20)
            
        donor_name = st.text_input("Your Dignified Donor Name", "Sweet Agnes")
        
        if st.button("💝 DEPOSIT COMPASSIONATE AID"):
            log_str = f"Thank you {donor_name}! Logged successful compassionate contribution of ₹{donation_val} to Golden Years Elder Care. ❤️"
            st.session_state.donation_logs.append(log_str)
            st.success(log_str)
            
        if st.session_state.donation_logs:
            st.markdown("##### Recent Commendable Contributions:")
            for item in st.session_state.donation_logs[-5:]: # View last 5
                st.info(item)
                
    st.markdown("</div>", unsafe_allow_html=True)


# ==================== SCREEN 8: EDIT PROFILE (PERSONALIZE) ====================
def render_personalize_screen():
    render_sidebar()
    st.markdown("<div class='animated-entry'>", unsafe_allow_html=True)
    
    if st.button("← Back to Main Sanctuary", key="back_from_personalize"):
        st.session_state.current_screen = "sanctuary"
        st.rerun()
        
    st.markdown("<div class='header-banner' style='background-color: #2D423F;'>", unsafe_allow_html=True)
    st.markdown("<h1 style='color: #FAF7F2 !important; font-family: Playfair Display, serif;'>PERSONALIZE YOUR APOTHECARY PROFILE</h1>", unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)
    
    p_name = st.text_input("Caretaker Name", value=st.session_state.user_profile["name"])
    p_gender = st.selectbox("Preferred Gender Identity Label", options=["Female", "Male", "Non-Binary", "Prefer Not to Say"], index=["Female", "Male", "Non-Binary", "Prefer Not to Say"].index(st.session_state.user_profile["gender"]))
    p_level = st.selectbox("Apothecary Skincare Experience level", options=["Beginner", "Regular User", "Skincare Aficionado"], index=["Beginner", "Regular User", "Skincare Aficionado"].index(st.session_state.user_profile["experienceLevel"]))
    
    # Custom list for brand tagging
    p_brands = st.multiselect("Favorite skincare Brands", options=["CeraVe", "The Ordinary", "Minimalist", "The Derma Co", "Dot & Key", "Sebamed", "Re'equil", "Neutrogena", "Cetaphil", "Fixderma", "WishCare", "Conscious Chemist", "Suganda", "Plum", "Dr. Sheth's"], default=st.session_state.user_profile["favoriteBrands"])
    
    if st.button("🌿 SAVE APOTHECARY SETTINGS"):
        st.session_state.user_profile = {
            "name": p_name,
            "gender": p_gender,
            "experienceLevel": p_level,
            "favoriteBrands": p_brands,
        }
        st.success("Caretaker profile details saved securely.")
        time.sleep(0.5)
        st.session_state.current_screen = "sanctuary"
        st.rerun()
        
    st.markdown("</div>", unsafe_allow_html=True)


# ==================== MAIN ROUTER SWITCHER ====================
def main():
    if st.session_state.current_screen == "welcome":
        render_welcome_screen()
    elif st.session_state.current_screen == "sanctuary":
        render_sanctuary_dashboard()
    elif st.session_state.current_screen == "quiz":
        render_quiz_screen()
    elif st.session_state.current_screen == "scan":
        render_scanner_screen()
    elif st.session_state.current_screen == "product":
        render_product_insights_screen()
    elif st.session_state.current_screen == "ritual":
        render_ritual_screen()
    elif st.session_state.current_screen == "diagnostics":
        render_diagnostics_screen()
    elif st.session_state.current_screen == "personalize":
        render_personalize_screen()

if __name__ == '__main__':
    main()
