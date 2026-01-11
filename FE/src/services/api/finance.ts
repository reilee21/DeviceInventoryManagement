import http from "./http"

export interface ProfitSummary {
    totalRevenue: number
    totalCost: number
    grossProfit: number
    profitMargin: number
}

export interface DebtSummary {
    totalDebt: number
    debtorCount: number
    topDebtors: Debtor[]
}

export interface Debtor {
    id: string
    name: string
    debtAmount: number
    lastSaleDate: string
}

export interface CashflowPoint {
    date: string
    amount: number
}

export interface FinanceDashboardData {
    profit: ProfitSummary
    debt: DebtSummary
    cashflow: CashflowPoint[]
}

export const financeApi = {
    getDashboardData: async (period: string = "30d") => {
        const { data } = await http.get<{ status: string; data: FinanceDashboardData }>("/finance/dashboard", { params: { period } })
        return data.data
    },
}
