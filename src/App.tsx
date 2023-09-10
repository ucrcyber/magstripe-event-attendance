import { useRef } from 'react'
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import './App.css'

function App() {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <SnackbarProvider maxSnack={10}/>
      <div className='background' onClick={() => ref.current && ref.current.focus()}>
        {'Click anywhere to start scanning'}
        <input ref={ref} onKeyDown={(e) => {
          if(e.code.includes('Enter')){
            const payload:string = (e.target as HTMLInputElement).value;
            (e.target as HTMLInputElement).value = '';

            const tokens = payload.match(/\^(.*?) *\^[0-9]*?0+([0-9]+) 000 /) || [];
            const result = [...tokens].slice(1);
            const name: string = (result[0] || '/').split('/').reverse().join(' ')
              .toLowerCase().split(' ').map(x => x.replace(/./, (a) => a.toUpperCase())).join(' ');
            const id: string = result[1] || '';
            // 'name': _name,
            //     'id': _id,
            //     'raw_card_data': _raw_card_data,
            if(name && id){
              // enqueueSnackbar(`${name} (${id})`, {
              //   variant: 'info',
              //   autoHideDuration: 5000,
              // });
              fetch('api/checkin', {
                headers: {
                  'Accept': 'application/json, text/plain',
                  'Content-Type': 'application/json;charset=UTF-8'
                },
                method: 'POST',
                body: JSON.stringify({
                  name, id,
                  raw_card_data: payload,
                }),
              }).then(async response => {
                const ack = await response.json();
                console.log(ack);
                if(ack && ack.message === "Success"){
                  enqueueSnackbar(`${name} (${id}) saved`, {
                    variant: 'success',
                    autoHideDuration: 5000,
                  });
                }else{
                  enqueueSnackbar(ack.error || `${name} (${id}) did not save`, {
                    variant: 'error',
                    autoHideDuration: 5000,
                  });
                }
              }).catch(() => {
                enqueueSnackbar('failed to connect to server', {
                  variant: 'error',
                  autoHideDuration: 5000,
                })
              })
            }else{
              enqueueSnackbar('Unable to scan', {
                variant: 'error',
                autoHideDuration: 5000,
              });
            }
          }
        }}></input>
      </div>
    </>
  )
}

export default App
