import type { YouchiPose } from '@/types/ppt'

export const YOUCHI_POSES: Record<YouchiPose, string> = {
  excited:   '/youchi/excited.png',
  thinking:  '/youchi/thinking.png',
  waiting:   '/youchi/waiting.png',
  thumbs_up: '/youchi/thumbs_up.png',
  laughing:  '/youchi/laughing.png',
  wink:      '/youchi/wink.png',
  neutral:   '/youchi/neutral.png',
}

export const YOUCHI_POSE_LABELS: Record<YouchiPose, string> = {
  excited:   'Excited',
  thinking:  'Thinking',
  waiting:   'Waiting',
  thumbs_up: 'Thumbs Up',
  laughing:  'Laughing',
  wink:      'Winking',
  neutral:   'Neutral',
}

export const SLIDE_DEFAULT_POSES: Record<string, YouchiPose> = {
  title:    'excited',
  concept:  'thinking',
  question: 'waiting',
  answer:   'thumbs_up',
  summary:  'laughing',
}
