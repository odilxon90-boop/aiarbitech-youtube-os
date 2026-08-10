export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}
export interface OnboardingStatus {
  userId: string;
  completedStepIds: readonly string[];
  progress: number;
  complete: boolean;
  recommendations: readonly string[];
}
const steps: readonly OnboardingStep[] = [
  ['profile', 'Create your profile', 'Add your creator identity and preferences.'],
  ['goal', 'Choose your goal', 'Select Revenue, Brand, Media, or Education.'],
  ['experience', 'Set experience level', 'Choose Beginner, Intermediate, Professional, or Enterprise.'],
  ['niche', 'Choose your niche', 'Select Video, Music, Shorts, or Education.'],
  ['recommendations', 'Review AI recommendations', 'Review mock recommendations for your choices.'],
  ['channel', 'Create your channel', 'Create a mock channel workspace.'],
  ['google', 'Connect Google', 'Confirm mock Google connection.'],
  ['readiness', 'Run AI readiness audit', 'Review a mock readiness audit.'],
  ['project', 'Create your first project', 'Create a mock content project.'],
].map(([id, title, description]) => ({ id: id!, title: title!, description: description! }));
const userStepData = new Map<string, Map<string, Record<string, unknown>>>();

export class OnboardingService {
  steps(): readonly OnboardingStep[] { return steps; }
  submitStep(userId: string, stepId: string, data: Record<string, unknown>): OnboardingStatus {
    if (!steps.some((step) => step.id === stepId)) throw new Error(`Onboarding step ${stepId} was not found.`);
    const entries = userStepData.get(userId) ?? new Map<string, Record<string, unknown>>();
    entries.set(stepId, data);
    userStepData.set(userId, entries);
    return this.status(userId);
  }
  status(userId: string): OnboardingStatus {
    const completedStepIds = [...(userStepData.get(userId)?.keys() ?? [])];
    return {
      userId, completedStepIds, progress: Math.round((completedStepIds.length / steps.length) * 100),
      complete: completedStepIds.length === steps.length,
      recommendations: [
        'Mock recommendation: begin with a focused weekly content cadence.',
        'Mock recommendation: use the AI Quality Gate before publishing.',
        'Mock recommendation: create a short-form pilot project first.',
      ],
    };
  }
  complete(userId: string): OnboardingStatus {
    const status = this.status(userId);
    if (!status.complete) throw new Error('All nine onboarding steps must be completed before completion.');
    return status;
  }
}
