import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export function getLastMonths(months: number = 6) {
    const now = new Date();
    return Array.from({ length: months }).map((_, i) => {
        const date = subMonths(now, i);
        return {
            name: date.toLocaleString("default", { month: "short" }),
            start: startOfMonth(date),
            end: endOfMonth(date),
        };
    }).reverse();
}
