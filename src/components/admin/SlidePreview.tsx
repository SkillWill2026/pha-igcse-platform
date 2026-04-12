import Image from 'next/image'
import type { Slide } from '@/types/ppt'
import { YOUCHI_POSES } from '@/lib/youchi'

interface SlidePreviewProps {
  slide: Slide
  slideNumber: number
  totalSlides: number
  subjectCode?: string
  subtopicRef?: string
  onSectionClick?: (sectionTitle: string) => void
}

const SLIDE_TYPE_LABELS: Record<string, string> = {
  title:    'TITLE',
  overview: 'OVERVIEW',
  section:  'SECTION',
  concept:  'CONCEPT',
  question: 'QUESTION',
  answer:   'ANSWER',
  summary:  'SUMMARY',
}

const SLIDE_TYPE_COLORS: Record<string, string> = {
  title:    'bg-[#145087] text-white',
  overview: 'bg-[#28A0E1] text-white',
  section:  'bg-[#145087] text-white',
  concept:  'bg-[#28A0E1] text-white',
  question: 'bg-amber-500 text-white',
  answer:   'bg-green-600 text-white',
  summary:  'bg-[#145087] text-white',
}

export function SlidePreview({ slide, slideNumber, totalSlides, subjectCode = '0580', subtopicRef = '', onSectionClick }: SlidePreviewProps) {
  const youchiSrc = YOUCHI_POSES[slide.youchi_pose] ?? YOUCHI_POSES.neutral
  const showYouchi = ['title', 'section', 'question', 'answer', 'summary'].includes(slide.type)

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-[#FEFEFE]" style={{ aspectRatio: '16/9', position: 'relative', fontFamily: 'Montserrat, sans-serif' }}>

      {/* Light Wave: top blue stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3%] bg-[#28A0E1]" />

      {/* Top bar */}
      <div className="absolute top-[3%] left-0 right-0 flex items-center justify-between px-[3%] py-[1.5%]">
        <div className="flex items-center gap-2">
          <span className="text-[#145087] font-bold" style={{ fontSize: 'clamp(8px, 1.5vw, 14px)' }}>
            skill<span className="text-[#28A0E1]">will</span>
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#145087] font-semibold" style={{ fontSize: 'clamp(6px, 1vw, 10px)' }}>
            Mathematics {subjectCode}
          </span>
          <span className="text-gray-400" style={{ fontSize: 'clamp(5px, 0.8vw, 9px)' }}>
            {SLIDE_TYPE_LABELS[slide.type] ?? slide.type}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="absolute left-0 right-0 bg-gray-200" style={{ top: '14%', height: '1px' }} />

      {/* Slide type pill */}
      <div className="absolute" style={{ top: '17%', left: '3%' }}>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${SLIDE_TYPE_COLORS[slide.type]}`}
          style={{ fontSize: 'clamp(5px, 0.8vw, 9px)' }}>
          {SLIDE_TYPE_LABELS[slide.type]}
        </span>
      </div>

      {/* Main content area */}
      <div className="absolute" style={{ top: '23%', left: '3%', right: showYouchi ? '28%' : '3%', bottom: '12%', display: 'flex', flexDirection: 'column', gap: '2%' }}>

        {/* Title */}
        <div className="text-[#145087] font-bold leading-tight" style={{ fontSize: 'clamp(8px, 1.8vw, 18px)' }}>
          {slide.title}
        </div>

        {/* Subtitle — title slides */}
        {slide.type === 'title' && slide.subtitle && (
          <div className="text-[#28A0E1] font-medium" style={{ fontSize: 'clamp(6px, 1.1vw, 11px)' }}>
            {slide.subtitle}
          </div>
        )}

        {/* Overview slide — clickable section links */}
        {slide.type === 'overview' && slide.bullets && slide.bullets.length > 0 && (
          <ul className="space-y-1 mt-1">
            {slide.bullets.slice(0, 6).map((b, i) => (
              <li key={i} className="flex items-start gap-1.5" style={{ fontSize: 'clamp(5px, 0.9vw, 10px)' }}>
                <span className="text-[#28A0E1] shrink-0 font-bold mt-0.5">{i + 1}.</span>
                {onSectionClick ? (
                  <button
                    type="button"
                    onClick={() => onSectionClick(b)}
                    className="text-left text-[#145087] hover:text-[#28A0E1] hover:underline transition-colors cursor-pointer"
                    style={{ fontSize: 'clamp(5px, 0.9vw, 10px)', background: 'none', border: 'none', padding: 0 }}
                  >
                    {b} →
                  </button>
                ) : (
                  <span className="text-gray-700">{b}</span>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Section divider slide */}
        {slide.type === 'section' && (
          <div className="flex flex-col items-center justify-center" style={{ marginTop: '8%' }}>
            <div className="text-center px-4 py-3 rounded-lg" style={{ background: 'rgba(20,80,135,0.08)', border: '2px solid #145087', maxWidth: '80%' }}>
              <div className="text-[#145087] font-bold" style={{ fontSize: 'clamp(7px, 1.4vw, 15px)' }}>
                {slide.title}
              </div>
              {slide.subtitle && (
                <div className="text-[#28A0E1] mt-1" style={{ fontSize: 'clamp(5px, 0.8vw, 9px)' }}>
                  {slide.subtitle}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bullets — concept + summary */}
        {(slide.type === 'concept' || slide.type === 'summary') && slide.bullets && slide.bullets.length > 0 && (
          <ul className="space-y-1 mt-1">
            {slide.bullets.slice(0, 5).map((b, i) => (
              <li key={i} className="flex items-start gap-1.5" style={{ fontSize: 'clamp(5px, 0.9vw, 10px)' }}>
                <span className="text-[#28A0E1] shrink-0 mt-0.5">▸</span>
                <span className="text-gray-700">{b}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Key concept box — concept slides */}
        {slide.type === 'concept' && slide.key_concept && (
          <div className="rounded-lg mt-auto p-2" style={{ background: 'rgba(20,80,135,0.07)', borderLeft: '3px solid #145087' }}>
            <div className="text-[#145087] font-semibold mb-0.5" style={{ fontSize: 'clamp(4px, 0.7vw, 8px)', letterSpacing: '0.06em' }}>KEY CONCEPT</div>
            <div className="text-[#145087]" style={{ fontSize: 'clamp(5px, 0.9vw, 10px)' }}>{slide.key_concept}</div>
          </div>
        )}

        {/* Question content */}
        {slide.type === 'question' && slide.question_content && (
          <div className="rounded-lg p-2 mt-1" style={{ background: 'rgba(40,160,225,0.08)', border: '1px solid rgba(40,160,225,0.3)' }}>
            <div className="text-[#145087]" style={{ fontSize: 'clamp(5px, 0.9vw, 10px)' }}>{slide.question_content}</div>
          </div>
        )}

        {/* Answer content */}
        {slide.type === 'answer' && (
          <div className="mt-1 space-y-1">
            {slide.answer_working && slide.answer_working.slice(0, 3).map((step, i) => (
              <div key={i} className="flex items-start gap-1" style={{ fontSize: 'clamp(5px, 0.85vw, 9px)' }}>
                <span className="text-[#28A0E1] font-semibold shrink-0">Step {i + 1}:</span>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
            {slide.answer_content && (
              <div className="rounded-md px-2 py-1 mt-1 font-semibold text-[#145087]"
                style={{ background: 'rgba(20,80,135,0.07)', fontSize: 'clamp(6px, 1vw, 11px)' }}>
                Answer: {slide.answer_content}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Youchi mascot */}
      {showYouchi && (
        <div className="absolute" style={{ right: '2%', bottom: '12%', width: '22%', height: '65%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <Image
            src={youchiSrc}
            alt={`Youchi ${slide.youchi_pose}`}
            width={120}
            height={120}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            unoptimized
          />
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-[3%] py-[1%]" style={{ background: '#f8f8f8', borderTop: '1px solid rgba(20,80,135,0.1)' }}>
        <span className="text-gray-400" style={{ fontSize: 'clamp(4px, 0.7vw, 8px)' }}>PHA IGCSE Platform</span>
        <span className="text-gray-400" style={{ fontSize: 'clamp(4px, 0.7vw, 8px)' }}>{slideNumber} / {totalSlides}</span>
      </div>
    </div>
  )
}
