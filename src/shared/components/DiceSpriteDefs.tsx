import { useEffect, useState } from 'react'

/**
 * Fetches the dice sprite file once at startup and injects its
 * <symbol> definitions into the DOM, so <use href="#dice-N">
 * resolves locally and synchronously (no per-mount network flash).
 */
export const DiceSpriteDefs = () => {
  const [markup, setMarkup] = useState('')
  useEffect(() => {
    let isMounted = true
    fetch('/assets/dice-sprite.svg')
      .then(response => response.text())
      .then(text => {
        if (isMounted) setMarkup(extractInnerSvg(text))
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0 }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}

const extractInnerSvg = (raw: string): string =>
  raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')