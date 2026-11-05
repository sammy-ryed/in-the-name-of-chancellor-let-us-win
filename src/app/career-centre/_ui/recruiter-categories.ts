// Editorial browsing groups, not SRM's offer or recruitment classifications.
export const recruiterCategories = {
  "Technology & IT": ["accolite", "Affinsys", "Akamai", "amadeus", "amazon", "cognizant", "Dell", "fis", "fiserv", "hashed_in", "hcl", "hewlett_Packard", "hp", "hyperverge", "ibm", "infosys", "intel", "junglee_games", "juspay", "ltimindtree", "microsoft", "nokia", "Oracle", "PayPal", "pinelabs-1", "redbus", "rich_panel", "Sabre", "sap", "sophos", "tata_technologies", "tcs", "ui_path", "unisys", "valuelabs", "verizon", "volante", "western_digital", "wipro"],
  "Consulting": ["accenture", "capgemini", "deloitte", "ey", "pwc", "zs", "Pharma_Ace"],
  "Finance": ["wells_fargo", "Bajaj_Finserv", "bank_of_america", "barclays", "bny", "federal_bank", "hsbc", "jp_morgan", "morgan_stanley", "mufg", "Natwest", "societe_generale", "standard_charted", "Sundaram"],
  "Data & analytics": ["Forma_Ai", "fractal", "latent_view", "miq", "mu_sigma", "quantiphi"],
  "Engineering & industry": ["abb", "aditya-birla", "Afcons", "Alstom", "anand", "ather", "cummins", "daimler_truck", "ford", "godrej", "havells", "hindustan", "hitachi", "honda", "honeywell", "hyundai", "john_deere", "jsw", "Kubota", "l_and_t", "linde", "LT", "maersk", "maruthi", "polycab", "reliance", "renault-nissan", "royal_enfield", "saint_gobain", "Sanmar", "Schneider", "Shell", "siemens", "sobha_constructions", "tata_power", "tvs", "varroc", "ve_commercial_vehicles", "vedanta", "volvo", "wabtec", "yamaha", "zf_group"],
  "Healthcare": ["afford_medical", "AstraZeneca", "johnson", "Optum", "philips", "Zifo"],
} as const;
export type RecruiterCategory = "All companies" | keyof typeof recruiterCategories;
export function matchesCategory(file: string, category: RecruiterCategory) {
  return category === "All companies" || (recruiterCategories[category] as readonly string[]).includes(file);
}
