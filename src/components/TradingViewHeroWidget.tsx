import React, { useEffect, useRef } from 'react'

export function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-tickers.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = `
    {
      "symbols": [
        {
          "proName": "BITSTAMP:BTCUSD",
          "title": "Bitcoin"
        },
        {
          "description": "Nvidia",
          "proName": "NASDAQ:NVDA"
        },
        {
          "description": "Tesla",
          "proName": "NASDAQ:TSLA"
        },
        {
          "description": "Solana",
          "proName": "COINBASE:SOLUSD"
        }
      ],
      "isTransparent": true,
      "showSymbolLogo": true,
      "largeChartUrl": "",
      "colorTheme": "dark",
      "locale": "en"
    }`

    if (container.current) {
      container.current.appendChild(script)
    }

    return () => {
      if (container.current) {
        const scriptElement = container.current.querySelector('script')
        if (scriptElement) {
          container.current.removeChild(scriptElement)
        }
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}