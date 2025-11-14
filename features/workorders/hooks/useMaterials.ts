// features/workorders/hooks/useMaterials.ts
// Material Selection Hook
// Compliant met prompt.git: Max 200 regels

import { useState, useMemo } from 'react';
import type { MaterialSelection, MaterialSearchState } from '../types';
import {
  addMaterial as addMaterialService,
  removeMaterial as removeMaterialService,
  checkMaterialsAvailability,
} from '../services';
import { validateMaterial, isMaterialDuplicate } from '../utils';
import { filterInventoryForMaterials, filterCategories } from '../utils/filters';
import type { InventoryItem, InventoryCategory } from '../types';

interface UseMaterialsProps {
  inventory: InventoryItem[];
  categories: InventoryCategory[];
}

export const useMaterials = ({ inventory, categories }: UseMaterialsProps) => {
  const [materials, setMaterials] = useState<MaterialSelection[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  const [searchState, setSearchState] = useState<MaterialSearchState>({
    searchTerm: '',
    categoryFilter: '',
    categorySearchTerm: '',
    showCategoryDropdown: false,
  });

  // Filtered inventory based on search/filters
  const filteredInventory = useMemo(() => {
    return filterInventoryForMaterials(
      inventory,
      searchState.searchTerm,
      searchState.categoryFilter,
      categories
    );
  }, [inventory, searchState.searchTerm, searchState.categoryFilter, categories]);

  // Filtered categories for dropdown
  const filteredCategories = useMemo(() => {
    return filterCategories(categories, searchState.categorySearchTerm);
  }, [categories, searchState.categorySearchTerm]);

  // Add material
  const addMaterial = (): boolean => {
    const error = validateMaterial(selectedId, selectedQty);
    if (error) {
      alert(error);
      return false;
    }

    if (isMaterialDuplicate(materials, selectedId)) {
      alert('Dit materiaal is al toegevoegd');
      return false;
    }

    setMaterials((prev) => addMaterialService(prev, selectedId, selectedQty));
    setSelectedId('');
    setSelectedQty(1);
    return true;
  };

  // Remove material
  const removeMaterial = (materialId: string) => {
    setMaterials((prev) => removeMaterialService(prev, materialId));
  };

  // Check availability
  const checkAvailability = () => {
    return checkMaterialsAvailability(inventory, materials);
  };

  // Update search state
  const updateSearch = <K extends keyof MaterialSearchState>(
    field: K,
    value: MaterialSearchState[K]
  ) => {
    setSearchState((prev) => ({ ...prev, [field]: value }));
  };

  // Reset search
  const resetSearch = () => {
    setSearchState({
      searchTerm: '',
      categoryFilter: '',
      categorySearchTerm: '',
      showCategoryDropdown: false,
    });
  };

  // Reset all
  const reset = () => {
    setMaterials([]);
    setSelectedId('');
    setSelectedQty(1);
    resetSearch();
  };

  return {
    materials,
    setMaterials,
    selectedId,
    setSelectedId,
    selectedQty,
    setSelectedQty,
    searchState,
    updateSearch,
    resetSearch,
    filteredInventory,
    filteredCategories,
    addMaterial,
    removeMaterial,
    checkAvailability,
    reset,
  };
};
