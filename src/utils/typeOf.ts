/** --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-28 11:44:24

* Last updated on: 2023-10-28 11:44:24
* Last updated by: Tien Tran
*------------------------------------------------------- */

const typeOf = (value: any): string => {
	return Object.prototype.toString.call(value).slice(8, -1);
};

export default typeOf;
