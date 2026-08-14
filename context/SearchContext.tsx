"use client";

import React, { createContext, useContext, useRef, useState } from "react";

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  tryClaimResultsHeader: () => boolean;
  hasOpenAccordion: boolean;
  updateAccordionState: (id: string, hasOpen: boolean) => void;
  hasSearchResults: boolean;
  updateSearchResults: (id: string, hasResults: boolean) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a <SearchProvider />");
  }
  return context;
};

export const SearchProvider: React.FC<{ lang?: string; children: React.ReactNode }> = ({
  children,
}) => {
  const [searchQuery, setSearchQueryState] = useState("");
  const resultsHeaderClaimedRef = useRef(false);
  const openAccordionIds = useRef<Set<string>>(new Set());
  const [hasOpenAccordion, setHasOpenAccordion] = useState(false);
  const accordionResultIds = useRef<Set<string>>(new Set());
  const [hasSearchResults, setHasSearchResults] = useState(false);

  const isSearching = searchQuery.trim().length >= 2;

  const setSearchQuery = (query: string) => {
    resultsHeaderClaimedRef.current = false;
    setSearchQueryState(query);
  };

  const tryClaimResultsHeader = (): boolean => {
    if (!resultsHeaderClaimedRef.current) {
      resultsHeaderClaimedRef.current = true;
      return true;
    }
    return false;
  };

  const updateAccordionState = (id: string, hasOpen: boolean) => {
    if (hasOpen) openAccordionIds.current.add(id);
    else openAccordionIds.current.delete(id);
    setHasOpenAccordion(openAccordionIds.current.size > 0);
  };

  const updateSearchResults = (id: string, hasResults: boolean) => {
    if (hasResults) accordionResultIds.current.add(id);
    else accordionResultIds.current.delete(id);
    setHasSearchResults(accordionResultIds.current.size > 0);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        isSearching,
        tryClaimResultsHeader,
        hasOpenAccordion,
        updateAccordionState,
        hasSearchResults,
        updateSearchResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
