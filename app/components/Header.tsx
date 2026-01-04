import NotificationList from './NotificationList'

export default function Header() {
  return (
    <header className="flex justify-between p-4 shadow bg-white">
      <h1 className="font-bold">Instagram-lite</h1>
      <div className="relative">
        <NotificationList />
      </div>
    </header>
  )
}
