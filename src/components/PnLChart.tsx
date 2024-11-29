import React, { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

interface PnLChartProps {
  data: Array<{
    time: string
    value: number
  }>
}

const PnLChart: React.FC<PnLChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Show empty state if no data
    if (!data.length) {
      const emptyState = document.createElement('div')
      emptyState.className = 'flex items-center justify-center h-full text-gray-500'
      emptyState.textContent = 'No performance data available'
      chartContainerRef.current.appendChild(emptyState)
      return () => {
        if (chartContainerRef.current) {
          chartContainerRef.current.innerHTML = ''
        }
      }
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
    })

    const areaSeries = chart.addAreaSeries({
      lineColor: '#2563eb',
      topColor: 'rgba(37, 99, 235, 0.4)',
      bottomColor: 'rgba(37, 99, 235, 0.0)',
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    })

    try {
      // Ensure data is properly sorted and deduplicated
      const uniqueData = Array.from(
        new Map(data.map(item => [item.time, item])).values()
      )
      
      const sortedData = uniqueData.sort((a, b) => 
        new Date(a.time).getTime() - new Date(b.time).getTime()
      )
      
      areaSeries.setData(sortedData)
      chart.timeScale().fitContent()
    } catch (error) {
      console.error('Error setting chart data:', error)
    }

    chartRef.current = chart

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data])

  return <div ref={chartContainerRef} className="w-full h-[300px]" />
}

export default PnLChart