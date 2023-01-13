import { useState } from 'react'
import trpc from '../utils/trpc'

interface Fund {
  name: string
  isin_code: string
}

interface SearchBoxProps {
  setFund: (isinCode: string) => void
}

export default function Searchbox({ setFund }: SearchBoxProps) {
  const [searchText, setSearchText] = useState('')

  const funds = trpc.funds.findFunds.useQuery({ name: searchText })

  const handleSelect = (isinCode: string) => {
    setSearchText(isinCode)
    setFund(isinCode)
  }

  return (
    <div className="mx-auto max-w-3xl mt-8 flex gap-x-2 sm:justify-center">
      <div className="min-w-full flex flex-col">
        <div className="relative min-w-full">
          <input
            type="search"
            placeholder="SG Valeurs, BMCI Cosmos,..."
            className="form-control min-w-full border-2 focus:border-green-400 py-4 px-8 shadow-sm rounded-lg"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-6"
            onClick={() => handleSelect('MA0000030777')}
          >
            <svg
              fill="#000000"
              height="30"
              width="30"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 49.7 49.7"
            >
              <g>
                <path
                  d="M27,13.85h9v8.964l13.7-9.964L36,2.886v8.964h-9c-7.168,0-13,5.832-13,13c0,6.065-4.935,11-11,11H1c-0.553,0-1,0.447-1,1
		s0.447,1,1,1h2c7.168,0,13-5.832,13-13C16,18.785,20.935,13.85,27,13.85z M38,6.814l8.3,6.036L38,18.886V6.814z"
                />
                <path
                  d="M1,13.85h2c2.713,0,5.318,0.994,7.336,2.799c0.191,0.171,0.43,0.255,0.667,0.255c0.274,0,0.548-0.112,0.745-0.333
		c0.368-0.412,0.333-1.044-0.078-1.412C9.285,13.025,6.206,11.85,3,11.85H1c-0.553,0-1,0.447-1,1S0.447,13.85,1,13.85z"
                />
                <path
                  d="M36,35.85h-9c-2.685,0-5.27-0.976-7.278-2.748c-0.411-0.365-1.044-0.327-1.411,0.089c-0.365,0.414-0.326,1.046,0.089,1.411
		c2.374,2.095,5.429,3.248,8.601,3.248h9v8.964l13.7-9.964L36,26.886V35.85z M38,30.814l8.3,6.036L38,42.886V30.814z"
                />
              </g>
            </svg>
          </button>
        </div>
        <div className="min-w-full relative">
          {searchText.length ? (
            <div className="absolute min-w-full bg-white flex flex-col divide-x border-solid border-2 rounded-lg">
              {funds.data &&
                funds.data?.map((x: Fund) => (
                  <button
                    type="button"
                    key={x.isin_code}
                    className="min-w-full flex items-center shadow-sm px-4 py-2 hover:bg-slate-100 cursor-pointer selection:invisible"
                    onClick={() => handleSelect(x.isin_code)}
                  >
                    <p>
                      <b>{x.isin_code}</b> | {x.name}
                    </p>
                  </button>
                ))}
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
