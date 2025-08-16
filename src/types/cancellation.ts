export type FlowStep = 
  | 'initial' 
  | 'downsell' 
  | 'downsell_completed' 
  | 'job_recommendations' 
  | 'survey' 
  | 'reason_selection' 
  | 'congrats' 
  | 'feedback' 
  | 'visa' 
  | 'completed';

export type DownsellVariant = 'A' | 'B';

export interface CancellationFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MockUser {
  id: string;
  email: string;
}

export interface MockSubscription {
  id: string;
  user_id: string;
  monthly_price: number;
  status: string;
}

export interface StepInfo {
  step: number;
  total: number;
}

export interface CancellationFlowState {
  currentStep: FlowStep;
  foundJobWithMigrateMate: boolean | null;
  rolesApplied: number | null;
  companiesEmailed: number | null;
  companiesInterviewed: number | null;
  feedback: string;
  hasImmigrationLawyer: boolean | null;
  visaType: string;
  rolesAppliedSurvey: string | null;
  companiesEmailedSurvey: string | null;
  companiesInterviewedSurvey: string | null;
  downsellVariant: DownsellVariant | null;
  acceptedDownsell: boolean | null;
  cancellationReason: string | null;
  reasonFollowUpText: string;
  hasFoundJob: boolean;
}

export const CANCELLATION_REASONS = [
  'Too expensive',
  'Platform not helpful',
  'Not enough relevant jobs',
  'Decided not to move',
  'Other'
] as const;

export type CancellationReason = typeof CANCELLATION_REASONS[number];
