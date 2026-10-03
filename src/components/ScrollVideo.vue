<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import video_url from '../assets/videos/scroll_world_final_cut.mp4'
import StoryText from './StoryText.vue'

// refs connect the script to the scroll section and its video element
const track = ref(null)
const video = ref(null)
const ready = ref(false)
const error_message = ref('')
// these values feed the small timeline readout at the bottom
const progress = ref(0)
const current_time = ref(0)
const duration = ref(0)
const reduced_motion = ref(false)
const animation_name = ref('')
const progress_percent = computed(() => Math.round(progress.value * 100))
const status = computed(() => error_message.value || (ready.value ? 'Ready' : 'Loading video…'))
// keep the latest requested time separate from the frame already on screen
let target_time = 0
let frame_id = 0
let motion_query

// match scroll distance to time; the last viewport stays on the final frame
function read_scroll() {
  if (!track.value || !video.value || reduced_motion.value) return
  const bounds = track.value.getBoundingClientRect()
  const distance = Math.max(1, track.value.offsetHeight - window.innerHeight)
  progress.value = Math.min(1, Math.max(0, -bounds.top / distance))
  target_time = progress.value * Math.max(0, duration.value - 1 / 24)
  schedule_seek()
}

// one animation frame is enough for a batch of scroll events
function schedule_seek() {
  if (!frame_id) frame_id = requestAnimationFrame(seek_video)
}

// only ask the decoder for a new frame when it has finished the previous seek
function seek_video() {
  frame_id = 0
  const player = video.value
  if (!player || !ready.value || reduced_motion.value || player.seeking) return
  // don't interrupt a seek; its completion will pick up the latest scroll target
  if (Math.abs(player.currentTime - target_time) > 1 / 48) {
    player.currentTime = target_time
  }
}

// metadata gives us the real video duration before we map scroll to seconds
function on_metadata() {
  duration.value = video.value.duration
  read_scroll()
}

// keep the loading screen up until an actual frame is available
function on_loaded() {
  ready.value = true
  read_scroll()
}

// once a seek finishes, catch up if the visitor has scrolled further meanwhile
function on_seeked() {
  current_time.value = video.value.currentTime
  if (!reduced_motion.value) schedule_seek()
}

// also update the readout when reduced-motion visitors use the normal player
function on_time_update() {
  current_time.value = video.value.currentTime
}

function on_error() {
  // show failure on the page instead of silently leaving an empty video
  error_message.value = 'Video could not load. Reload the page or check the video file.'
  console.error('Video load failed:', video.value?.error)
}

// respect the system motion preference with an ordinary player under user control
function update_motion() {
  reduced_motion.value = motion_query.matches
  video.value?.pause()
  requestAnimationFrame(read_scroll)
}

// start listening after Vue has attached the video and section to the page
onMounted(() => {
  motion_query = window.matchMedia('(prefers-reduced-motion: reduce)')
  update_motion()
  motion_query.addEventListener('change', update_motion)
  window.addEventListener('scroll', read_scroll, { passive: true })
  window.addEventListener('resize', read_scroll)
})

// remove listeners when the component leaves the page (including during dev updates)
onBeforeUnmount(() => {
  cancelAnimationFrame(frame_id)
  motion_query?.removeEventListener('change', update_motion)
  window.removeEventListener('scroll', read_scroll)
  window.removeEventListener('resize', read_scroll)
})
</script>

<template>
  <section ref="track" class="scroll_video" :class="{ 'scroll_video--reduced': reduced_motion }">
    <div class="scroll_video__stage">
      <!-- the same video is scrubbed by scroll, or controlled manually with reduced motion -->
      <video
        ref="video"
        class="scroll_video__media"
        :src="video_url"
        :controls="reduced_motion"
        preload="auto"
        muted
        playsinline
        aria-label="Dogs and their owners — scroll to move through the story"
        @loadedmetadata="on_metadata"
        @loadeddata="on_loaded"
        @seeked="on_seeked"
        @timeupdate="on_time_update"
        @error="on_error"
      />
      <!-- text uses the same scroll clock; the existing video seek engine stays independent -->
      <StoryText
        v-if="ready && !error_message"
        :time="progress * Math.max(0, duration - 1 / 24)"
        :reduced_motion="reduced_motion"
        @animation_change="animation_name = $event"
      />
      <!-- cover the stage until a frame is ready, and make loading failures visible -->
      <div v-if="!ready || error_message" class="scroll_video__loading" role="status">
        {{ status }}
      </div>
      <!-- diagnostics are preserved below; uncomment the block when tuning the video -->
      <!--
      <div class="scroll_video__debug" aria-label="Video test information">
        <span>{{ status }}</span>
        <span>{{ progress_percent }}% scroll</span>
        <span>{{ current_time.toFixed(2) }} / {{ duration.toFixed(2) }} s</span>
        <span v-if="animation_name">{{ animation_name }}</span>
      </div>
      -->
    </div>
  </section>
</template>
