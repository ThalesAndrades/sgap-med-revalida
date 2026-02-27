import { Case, Finding, Simulation, KnowledgeTopic } from '../../types';
import { initialCases, initialFindings, initialTopics } from './seed';
import { externalTopics } from './externalSeed';

const STORAGE_KEYS = {
  CASES: 'sgap_cases',
  FINDINGS: 'sgap_findings',
  SIMULATIONS: 'sgap_simulations',
  TOPICS: 'sgap_topics',
};

class MockDB {
  constructor() {
    this.init();
  }

  private init() {
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

  async createSimulation(userId: string, caseId: string): Promise<Simulation> {
    return this.startSimulation(userId, caseId);
  }

  async updateSimulation(simId: string, updates: Partial<Simulation>): Promise<Simulation> {
    const simulations: Simulation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIMULATIONS) || '[]');
    const index = simulations.findIndex(s => s.id === simId);
    if (index !== -1) {
      simulations[index] = { ...simulations[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.SIMULATIONS, JSON.stringify(simulations));
      return simulations[index];
    }
    throw new Error('Simulation not found');
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

  // Aggregation Method
  async importExternalBases(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate fetching
    const currentTopics: KnowledgeTopic[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOPICS) || '[]');
    
    // Check duplicates
    const newTopics = externalTopics.filter(ext => !currentTopics.some(curr => curr.id === ext.id));
    
    if (newTopics.length > 0) {
      const updatedTopics = [...currentTopics, ...newTopics];
      localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(updatedTopics));
    }
    
    return newTopics.length;
  }
}

export const mockDB = new MockDB();
