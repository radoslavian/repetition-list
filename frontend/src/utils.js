export function delay(milliseconds){
    /*
      downloaded from:
      https://alvarotrigo.com/blog/wait-1-second-javascript/
    */
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function today(addDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + addDays);
    const [isoDate] = date.toISOString().split("T");

    return isoDate;
}

export function sortDate(a, b) {
    // sort tasks according to a due_date
    const keyA = new Date(a.due_date);
    const keyB = new Date(b.due_date);
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
}
