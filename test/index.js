const parser = require('../index');
const expect = require('chai').expect;

describe('Nemo API parser', () => {
	it('should return object as is', () => {
		const initialObject = {
			'some/object/1': {
				title: 'Some title',
				value: 'Some value'
			},
			'some/object/2': {
				title: 'Some title',
				value: 'Some value'
			}
		};

		const parsedObject = parser(initialObject);

		expect(parsedObject).to.deep.equal(initialObject);
	});

	it('should replace object reference with object itself', () => {
		const initialObject = {
			'some/object/1': {
				title: 'Some title',
				value: 'Some value'
			},
			'some/object/2': {
				title: 'Some title',
				value: '$ref_some/object/1'
			}
		};

		const parsedObject = parser(initialObject);

		expect(parsedObject['some/object/2'].value).to.deep.equal(initialObject['some/object/1']);
	});

	it('should replace deep object reference with object itself', () => {
		const initialObject = {
			'some/object/1': {
				title: 'Some title',
				value: 'Some value'
			},
			'some/object/2': {
				title: 'Some title',
				value: ['$ref_some/object/1']
			}
		};

		const parsedObject = parser(initialObject);

		expect(parsedObject['some/object/2'].value[0]).to.deep.equal(initialObject['some/object/1']);
	});
});
