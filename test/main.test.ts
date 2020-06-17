// github:tom-weatherhead/thaw-reversi-engine.ts/test/main.test.ts

'use strict';

import { testDescriptors } from '../lib/main';

for (const testDescriptor of testDescriptors) {
	test(testDescriptor.name, () => {
		// Arrange
		const initialData = testDescriptor.arrangeFunction();

		// Act
		const result = testDescriptor.actFunction(initialData);

		// Assert
		testDescriptor.assertFunction(initialData, expect, result);
	});
}
