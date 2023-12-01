import React from 'react'
import { useAppSelector } from '../hooks/reduxHooks'
import { Avatar } from 'antd'

export default function UserMenuInfo() {
  const user = useAppSelector(state => state.user.user)
  return (
    <div className="flex items-center justify-center gap-4">
      {/* <Avatar src={user.avatarUrl} /> */}
    </div>
  )
}
