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
            placeholder="Search"
            className="form-control min-w-full border-2 focus:border-green-400 py-4 px-8 shadow-sm rounded-lg"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-6"
          >
            <svg
              className="h-5 w-5 fill-black"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 30 30"
            >
              <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971  23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
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
