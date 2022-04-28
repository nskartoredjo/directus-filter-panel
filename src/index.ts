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
			name: '$t:collection',
			meta: {
				interface: 'system-collection',
				options: {
					includeSystem: true,
				},
				width: 'half',
			},
		},
		{
			field: 'filter',
			type: 'json',
			name: '$t:filter',
			meta: {
				interface: 'system-filter',
				options: {
					collectionField: 'collection',
				},
				width: 'half',
			},
		},
	],
	minWidth: 9,
	minHeight: 9,
});
