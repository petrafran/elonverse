'use client'

import { useElonverse } from './elonverse-provider'

export function CultureButton() {
  const { setTopic, scrollToMarkets } = useElonverse()
  return (
    <button
      type="button"
      className="light-button"
      onClick={() => {
        setTopic('culture')
        scrollToMarkets()
      }}
    >
      Explore culture markets
    </button>
  )
}
