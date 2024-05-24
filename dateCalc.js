const dateFormat = (dateToFormat) => {
    const date = new Date(dateToFormat);
    const day = date.toISOString().slice(8,10);
    const month = date.toISOString().slice(5,7);
    const year = date.toISOString().slice(0,4);

    return `${year}-${month}-${day}`;
}

const now = new Date(Date.now());

const calculateDate = (startDate, daysDiff) => {
    return new Date(startDate.getTime() + (daysDiff * 1000 * 3600 * 24));
}

export const oneMonthBackFromNow = dateFormat(calculateDate(now, -30));
export const twoWeeksBackFromNow = dateFormat(calculateDate(now, -14));
export const oneWeekBackFromNow = dateFormat(calculateDate(now, -7));
export const twoDaysBackFromNow = dateFormat(calculateDate(now, -2));
export const twoDaysAheadFromNow = dateFormat(calculateDate(now, 2));
export const oneWeekAheadFromNow = dateFormat(calculateDate(now, 7));
export const twoWeeksAheadFromNow = dateFormat(calculateDate(now, 14));
export const oneMonthAheadFromNow = dateFormat(calculateDate(now, 30));
export const yesterday = dateFormat(calculateDate(now, -1));
export const today = dateFormat(now);