import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  FlowStep, 
  DownsellVariant, 
  CancellationFlowState 
} from '@/types/cancellation';
import { calculateVariantFromUserId, getDownsellPrice } from '@/utils/cancellation';
// import { MOCK_USER } from '@/constants/cancellation';

interface CancellationContextType extends CancellationFlowState {
  // Navigation
  setCurrentStep: (step: FlowStep) => void;
  goBack: () => void;
  // Persistence helpers
  startCancellation: () => Promise<void>;
  updateCancellation: (updates: Record<string, unknown>) => Promise<void>;
  markPendingCancellation: () => Promise<void>;
  getDownsellDisplay: () => { originalPrice: number; downsellPrice: number };
  
  // State setters
  setFoundJobWithMigrateMate: (value: boolean | null) => void;
  setRolesApplied: (value: number | null) => void;
  setCompaniesEmailed: (value: number | null) => void;
  setCompaniesInterviewed: (value: number | null) => void;
  setFeedback: (value: string) => void;
  setHasImmigrationLawyer: (value: boolean | null) => void;
  setVisaType: (value: string) => void;
  setRolesAppliedSurvey: (value: string | null) => void;
  setCompaniesEmailedSurvey: (value: string | null) => void;
  setCompaniesInterviewedSurvey: (value: string | null) => void;
  setAcceptedDownsell: (value: boolean | null) => void;
  setCancellationReason: (value: string | null) => void;
  setReasonFollowUpText: (value: string) => void;
  setHasFoundJob: (value: boolean) => void;
  
  // Computed values
  getDownsellVariant: () => DownsellVariant;
  resetState: () => void;
}

const CancellationContext = createContext<CancellationContextType | undefined>(undefined);

export const useCancellationContext = () => {
  const context = useContext(CancellationContext);
  if (!context) {
    throw new Error('useCancellationContext must be used within CancellationProvider');
  }
  return context;
};

interface CancellationProviderProps {
  children: React.ReactNode;
}

