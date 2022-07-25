export function today(addDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + addDays);
    const [isoDate] = date.toISOString().split("T");

    return isoDate;
}
