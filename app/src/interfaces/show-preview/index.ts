import { defineInterface } from '@directus/shared/utils';
import InterfaceShowPreview from './show-preview.vue';

export default defineInterface({
	id: 'show-preview',
	name: 'Show Preview',
	description: 'Preview of video wall in hertiage brand space',
	icon: 'preview',
	component: InterfaceShowPreview,
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
	options: ({ field }) => {
		const collection = field.collection;
		return [
			{
				field: 'showVideoField',
				type: 'string',
				name: 'Show Video Field',
				meta: {
					interface: 'system-field',
					options: {
						collectionName: collection,
						typeAllowList: ['alias'],
					},
					width: 'half',
				},
			},
			{
				field: 'showModeField',
				name: 'Show Mode Field',
				meta: {
					interface: 'system-field',
					options: {
						collectionName: collection,
						typeAllowList: ['string'],
					},
					width: 'half',
					required: true,
				},
			},
			{
				field: 'splashImageField',
				name: 'Splash Image Field',
				meta: {
					interface: 'system-field',
					options: {
						collectionName: collection,
						typeAllowList: ['uuid'],
					},
					width: 'half',
					required: true,
				},
			},
			{
				field: 'exploreModeField',
				name: 'Explore Mode Field',
				meta: {
					interface: 'system-field',
					options: {
						collectionName: collection,
						typeAllowList: ['string'],
					},
					width: 'half',
					required: true,
				},
			},
		];
	},
});
