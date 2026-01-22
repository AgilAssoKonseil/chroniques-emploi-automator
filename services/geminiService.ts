
import { GoogleGenAI, Type } from "@google/genai";
import { JobCategory, JobOffer, Territory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Recherche des offres sur plusieurs territoires (Cible : 15 offres pour plus de rapidité)
 */
export const fetchRealJobsWithSearch = async (
  territories: Territory[],
  partnerSources: string[] = []
): Promise<JobOffer[]> => {
  const territoryString = territories
    .map(t => `${t.city} (Rayon: ${t.radius}km)`)
    .join(", ");

  const sourcesText = partnerSources.length > 0 
    ? `Inclus également ces sources spécifiques : ${partnerSources.join(', ')}.` 
    : "Recherche EXCLUSIVEMENT sur le site candidat.francetravail.fr.";

  const prompt = `
    MISSION CRITIQUE : Extraire EXACTEMENT 15 offres d'emploi réelles au total (Priorité Qualité/Rapidité).
    PÉRIMÈTRE GÉOGRAPHIQUE : Tu dois chercher dans ces différentes zones : ${territoryString}.
    SOURCE PRIORITAIRE : candidat.francetravail.fr
    PÉRIMÈTRE TEMPOREL : Uniquement les offres publiées ces 5 derniers jours.
    
    ORDRE : Tri chronologique strict du plus récent au plus ancien.
    SOURCES : ${sourcesText}
    
    EXTRACTION : Titre, Employeur, Ville, Contrat, Date exacte (JJ/MM), URL directe.
  `;

  try {
    // Utilisation de Pro pour la recherche grounding (indispensable)
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              employer: { type: Type.STRING },
              location: { type: Type.STRING },
              contractType: { type: Type.STRING },
              url: { type: Type.STRING },
              date: { type: Type.STRING }
            },
            required: ["title", "employer", "location", "url", "date"]
          }
        }
      }
    });

    const rawJobs = JSON.parse(response.text || '[]');
    
    // On utilise Flash pour la catégorisation (vitesse maximale)
    const processedJobs: JobOffer[] = await Promise.all(rawJobs.slice(0, 15).map(async (job: any, index: number) => {
      const categoryData = await categorizeJob(job.title, job.employer, job.location);
      return {
        id: `job-${index}-${Date.now()}`,
        date: job.date,
        title: job.title,
        employer: job.employer,
        location: job.location,
        category: categoryData.category,
        contractType: job.contractType || "À préciser",
        summary: categoryData.summary,
        url: job.url,
        isFeatured: false,
        distanceFromPontvallain: 0,
        distanceFromLaFleche: 0
      };
    }));

    return processedJobs;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
};

/**
 * Génère les scripts radio
 */
export const generateRadioScripts = async (offers: JobOffer[], territorySummary: string): Promise<{ services: string, industrie: string, featuredIds: string[] }> => {
  const formatOffersForPrompt = (jobList: JobOffer[]) => 
    jobList.map(j => `ID:${j.id} | ${j.title} | ${j.employer} | ${j.location} | ${j.summary}`).join('\n');

  const prompt = `
    Rédige le script intégral d'une chronique radio de 3 MINUTES EXACTES (env. 500 mots).
    Territoire couvert : ${territorySummary}
    
    STRUCTURE :
    - Bloc 1 : Emploi – Services (1m30)
    - Bloc 2 : Emploi – Industrie (1m30)
    
    CONTENU :
    - Identifie les 4 meilleures offres (2 par bloc). Rédige pour elles un paragraphe narratif vivant.
    - Cite les autres offres de manière fluide.
    - Utilise des balises de respiration [PAUSE] pour l'animateur.
    
    DONNÉES :
    ${formatOffersForPrompt(offers)}

    STYLE : Ton chaleureux de radio locale, professionnel et dynamique. Mentionne bien la diversité géographique du territoire.
    
    Répond au format JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            services: { type: Type.STRING },
            industrie: { type: Type.STRING },
            featuredIds: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["services", "industrie", "featuredIds"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      services: data.services || "",
      industrie: data.industrie || "",
      featuredIds: data.featuredIds || []
    };
  } catch (error) {
    return { services: "Erreur de génération.", industrie: "Erreur de génération.", featuredIds: [] };
  }
};

/**
 * Flash est utilisé ici pour sa vitesse extrême
 */
export const categorizeJob = async (title: string, employer: string, location: string): Promise<{ category: JobCategory, summary: string }> => {
  const prompt = `Analyse : "${title}" à "${location}". Réponds en JSON : category (Emploi – Services ou Emploi – Industrie) et summary (2 lignes radio courtes).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: [JobCategory.SERVICES, JobCategory.INDUSTRIE] },
            summary: { type: Type.STRING }
          },
          required: ["category", "summary"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { category: JobCategory.SERVICES, summary: "Offre d'emploi locale." };
  }
};
