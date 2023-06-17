"use client"
import React from 'react'
import { useCallback, useState, useEffect } from 'react';
export default function Home() {
  const [data,setData] = useState([])
  const transData = useCallback(()=>{
    let newData = [{ title: 'title1', date: '2022-05-10 10:55:40'}, { title: 'title2', date: '2023-02-11T15:50:30'}]
    setData(newData)
  },[data])
  useEffect(()=>{
    transData()
  },[])
  return (
    <>
      <section className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="list-bg">
          {data.map((e, i) => (
            <p className="date" key={e.title + i}>
              {e.date}
            </p>
          ))}
        </div>
      </section>
    </>
  )
}
