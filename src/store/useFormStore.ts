import { create } from 'zustand';
import { CreateProductPayload, UpdateStorePayload } from '@/types';

interface FormState {
  // Product form draft
  productDraft: Partial<CreateProductPayload> | null;
  setProductDraft: (draft: Partial<CreateProductPayload>) => void;
  clearProductDraft: () => void;

  // Store settings draft
  storeDraft: Partial<UpdateStorePayload> | null;
  setStoreDraft: (draft: Partial<UpdateStorePayload>) => void;
  clearStoreDraft: () => void;

  // Form state
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;

  // Auto-save timestamp
  lastAutoSave: Date | null;
  setLastAutoSave: (date: Date) => void;
}

export const useFormStore = create<FormState>((set) => ({
  // Product draft
  productDraft: null,
  setProductDraft: (draft) => set({ productDraft: draft, isDirty: true }),
  clearProductDraft: () => set({ productDraft: null, isDirty: false }),

  // Store draft
  storeDraft: null,
  setStoreDraft: (draft) => set({ storeDraft: draft, isDirty: true }),
  clearStoreDraft: () => set({ storeDraft: null, isDirty: false }),

  // Form state
  isDirty: false,
  setIsDirty: (dirty) => set({ isDirty: dirty }),

  // Auto-save
  lastAutoSave: null,
  setLastAutoSave: (date) => set({ lastAutoSave: date }),
}));