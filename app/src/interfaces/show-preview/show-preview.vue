<template>
	<div id="previewBg">
		<div id="previewVideobox">
			<video
				v-for="i in 8"
				:id="'previewVideo' + i"
				:key="i"
				ref="videos"
				class="previewVideo"
				:muted="true"
				loop
				type="video/mp4"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed, watch, onMounted, Ref } from 'vue';
import { addTokenToURL } from '@/api';
import kerastase from './kerastase.png';

export default defineComponent({
	props: {
		showVideoField: {
			type: String,
			required: true,
		},
		showModeField: {
			type: String,
			required: true,
		},
		splashImageField: {
			type: String,
			required: true,
		},
		exploreModeField: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const values = inject('values', ref<Record<string, any>>({}));
		const videos = ref();

		const ready = ref<boolean>(false);
		const loadedVids: Ref<number[]> = ref<number[]>([]);
		const neededVids = ref<number>(0);
		const showMode = computed(() => values.value[props.showModeField]);
		const exploreMode = computed(() => values.value[props.exploreModeField]);
		const showVideoID = computed(() => values.value[props.showVideoField]);
		const splashImageID = computed(() => values.value[props.splashImageField]);

		const splashImageSrc = computed(() => {
			if (!splashImageID.value) return null;

			const url = `/assets/${splashImageID.value}`;
			return addTokenToURL(url);
		});

		const showVideoSrc = computed(() => {
			if (!showVideoID.value) return null;

			const url = `/assets/${showVideoID.value}`;
			return addTokenToURL(url);
		});

		onMounted(() => {
			for (let i = 0; i < videos.value?.length; i++) {
				const vidEl: HTMLVideoElement = videos.value[i];
				vidEl.addEventListener('canplaythrough', () => {
					if (!loadedVids.value.includes(i)) {
						loadedVids.value = loadedVids.value.concat([i]);
					}
				});
			}
		});

		watch([showMode, showVideoSrc, videos], ([newShowMode, newShowVideoSrc, newVideos]) => {
			ready.value = false;
			loadedVids.value = [];
			neededVids.value = 0;
			if (newVideos == null) return;
			let vidIndexes: number[] = [];
			switch (newShowMode) {
				case 'focused':
					vidIndexes = [1, 6];
					break;
				case 'contrast':
					vidIndexes = [0, 2, 4, 6];
					break;
				case 'bold':
					vidIndexes = [0, 1, 2, 3, 4, 5, 6, 7];
					break;
				case 'dynamic':
					vidIndexes = [0, 1, 2, 3, 4, 5, 6, 7];
					break;
			}
			neededVids.value = vidIndexes.length;
			for (let i = 0; i < newVideos.length; i++) {
				const vidEl: HTMLVideoElement = newVideos[i];
				if (vidIndexes.includes(i)) {
					vidEl.src = newShowVideoSrc!;
					vidEl.load();
					vidEl.removeAttribute('poster');
				} else {
					vidEl.src = '';
					vidEl.poster = kerastase;
				}
			}
			ready.value = true;
		});

		watch([ready, loadedVids], async () => {
			if (ready.value === true && loadedVids.value.length === neededVids.value && loadedVids.value.length > 0) {
				const dynamic = showMode.value === 'dynamic';
				for (let i = videos.value.length - 1; i >= 0; i--) {
					if (loadedVids.value.includes(i)) {
						setTimeout(function () {
							videos.value[i].currentTime = 0;
							videos.value[i].play();
						}, (i + 1) * (dynamic ? 1000 : 1));
					}
				}
			}
		});

		return { videos };
	},
});
</script>

<style lang="scss" scoped>
#previewBg {
	width: 100%;
	aspect-ratio: 1920/900;
	display: inline-flex;
	justify-content: center;

	background: url('./bg1.png') center center no-repeat;
	background-size: cover;
}

#previewVideobox {
	width: 92%;
	height: 15%;
	top: 53%;
	position: relative;
	display: flex;

	text-align: center;
}

.previewVideo {
	height: 100%;
	min-width: 0;
	flex: 1;

	&[poster] {
		object-fit: contain;
		padding: 4px;
	}
}
</style>
