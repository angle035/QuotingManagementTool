export interface MaterialCosting {
  materialDescription: string;
  costPerSellingUnit: number;
}

export interface Costing {
  firstCost: number;
  componentMaterialCosting: MaterialCosting[];
}

export interface Supplier {
  name: string;
}

export interface FobPort {
  countryOfOrigin: string;
}

export interface ClubCosting {
  retailPrice: number;
}

export interface Quote {
  id: string;
  quoteName: string;
  itemName: string;
  itemDescription: string;
  quoteDate: string;
  committedFlag: boolean;
  supplier: Supplier;
  fobPort: FobPort;
  costing: Costing;
  clubCosting: ClubCosting;
}

export interface EditableQuote extends Quote {
  isEditing?: boolean;
  hasUnsavedChanges?: boolean;
  editedFields?: {
    quoteDate?: string;
    firstCost?: number;
    retailPrice?: number;
    committedFlag?: boolean;
  };
}
