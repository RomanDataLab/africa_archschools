# Website URL Updates Log

## Date: November 27, 2025

### Summary
Updated and corrected website URLs for institutions with problematic or outdated links.

### Changes Made:

#### 1. **Methodist University of Angola**
- **Old URL:** `https://www.uma.co.ao`
- **New URL:** `https://www.uma.ao`
- **Reason:** Simplified domain (removed .co subdomain)

#### 2. **Université Omar Bongo (UOB), Gabon**
- **Old URL:** `https://www.uob.ga`
- **New URL:** `http://www.uob-uog.ga`
- **Reason:** Updated to full institutional domain name

#### 3. **Central University, Ghana**
- **Old URL:** `https://central.edu.gh`
- **New URL:** `https://www.central.edu.gh`
- **Reason:** Added www subdomain for consistency

#### 4. **Technical University of Kenya**
- **Old URL:** `https://tuk.ac.ke`
- **New URL:** `https://www.tukenya.ac.ke`
- **Reason:** Updated to full institutional domain

#### 5. **University of Liberia**
- **Old Name:** University of Monrovia - Built Environment (Liberia)
- **New Name:** University of Liberia - Built Environment
- **URL:** `https://www.ul.edu.lr` (unchanged)
- **Reason:** Corrected institution name (located in Monrovia but named University of Liberia)

#### 6. **Universidade Jean Piaget, Mozambique**
- **Old URL:** `https://www.jeanpiaget.ucm.ac.mz`
- **New URL:** `https://www.upiaget.cv`
- **Reason:** Updated to current institutional website

### Files Updated:
1. `African_Architecture_Schools_expanded.csv`
2. `src/data.ts`

### Notes:
- Several institutions in Gabon use .ga TLD which can be unstable
- HTTP protocol maintained where HTTPS is not available
- All changes preserve original latitude/longitude coordinates

### Testing:
The map application will automatically reload with updated URLs when the development server detects changes.

