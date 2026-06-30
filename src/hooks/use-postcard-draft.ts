"use client";

import { useCallback, useEffect, useState } from "react";

export interface PostcardDraft {
  postcardId: string;
  postcardSlug: string;
  postcardName: string;
  imageUrl: string;
  message: string;
  signature: string;
  fontFamily: "SERIF" | "SANS" | "HANDWRITING" | "ELEGANT";
  textAlignment: "LEFT" | "CENTER" | "RIGHT";
  priceCents: number;
}

const STORAGE_KEY = "tichy-kout-draft";

const defaultDraft: PostcardDraft = {
  postcardId: "",
  postcardSlug: "",
  postcardName: "",
  imageUrl: "",
  message: "",
  signature: "",
  fontFamily: "HANDWRITING",
  textAlignment: "CENTER",
  priceCents: 8900,
};

export function usePostcardDraft() {
  const [draft, setDraftState] = useState<PostcardDraft>(defaultDraft);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDraftState({ ...defaultDraft, ...JSON.parse(stored) });
      }
    } catch {
      // ignore corrupt storage
    }
    setIsLoaded(true);
  }, []);

  const setDraft = useCallback((update: Partial<PostcardDraft>) => {
    setDraftState((prev) => {
      const next = { ...prev, ...update };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full
      }
      return next;
    });
  }, []);

  const clearDraft = useCallback(() => {
    setDraftState(defaultDraft);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasDraft = Boolean(draft.postcardId && draft.message.length >= 10);

  return { draft, setDraft, clearDraft, hasDraft, isLoaded };
}
