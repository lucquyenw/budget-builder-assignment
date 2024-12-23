export interface Category {
    name: string;
    inputs: number[];
}

export interface ParentCategory {
    category: Category;
    categories: Category[];
    totals: number[];
}

export interface RootCategory {
    name: string;
    parentCategories: ParentCategory[];
    totals: number[];
}

export interface MonthlyBalance {
    profitAndLoss: number;
    openingBalance: number;
    closingBalance: number;
}