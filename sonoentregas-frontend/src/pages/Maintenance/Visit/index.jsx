import React, { useState } from 'react'

import SearchMain from './SearchMain'
import FinishVisit from './FinishVisit'

export default function Visit(){
  const [visit, setVisit] = useState({vistiData: {}, finishVisit: false})

return(<React.Fragment>
    {visit.finishVisit
      ? <FinishVisit setVisit={setVisit} visit={visit}/>
      : <SearchMain setVisit={setVisit} />
    }
  </React.Fragment>)
}