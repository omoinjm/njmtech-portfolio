import { IAge } from '../../db/models';

const me: IAge = {
	birthDate: new Date('1999-04-06T00:00:00'),
	today: new Date(),
	age: 0,
};

export default function getAge() {
	me.age = me.today.getFullYear() - me.birthDate.getFullYear();
	var m = me.today.getMonth() - me.birthDate.getMonth();
	if (m < 0 || (m === 0 && me.today.getDate() < me.birthDate.getDate())) {
		me.age--;
	}
	return me.age;
}
