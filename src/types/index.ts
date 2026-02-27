export type UserRole = 'candidate' | 'examiner' | 'admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  created_at?: string;
  last_access?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  onboarding_completed: boolean;
  focus_areas: string[];
  daily_goal_minutes?: number;
}

export interface Case {
  id: string;
  title: string;
  specialty: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  description: string;
  expected_diagnosis: string[];
  expected_conduct: string[];
  time_limit: number;
  is_active: boolean;
}

export interface Finding {
  id: string;
  case_id: string;
  finding_type: 'anamnesis' | 'physical_exam' | 'complementary_exam';
  description: string;
  is_critical: boolean;
  display_order: number;
  response_audio_url?: string;
  response_text: string;
}

export interface Simulation {
  id: string;
  user_id: string;
  case_id: string;
  start_time: string;
  end_time?: string;
  score?: number;
  status: 'in_progress' | 'completed' | 'aborted';
  feedback?: SimulationFeedback[];
}

export interface SimulationFeedback {
  criterion: string;
  achieved: boolean;
  examiner_note: string;
  points: number;
}

export interface AuthResponse {
  user: User | null;
  token: string | null;
  error?: string;
}

// Knowledge Base Types
export interface KnowledgeTopic {
  id: string;
  title: string;
  category: string; // e.g., 'Cardiologia', 'Pediatria'
  tags: string[];
  summary: string;
  content_type: 'mnemonic' | 'flowchart' | 'protocol' | 'concept';
  content: {
    steps?: string[]; // For flowcharts/protocols
    explanation?: string; // For concepts
    items?: { key: string; value: string }[]; // For mnemonics
  };
  references: string[]; // e.g., 'PCDT 2024', 'UpToDate'
}
