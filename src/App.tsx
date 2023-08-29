import { useState } from 'react'
import './App.css'

function App() {
  const [payload, setPayload] = useState('');
  const tokens = payload.match(/\^(.*?) *\^[0-9]*?0+([0-9]+) 000 /) || [];
  const result = [...tokens].slice(1);

  return (
    <>
      <input onKeyDown={(e) => {
        if(e.code === 'Enter'){
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
