import { useState, useEffect, useCallback } from 'react'

// Browser support for SpeechRecognition (mostly Chrome/Edge/Safari)
const SpeechRecognition = 
  (window as any).SpeechRecognition || 
  (window as any).webkitSpeechRecognition

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Your browser does not support speech recognition. Please use Chrome or Edge.')
      return
    }

    const rec = new SpeechRecognition()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (event: any) => {
      let finalTranscriptChunk = ''
      let interimTranscriptChunk = ''

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptChunk += event.results[i][0].transcript + ' '
        } else {
          interimTranscriptChunk += event.results[i][0].transcript
        }
      }

      if (finalTranscriptChunk) {
        setTranscript((prev) => prev + finalTranscriptChunk)
      }
      setInterimTranscript(interimTranscriptChunk)
    }

    rec.onerror = (event: any) => {
      console.error('Speech recognition error', event.error)
      if (event.error !== 'no-speech') {
        setError(event.error)
        setIsListening(false)
      }
    }

    rec.onend = () => {
      // If we are supposed to be listening but it ended (e.g. timeout), restart it
      setIsListening((prev) => {
        if (prev) {
          try {
            rec.start()
          } catch (e) {
            // Already started or error
          }
        }
        return prev
      })
    }

    setRecognition(rec)

    return () => {
      rec.stop()
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognition) {
      setError(null)
      try {
        recognition.start()
        setIsListening(true)
      } catch (err) {
        console.error(err)
      }
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    clearTranscript,
    error,
    isSupported: !!SpeechRecognition
  }
}
