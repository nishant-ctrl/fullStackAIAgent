import React from 'react'
import { useAppStore } from '../store'

function Tickets() {
  const {userInfo} = useAppStore()
  return (
    <div>Tickets:
      <div>

      </div>
    </div>

  )
}

export default Tickets