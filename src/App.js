import { useState } from 'react';
import './App.css';

function SignData(props) {
  const [signedData, setSignedData] = useState(props.data)
  return (
    <label>
      <div>signed data {props.index + 1}</div>
      <textarea className='rounded w-full' rows={5} placeholder="tx json or signed data"
        value={signedData.tx} onChange={(e) => {
          setSignedData({ ...signedData, tx: e.target.value })
        }} />
      <input type="number" className='rounded w-full' placeholder='permission id'
        value={signedData.permissionId} onChange={(e) => {
          setSignedData({ ...signedData, permissionId: e.target.value })
        }} />
      <div>
        <button className='px-4 py-2 m-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm'
          onClick={() => {
            let targetData
            try {
              targetData = JSON.parse(signedData.tx)
            } catch {
              targetData = signedData.tx
            }
            window.tronWeb.trx.multiSign(targetData, null, Number(signedData.permissionId))
              .then((data) => {
                const nextSignedData = {}
                nextSignedData.tx = JSON.stringify(data, null, 2)
                props.onSign(nextSignedData)
              })
          }}
        >Sign</button>
        <button className='px-4 py-2 m-1 font-semibold text-sm bg-yellow-500 text-white rounded-full shadow-sm'
          onClick={() => {
            window.tronWeb.trx.sendRawTransaction(signedData.tx)
              .then(result => {
                window.open(`https://shasta.tronscan.org/#/transaction/${result.txid}`)
              })
          }}>Summit</button>
      </div>
    </label >
  )
}

function App() {
  const [signedDatas, setSignedDatas] = useState([{}])
  const element = [...signedDatas].slice(1).map((data, i) => {
    return <SignData index={i} data={data} onSign={(signedData) => {
      signedDatas[i + 2] = { ...signedDatas[i + 2], ...signedData }
      setSignedDatas([...signedDatas])
    }}></SignData>
  })
  return (
    <div className="relative min-h-screen flex flex-col  overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:w-4/12 sm:rounded-lg sm:px-10">
        <div className="mx-auto">
          <label>
            <div>tx data</div>
            <textarea className='rounded w-full' rows={8} placeholder="tx json or signed data"
              value={signedDatas[0].tx} onChange={(e) => {
                signedDatas[0] = { ...signedDatas[0], tx: e.target.value }
                setSignedDatas([...signedDatas])
              }} />
            <input type="number" className='rounded w-full' placeholder='permission id'
              value={signedDatas[0].permissionId} onChange={(e) => {
                signedDatas[0] = { ...signedDatas[0], permissionId: e.target.value }
                setSignedDatas([...signedDatas])
              }}
            />
            <div>
              <button className='px-4 py-2 m-1 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm'
                onClick={() => {
                  let targetData
                  try {
                    targetData = JSON.parse(signedDatas[0].tx)
                  } catch {
                    targetData = signedDatas[0].tx
                  }
                  window.tronWeb.trx.multiSign(targetData, null, Number(signedDatas[0].permissionId))
                    .then((data) => {
                      signedDatas[1] = {}
                      signedDatas[1].tx = JSON.stringify(data, null, 2)
                      setSignedDatas([...signedDatas])
                    })
                }}
              >Sign</button>
            </div>
          </label>
          {element}
        </div>
      </div>
    </div>
  );
}

export default App;