export const CancellationProvider: React.FC<CancellationProviderProps> = ({ children }) => {
  // Initial state
  const [currentStep, setCurrentStep] = useState<FlowStep>('initial');
  const [foundJobWithMigrateMate, setFoundJobWithMigrateMate] = useState<boolean | null>(null);
  const [rolesApplied, setRolesApplied] = useState<number | null>(null);
  const [companiesEmailed, setCompaniesEmailed] = useState<number | null>(null);
  const [companiesInterviewed, setCompaniesInterviewed] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [hasImmigrationLawyer, setHasImmigrationLawyer] = useState<boolean | null>(null);
  const [visaType, setVisaType] = useState('');
  const [rolesAppliedSurvey, setRolesAppliedSurvey] = useState<string | null>(null);
  const [companiesEmailedSurvey, setCompaniesEmailedSurvey] = useState<string | null>(null);
  const [companiesInterviewedSurvey, setCompaniesInterviewedSurvey] = useState<string | null>(null);
  const [downsellVariant, setDownsellVariant] = useState<DownsellVariant | null>(null);
  const [acceptedDownsell, setAcceptedDownsell] = useState<boolean | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string | null>(null);
  const [reasonFollowUpText, setReasonFollowUpText] = useState('');
  const [hasFoundJob, setHasFoundJob] = useState<boolean>(false);
  const [cancellationId, setCancellationId] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [subscriptionPriceCents, setSubscriptionPriceCents] = useState<number | null>(null);
  
  // Declare startCancellation first, then use inside getDownsellVariant
  const getDownsellVariantRef = React.useRef<() => DownsellVariant>(() => 'A');
  const getDownsellVariant = useCallback((): DownsellVariant => getDownsellVariantRef.current(), []);

  // Persist: start cancellation when variant decided
  const [userId, setUserId] = useState<string | null>(null);
  // Fetch first user + subscription on mount
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/users/first');
        const j = await res.json();
        if (j?.user?.id) setUserId(j.user.id);
        if (j?.subscription?.id) setSubscriptionId(j.subscription.id);
        if (typeof j?.subscription?.monthly_price === 'number') setSubscriptionPriceCents(j.subscription.monthly_price);
      } catch {}
    })();
  }, []);

  const startCancellation = useCallback(async () => {
    if (!downsellVariant || !userId) return;
    try {
      const res = await fetch('/api/cancellations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, downsell_variant: downsellVariant })
      });
      const json = await res.json();
      if (json?.cancellation?.id) setCancellationId(json.cancellation.id);
      if (json?.cancellation?.subscription_id) setSubscriptionId(json.cancellation.subscription_id);
    } catch {}
  }, [downsellVariant, userId]);

  const updateCancellation = useCallback(async (updates: Record<string, unknown>) => {
    if (!cancellationId) return;
    try {
      await fetch('/api/cancellations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cancellationId, ...updates })
      });
    } catch {}
  }, [cancellationId]);

  const markPendingCancellation = useCallback(async () => {
    if (!subscriptionId) return;
    try {
      await fetch('/api/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: subscriptionId, pending_cancellation: true })
      });
    } catch {}
  }, [subscriptionId]);

  const getDownsellDisplay = useCallback(() => {
    const cents = subscriptionPriceCents ?? 2500;
    return {
      originalPrice: Math.round(cents / 100),
      downsellPrice: getDownsellPrice(cents)
    };
  }, [subscriptionPriceCents]);

  // Now define the actual variant getter to set variant and start record once
  React.useEffect(() => {
    getDownsellVariantRef.current = () => {
      if (downsellVariant) return downsellVariant;
      // Dev-only override via ?force_variant=A|B or localStorage 'mm_force_variant'
      let forced: 'A' | 'B' | null = null;
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        const qs = new URLSearchParams(window.location.search);
        const qsv = qs.get('force_variant');
        const lsv = window.localStorage.getItem('mm_force_variant');
        const cand = (qsv || lsv || '').toUpperCase();
        if (cand === 'A' || cand === 'B') {
          forced = cand as 'A' | 'B';
          // persist for the session
          window.localStorage.setItem('mm_force_variant', forced);
        }
      }

      const variant = (forced || calculateVariantFromUserId(userId || 'seed-user')) as DownsellVariant;
      setDownsellVariant(variant);
      // fire and forget start
      startCancellation();
      return variant;
    };
  }, [downsellVariant, startCancellation, userId]);
  
  const goBack = useCallback(() => {
    switch (currentStep) {
      case 'congrats':
        setCurrentStep('initial');
        break;
      case 'downsell':
        setCurrentStep('initial');
        break;
      case 'feedback':
        setCurrentStep('congrats');
        break;
      case 'visa':
        setCurrentStep('feedback');
        break;
      case 'survey':
        setCurrentStep('downsell');
        break;
      case 'reason_selection':
        setCurrentStep('survey');
        break;
      case 'completed': {
        // If user came from Not yet flow, go back to reason selection
        if (cancellationReason) {
          setCurrentStep('reason_selection');
        } else if (hasFoundJob || foundJobWithMigrateMate !== null) {
          // Yes flow: go back to visa (previous screen before completion)
          setCurrentStep('visa');
        } else {
          setCurrentStep('initial');
        }
        break;
      }
      default:
        setCurrentStep('initial');
    }
  }, [currentStep, cancellationReason, hasFoundJob, foundJobWithMigrateMate]);
  
  const resetState = useCallback(() => {
    setCurrentStep('initial');
    setFoundJobWithMigrateMate(null);
    setRolesApplied(null);
    setCompaniesEmailed(null);
    setCompaniesInterviewed(null);
    setFeedback('');
    setHasImmigrationLawyer(null);
    setVisaType('');
    setRolesAppliedSurvey(null);
    setCompaniesEmailedSurvey(null);
    setCompaniesInterviewedSurvey(null);
    setDownsellVariant(null);
    setAcceptedDownsell(null);
    setCancellationReason(null);
    setReasonFollowUpText('');
  }, []);
  
  const handleSetCancellationReason = useCallback((value: string | null) => {
    setCancellationReason(value);
    if (value !== cancellationReason) {
      setReasonFollowUpText(''); // Reset follow-up text when reason changes
    }
  }, [cancellationReason]);
  
  const value: CancellationContextType = {
    // State
    currentStep,
    foundJobWithMigrateMate,
    rolesApplied,
    companiesEmailed,
    companiesInterviewed,
    feedback,
    hasImmigrationLawyer,
    visaType,
    rolesAppliedSurvey,
    companiesEmailedSurvey,
    companiesInterviewedSurvey,
    downsellVariant,
    acceptedDownsell,
    cancellationReason,
    reasonFollowUpText,
    hasFoundJob,
    // local id (not exposed in types; used internally)
    
    // Actions
    setCurrentStep,
    goBack,
    startCancellation,
    updateCancellation,
    markPendingCancellation,
    getDownsellDisplay,
    setFoundJobWithMigrateMate,
    setRolesApplied,
    setCompaniesEmailed,
    setCompaniesInterviewed,
    setFeedback,
    setHasImmigrationLawyer,
    setVisaType,
    setRolesAppliedSurvey,
    setCompaniesEmailedSurvey,
    setCompaniesInterviewedSurvey,
    setAcceptedDownsell,
    setCancellationReason: handleSetCancellationReason,
    setReasonFollowUpText,
    getDownsellVariant,
    resetState,
    setHasFoundJob
  };
  
  return (
    <CancellationContext.Provider value={value}>
      {children}
    </CancellationContext.Provider>
  );
};
