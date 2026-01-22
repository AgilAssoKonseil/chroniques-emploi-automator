
export enum JobCategory {
  SERVICES = 'Emploi – Services',
  INDUSTRIE = 'Emploi – Industrie',
}

export interface Territory {
  id: string;
  city: string;
  radius: number;
}

export interface JobOffer {
  id: string;
  date: string;
  title: string;
  employer: string;
  location: string;
  category: JobCategory;
  contractType: string;
  workingHours?: string;
  summary: string;
  url: string;
  isFeatured: boolean;
  distanceFromPontvallain: number;
  distanceFromLaFleche: number;
}

export interface DailyAutomationResult {
  date: string;
  offers: JobOffer[];
  scriptServices: string;
  scriptIndustrie: string;
  status: 'idle' | 'running' | 'completed' | 'error';
}

export interface LocationCoords {
  lat: number;
  lng: number;
}
