export const datediff = (first: Date, second: Date) => {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
}

export const PrettyPrintDate = (days: number) => {
    const months = Math.floor(days / 31);
    const years = Math.floor(months / 12);

    if (years > 0)
        return years + " Year(s) ago";
    if (months > 0)
        return months + " Month(s) ago";
    return days + " Day(s) ago";
}