import { definePanel } from '@directus/extensions-sdk';
import PanelComponent from './panel.vue';

export default definePanel({
	id: 'filter-cardboard',
	name: 'filter',
	icon: 'filter_alt',
	description: 'Change the filter of the surrounding pannels',
	component: PanelComponent,
	options: [
		{
			field: 'collection',
			type: 'string',
			name: 'Collection',
			meta: {
				interface: 'system-collection',
				options: {
					includeSystem: true,
				},
				width: 'half',
			},
		},
		{
			field: 'field',
			type: 'string',
			name: 'Field',
			meta: {
				interface: 'input',
				width: 'half',
			},
		},
	],
	minWidth: 9,
	minHeight: 9,
});
