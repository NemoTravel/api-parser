const parser = require('../index');
const assert = require('chai').assert;

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

		const jsonInitial = JSON.stringify(initialObject);
		const jsonResult = JSON.stringify(parser(initialObject));

		assert.strictEqual(jsonResult, jsonInitial);
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
		const jsonFirstObject = JSON.stringify(initialObject['some/object/1']);
		const jsonReplacedObject = JSON.stringify(parsedObject['some/object/2'].value);

		assert.strictEqual(jsonFirstObject, jsonReplacedObject);
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
		const jsonFirstObject = JSON.stringify(initialObject['some/object/1']);
		const jsonReplacedObject = JSON.stringify(parsedObject['some/object/2'].value[0]);

		assert.strictEqual(jsonFirstObject, jsonReplacedObject);
	});
});
