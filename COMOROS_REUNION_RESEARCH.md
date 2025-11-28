# Comoros & Réunion Architecture Schools Research

## Date: November 28, 2025

## 🔍 Research Summary

### 🏝️ Réunion (French Territory)
**Status:** ✅ **1 School Found**

#### École nationale supérieure d'architecture de La Réunion (ENSA La Réunion)
- **Location:** Le Port, Réunion Island
- **Coordinates:** -20.94, 55.29
- **Website:** https://www.lareunion-archi.fr
- **Type:** National School of Architecture (France)
- **Status:** France's 21st National School of Architecture
- **Special Features:**
  - Only architecture school in French overseas territories
  - Officially established as autonomous institution in March 2025
  - Previously operated as branch of École nationale supérieure d'architecture de Montpellier since 1988
  - New state-of-the-art campus under construction (completion expected 2027)
  - €13.35 million facility designed as a "climate machine" with bioclimatic features
  - Focus on "Architecture, City, and Territory in Tropical Environments"
- **Programs:** 
  - Diplôme d'État d'Architecte (Master's degree equivalent)
  - Future doctoral programs planned

---

### 🇰🇲 Comoros
**Status:** ❌ **No Architecture Schools Found**

- **University of Comoros (Moroni):** Offers programs in engineering and science, but **no architecture program**
- **Situation:** Students interested in architecture typically study abroad in:
  - Madagascar
  - Mauritius
  - Réunion
  - Mainland Africa

---

## 📊 Dataset Updates

### Files Updated:
1. ✅ `African_Architecture_Schools_expanded.csv` - Added ENSA La Réunion
2. ✅ `src/data.ts` - Added school entry
3. ✅ `src/africa-outline.ts` - Added Réunion coordinates to buffer zone
4. ✅ `src/main.ts` - Integrated Réunion into buffer creation
5. ✅ `index.html` - Updated statistics (147 schools, 53 regions)

### New Totals:
- **Schools:** 147 (was 146)
- **Countries/Regions:** 53 (was 52)

---

## 🗺️ Map Integration

### Réunion Buffer Zone
- Coordinates: `[55.2, -21.4], [55.9, -21.4], [55.9, -20.8], [55.2, -20.8]`
- Integrated into 200-mile buffer zone
- Voronoi diagram now extends to cover Réunion

---

## 🔑 Bonus: Environment Variable Support

### New Feature Added
- **Mapbox Token:** Now supports environment variables!
- **Configuration:** Updated `src/config.ts` to use `VITE_MAPBOX_TOKEN` env var
- **Fallback:** Hardcoded token still works if env var not set
- **Type Safety:** Added `src/vite-env.d.ts` for TypeScript support

### How to Use (Optional):
```bash
# Local development - create .env.local
VITE_MAPBOX_TOKEN=your_token_here

# Vercel (optional) - add environment variable:
# Settings → Environment Variables → Add VITE_MAPBOX_TOKEN
```

---

## 🚀 Deployment Status

### ✅ Changes Committed & Pushed
- Commit: `Add ENSA La Réunion + environment variable support for Mapbox token`
- Branch: `main`
- Repository: https://github.com/RomanDataLab/africa_archschools.git

### 🎯 Ready for Vercel Deployment
All TypeScript builds successfully. Ready to deploy! 🚀

---

## 📝 Notes

1. **ENSA La Réunion** is a significant addition - it's the **only architecture school in the Indian Ocean** that's part of the French national education system.

2. **Comoros** has no architecture programs, which is consistent with many smaller island nations in the region.

3. The school's focus on **tropical architecture** makes it particularly relevant for African and island contexts.

4. The new campus (2027) will showcase **bioclimatic design principles**, making it an educational facility and demonstration project in one.

---

## 🔍 Sources Consulted
- École nationale supérieure d'architecture de La Réunion official website
- French Wikipedia (ENSA La Réunion article)
- University of Comoros faculty listings
- Commonwealth Association of Architects database
- Regional education ministries

