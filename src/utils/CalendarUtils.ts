export const generateWeeks = (month: number, year: number) => {
    let date = new Date(year, month);

    const weeks = [[] as (number | null)[]];
    let currentWeek = 0;

    for (let i = 0; i < getDay(date); i++) {
        weeks[currentWeek].push(null);
    }

    while (date.getMonth() === month) {

        weeks[currentWeek].push(date.getDate());

        if (getDay(date) % 7 === 6 ) {
        weeks.push([] as (number | null)[]);
        currentWeek++;
        }

        date.setDate(date.getDate() + 1);
    }

    if (getDay(date) !== 0) {
        for (let i = getDay(date); i < 7; i++) {
        weeks[currentWeek].push(null);
        }
    }

    return weeks;
};

  
const getDay = (date: Date) => { // get day number from 0 (monday) to 6 (sunday)
    let day = date.getDay();
    if (day === 0) day = 7; // make Sunday (0) the last day
    return day - 1;
};

export const getMonthName = (month: number) => {
    const months = [
        "Styczeń",
        "Luty",
        "Marzec",
        "Kwiecień",
        "Maj",
        "Czerwiec",
        "Lipiec",
        "Sierpień",
        "Wrzesień",
        "Październik",
        "Listopad",
        "Grudzień"
    ];

    return months[month];
}

export const getLastDayOfMonth = (month: number) => {
    const date = new Date(Date.UTC(1970, month+1, 0));

    return date.getDate();
}