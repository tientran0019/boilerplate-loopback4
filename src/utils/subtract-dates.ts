/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-11 13:21:16

* Last updated on: 2023-10-11 13:21:16
* Last updated by: Tien Tran
*------------------------------------------------------- */


/**
 * The `subtractDates` function calculates the number of days between the current date and a given
 * date.
 *
 * @param {Date} dateToSubtract - The `dateToSubtract` parameter is the date that you want to subtract
 * from the current date. It should be a `Date` object.
 * @returns The function `subtractDates` returns a Promise that resolves to a number.
 */
export const subtractDates = async (dateToSubtract: Date): Promise<number> => {
	const currentDate = new Date(new Date().toLocaleDateString());
	const millisecondsPerDay = 1000 * 60 * 60 * 24;
	// Taking into consideration DST. See https://stackoverflow.com/a/15289883/1210717
	const utcCurrentDate = Date.UTC(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDay(),
	);
	const utcDateToSubtract = Date.UTC(
		dateToSubtract.getFullYear(),
		dateToSubtract.getMonth(),
		dateToSubtract.getDay(),
	);
	return Math.floor((utcCurrentDate - utcDateToSubtract) / millisecondsPerDay);
};
