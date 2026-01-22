
import { 
  JobOffer, 
  JobCategory 
} from "../types";
import { 
  PONTVALLAIN_COORDS, 
  LA_FLECHE_COORDS, 
  RADIUS_PONTVALLAIN, 
  RADIUS_LA_FLECHE,
  MOCK_JOBS_TITLES,
  MOCK_EMPLOYERS,
  COMMUNES
} from "../constants";
import { categorizeJob } from "./geminiService";

// Helper for distance
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Simulate France Travail API search
export const fetchAndFilterJobs = async (): Promise<JobOffer[]> => {
  const offers: JobOffer[] = [];
  const today = new Date();

  // Generate some realistic fake data
  for (let i = 0; i < 15; i++) {
    const title = MOCK_JOBS_TITLES[Math.floor(Math.random() * MOCK_JOBS_TITLES.length)];
    const employer = MOCK_EMPLOYERS[Math.floor(Math.random() * MOCK_EMPLOYERS.length)];
    const location = COMMUNES[Math.floor(Math.random() * COMMUNES.length)];
    
    // Random fake coordinates around Sarthe
    const lat = 47.7 + (Math.random() - 0.5) * 0.3;
    const lng = 0.1 + (Math.random() - 0.5) * 0.3;

    const dPont = getDistance(lat, lng, PONTVALLAIN_COORDS.lat, PONTVALLAIN_COORDS.lng);
    const dFleche = getDistance(lat, lng, LA_FLECHE_COORDS.lat, LA_FLECHE_COORDS.lng);

    // Apply geographic filters
    const isInRange = dPont <= RADIUS_PONTVALLAIN || dFleche <= RADIUS_LA_FLECHE;

    if (isInRange) {
      // Use Gemini to categorize and summarize
      const { category, summary } = await categorizeJob(title, employer, location);
      
      const pubDate = new Date(today);
      pubDate.setDate(today.getDate() - Math.floor(Math.random() * 7));

      // Fix: Added the missing 'isFeatured' property required by the JobOffer interface.
      offers.push({
        id: `ft-${Math.random().toString(36).substr(2, 9)}`,
        date: pubDate.toLocaleDateString('fr-FR'),
        title,
        employer,
        location,
        category,
        contractType: Math.random() > 0.5 ? "CDI" : "CDD 6 mois",
        workingHours: "Temps plein",
        summary,
        url: "https://candidat.pole-emploi.fr/offres/recherche/detail/123XYZ",
        isFeatured: false,
        distanceFromPontvallain: dPont,
        distanceFromLaFleche: dFleche
      });
    }
  }

  // Deduplicate and sort by date
  return offers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
