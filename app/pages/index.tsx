import { useState } from 'react'
import Resultbox from '../components/Resultbox'
import Searchbox from '../components/Searchbox'

export default function IndexPage() {
  const [selectedFund, setSelectedFund] = useState('')

  return (
    <div>
      <Searchbox setFund={setSelectedFund} />
      {selectedFund.length > 0 ? <Resultbox isinCode={selectedFund} /> : ''}
    </div>
  )
}
