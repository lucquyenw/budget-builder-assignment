import { computed, Injectable, input, signal } from "@angular/core";
import { DropdownOption } from "../interfaces/dropdown.interface";
import { MonthlyBalance, RootCategory } from "../interfaces/budget-table.interface";

@Injectable({
    providedIn: 'root'
})
export class BudgetTableSerivice {
    months = signal<DropdownOption[]>([
        { value: '0', text: 'Jan' },
        { value: '1', text: 'Feb' },
        { value: '2', text: 'Mar' },
        { value: '3', text: 'Apr' },
        { value: '4', text: 'May' },
        { value: '5', text: 'Jun' },
        { value: '6', text: 'Jul' },
        { value: '7', text: 'Aug' },
        { value: '8', text: 'Sep' },
        { value: '9', text: 'Oct' },
        { value: '10', text: 'Nov' },
        { value: '11', text: 'Dec' },
    ])

    seletectStartMonth = signal<DropdownOption>({ text: 'Jan', value: '0' });
    seletectEndMonth = signal<DropdownOption>({ text: 'Dec', value: '11' });

    rangedMonths = computed(() => {
        return this.months().slice(+this.seletectStartMonth().value, +this.seletectEndMonth().value + 1).map(month => month.text);
    })

    currentYear = new Date().getFullYear();

    rootCategories = signal<RootCategory[]>([{
        name: 'Income',
        totals: [],
        parentCategories: [],
    },
    {
        name: 'Expenses',
        totals: [],
        parentCategories: [],
    }]);

    monthyBalances = signal<MonthlyBalance[]>([]);

    updateTotals(rootIndex: number) {
        const rootCategories = [...this.rootCategories()];
        const updateCategories = this.rootCategories()[rootIndex];


        this.rangedMonths().forEach((month, index) => {
            updateCategories.parentCategories.forEach((parentCategory) => {
                const subTotalInParentCategory = parentCategory.category.inputs[index];
                const subTotalInChildrens = parentCategory.categories.reduce((subTotal, category) => {
                    const value = category.inputs[index];
                    return isNaN(value) ? subTotal : subTotal + value;
                }, 0);

                const subTotal = isNaN(subTotalInParentCategory) ? subTotalInChildrens : subTotalInChildrens + subTotalInParentCategory;
                parentCategory.totals[index] = isNaN(subTotal) ? 0 : subTotal;
            })

            const total = updateCategories.parentCategories.reduce((total, parentCategory) => {
                const value = parentCategory.totals[index];

                return isNaN(value) ? total : total + value;
            }, 0);
            updateCategories.totals[index] = isNaN(total) ? 0 : total;
        });
        this.rootCategories.set(rootCategories);

        this._updateMonthlyBalance();
    }

    addParentCategories(event: Event, rootIndex: number) {
        const inputElement = event.target as HTMLInputElement;
        this.rootCategories.set(this.rootCategories().map((rootCategory, rIndex) => {
            if (rIndex === rootIndex) {
                rootCategory.parentCategories.push({
                    category: {
                        name: inputElement?.value,
                        inputs: [],
                    },
                    totals: [],
                    categories: []
                });
            }
            return rootCategory;
        }));

        inputElement.value = ''
    }

    addSubCategories(event: Event, rootIndex: number, parentIndex: number) {
        const inputElement = event.target as HTMLInputElement;
        this.rootCategories.set(this.rootCategories().map((rootCategory, rIndex) => {
            if (rIndex === rootIndex) {
                rootCategory.parentCategories[parentIndex].categories.push({
                    name: inputElement?.value,
                    inputs: []
                });
            }
            return rootCategory;
        }));

        inputElement.value = ''
    }

    applyToParentCategories(rootIndex: number | undefined, parentIndex: number | undefined, value: number | undefined) {
        if (rootIndex === undefined || parentIndex === undefined || value === undefined) {
            return;
        }

        this.rangedMonths().forEach((month, index) => {
            this.rootCategories()[rootIndex].parentCategories[parentIndex].category.inputs[index] = value
        });

        this.updateTotals(rootIndex);
    }

    deleteParentCategories(rootIndex: number | undefined, parentIndex: number | undefined) {
        if (rootIndex === undefined || parentIndex === undefined) {
            return;
        }

        this.rootCategories()[rootIndex].parentCategories.splice(parentIndex, 1);
        this.updateTotals(rootIndex);

    }

    deleteChildCategories(rootIndex: number | undefined, parentIndex: number | undefined, childIndex: number | undefined) {
        if (rootIndex === undefined || parentIndex === undefined || childIndex === undefined) {
            return;
        }

        this.rootCategories()[rootIndex].parentCategories[parentIndex].categories.splice(childIndex, 1);
        this.updateTotals(rootIndex);

    }

    applyToChildCategories(rootIndex: number | undefined, parentIndex: number | undefined, childIndex: number | undefined, value: number | undefined) {
        if (rootIndex === undefined || parentIndex === undefined || childIndex === undefined || value === undefined) {
            return;
        }

        this.rangedMonths().forEach((month, index) => {
            this.rootCategories()[rootIndex].parentCategories[parentIndex].categories[childIndex].inputs[index] = value
        });

        this.updateTotals(rootIndex);
    }

    _updateMonthlyBalance() {
        let previousBalance = 0;

        const monthBalance = [] as MonthlyBalance[];
        this.rangedMonths().forEach((month, index) => {
            const profitAndLoss = this.rootCategories()[0].totals[index] - this.rootCategories()[1].totals[index];
            const closingBalance = profitAndLoss + previousBalance;
            const openingBalance = previousBalance;

            monthBalance[index] = {
                openingBalance,
                profitAndLoss,
                closingBalance
            }

            previousBalance = monthBalance[index].closingBalance;
        });

        this.monthyBalances.set(monthBalance);
    }
}