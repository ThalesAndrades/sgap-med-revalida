import { User, Case, Finding, Simulation, AuthResponse, KnowledgeTopic } from '../../types';
import { initialCases, initialFindings, initialUsers, initialTopics } from './seed';

const STORAGE_KEYS = {
  USERS: 'sgap_users',
  CASES: 'sgap_cases',
  FINDINGS: 'sgap_findings',
  SIMULATIONS: 'sgap_simulations',
  TOPICS: 'sgap_topics',
  CURRENT_USER: 'sgap_current_user',
};

class MockDB {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CASES)) {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(initialCases));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FINDINGS)) {
      localStorage.setItem(STORAGE_KEYS.FINDINGS, JSON.stringify(initialFindings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TOPICS)) {
      localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(initialTopics));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SIMULATIONS)) {
      localStorage.setItem(STORAGE_KEYS.SIMULATIONS, JSON.stringify([]));
    }
  }

  // Auth Methods
  async login(crm: string, password: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // For prototype, password check is simplified or skipped if just testing
    // In a real mock, we'd check hash. Here we just check CRM for demo.
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.crm_provisory === crm);

    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return { user, token: 'mock-jwt-token-123', error: undefined };
    }

    return { user: null, token: null, error: 'Credenciais inválidas' };
  }

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  }

  // Data Methods
  async getCases(): Promise<Case[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CASES) || '[]');
  }

  async getCaseById(id: string): Promise<Case | undefined> {
    const cases = await this.getCases();
    return cases.find(c => c.id === id);
  }

  async getFindingsByCaseId(caseId: string): Promise<Finding[]> {
    const allFindings: Finding[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FINDINGS) || '[]');
    return allFindings.filter(f => f.case_id === caseId).sort((a, b) => a.display_order - b.display_order);
  }

  async startSimulation(userId: string, caseId: string): Promise<Simulation> {
    const simulations: Simulation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIMULATIONS) || '[]');
    const newSim: Simulation = {
      id: crypto.randomUUID(),
      user_id: userId,
      case_id: caseId,
      start_time: new Date().toISOString(),
      status: 'in_progress',
    };
    simulations.push(newSim);
    localStorage.setItem(STORAGE_KEYS.SIMULATIONS, JSON.stringify(simulations));
    return newSim;
  }

  async completeSimulation(simId: string, score: number, feedback: any): Promise<Simulation> {
    const simulations: Simulation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIMULATIONS) || '[]');
    const index = simulations.findIndex(s => s.id === simId);
    if (index !== -1) {
      simulations[index] = {
        ...simulations[index],
        end_time: new Date().toISOString(),
        status: 'completed',
        score,
        feedback
      };
      localStorage.setItem(STORAGE_KEYS.SIMULATIONS, JSON.stringify(simulations));
      return simulations[index];
    }
    throw new Error('Simulation not found');
  }
  
  async getUserSimulations(userId: string): Promise<Simulation[]> {
    const simulations: Simulation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIMULATIONS) || '[]');
    return simulations.filter(s => s.user_id === userId).sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  }

  // Knowledge Base Methods
  async getTopics(): Promise<KnowledgeTopic[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TOPICS) || '[]');
  }

  async searchTopics(query: string): Promise<KnowledgeTopic[]> {
    const topics = await this.getTopics();
    const lowerQuery = query.toLowerCase();
    return topics.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) || 
      t.summary.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

export const mockDB = new MockDB();
