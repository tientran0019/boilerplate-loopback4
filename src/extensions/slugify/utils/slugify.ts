/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2023-10-09 20:17:40

* Last updated on: 2023-10-09 20:17:40
* Last updated by: Tien Tran
*------------------------------------------------------- */

import _ from 'lodash';

const slugify = (input: string): string => {
	input = input.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
	input = input.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
	input = input.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
	input = input.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
	input = input.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
	input = input.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
	input = input.replace(/đ/gi, 'd');

	input = input.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
	input = input.replace(/ /gi, '-');
	input = input.replace(/\-\-\-\-\-/gi, '-');
	input = input.replace(/\-\-\-\-/gi, '-');
	input = input.replace(/\-\-\-/gi, '-');
	input = input.replace(/\-\-/gi, '-');
	input = '@' + input + '@';
	input = input.replace(/\@\-|\-\@|\@/gi, '');

	input = _.trim(
		input
			.split('')
			.filter((ch) => /[a-z0-9 _-]/.test(ch))
			.join(''),
		'- _',
	);

	let slug = _.snakeCase(_.trim(input));
	slug = !slug || slug === '_' ? '0' : slug;
	slug = slug.replace(/_/g, '-');
	return slug;
};

export default slugify;
