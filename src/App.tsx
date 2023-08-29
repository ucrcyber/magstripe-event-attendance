import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [payload, setPayload] = useState('');
  const tokens = payload.match(/\^(.*?) *\^[0-9]*?0+([0-9]+) 000 /) || [];
  const result = [...tokens].slice(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPayload('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [payload]);

  return (
    <>
      <input onKeyDown={(e) => {
        if(e.code.includes('Enter')){
          setPayload((e.target as HTMLInputElement).value);
          (e.target as HTMLInputElement).value = '';
        }
      }}></input>
      {payload && (
        <>
          <div>{payload}</div>
          <div>{result.join(' ')}</div>
        </>
      )}
    </>
  )
}

export default App
