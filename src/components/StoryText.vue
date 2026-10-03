<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'

// the parent supplies its scroll clock, so text can follow it without a second scroll engine
const props = defineProps({
  time: { type: Number, default: 0 },
  reduced_motion: { type: Boolean, default: false }
})
const emit = defineEmits(['animation_change'])
const root = ref(null)
let animation_context
const timelines = []

// timings were checked against the actual film; keep the mural transformation clear
const cues = [
  { text: 'Always on the go?', layout: 'left', start: 0.4, end: 4.8, style: 'mask', label: '01 / Mask' },
  { text: 'Bring your best friend.', start: 6.6, end: 10.9, style: 'mask', label: '02 / Mask' },
  { text: 'Coffee. With company.', layout: 'diagonal', start: 14.2, end: 20.1, style: 'mask', label: '03 / Mask' },
  { text: 'Their favourite time.', start: 34.0, end: 37.4, style: 'slide', label: '04 / Slide' },
  { text: 'Time with you.', start: 38.1, end: 41.5, style: 'mask', label: '05 / Mask', final: true }
]

// full phrases go to screen readers once; the animated word spans are decorative
const active_index = computed(() => props.reduced_motion ? -1 : cues.findIndex(
  cue => props.time >= cue.start && props.time < cue.end
))

// each recipe has a distinct entrance and exit, all returning to the same readable pose
const recipes = {
  // moving the words behind clipped wrappers makes a clean baseline reveal
  mask: {
    from: { yPercent: 110, opacity: 1 },
    to: { yPercent: 0, opacity: 1 },
    out: { yPercent: -110, opacity: 1 }
  },
  // alternate the direction so words assemble from both sides
  slide: {
    from: { x: index => index % 2 ? 160 : -160, opacity: 0 },
    to: { x: 0, opacity: 1 },
    out: { x: index => index % 2 ? -120 : 120, opacity: 0 }
  },

}

// one paused timeline per phrase lets us scrub backwards as well as forwards
function build_timeline(cue, index) {
  const words = root.value.querySelectorAll(`[data-cue="${index}"] .story_text__word`)
  const recipe = recipes[cue.style]
  const timeline = gsap.timeline({ paused: true })
  // words still arrive one by one, with a short gap after each has settled
  timeline.fromTo(words, recipe.from, {
    ...recipe.to, duration: 0.45, stagger: 0.65, ease: 'power2.out'
  }, 0)

  // leave a quiet hold between entrance and exit; the last message stays on the final frame
  if (!cue.final) {
    // finish every word's exit before the next phrase starts, even with four words
    const exit_start = cue.end - cue.start - 0.35 - 0.16 * (words.length - 1) - 0.05
    timeline.to(words, {
      ...recipe.out, duration: 0.35, stagger: 0.16, ease: 'power2.in'
    }, exit_start)
  }
  timelines.push(timeline)
}

// seek directly to the scroll time, without autoplay or accumulated animation queues
function sync_text() {
  if (!timelines.length) return
  cues.forEach((cue, index) => {
    timelines[index].time(Math.max(0, props.time - cue.start), true)
  })
  emit('animation_change', active_index.value < 0 ? '' : cues[active_index.value].label)
}

// GSAP context restores the inline transforms when Vue removes or hot-reloads the component
onMounted(() => {
  animation_context = gsap.context(() => cues.forEach(build_timeline), root.value)
  sync_text()
})
watch(() => [props.time, props.reduced_motion], sync_text)
onBeforeUnmount(() => animation_context?.revert())
</script>

<template>
  <div ref="root" class="story_text" :class="{ 'story_text--reduced': reduced_motion }">
    <!-- a static summary preserves the message when animated overlays are disabled -->
    <p class="story_text__accessible">Make time for your dog. Share the run, the rest, and the joy. Time with you.</p>
    <!-- layout classes position the same animated words without changing their Mask timelines -->
    <p
      v-for="(cue, index) in cues"
      :key="cue.text"
      :data-cue="index"
      class="story_text__phrase"
      :class="[{ 'is_active': active_index === index }, 'story_text__phrase--' + cue.style, cue.layout && 'story_text__phrase--' + cue.layout]"
      :aria-label="cue.text"
      :aria-hidden="active_index !== index"
    >
      <span v-for="(word, word_index) in cue.text.split(' ')" :key="word_index" class="story_text__mask" aria-hidden="true">
        <span class="story_text__word">{{ word }}</span>
      </span>
    </p>
  </div>
</template>
