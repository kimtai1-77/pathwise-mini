import './styles/ToastNotification.css'

export default function ToastNotification({ message }) {
  return message ? <div className='pcd-toast' role='status'>{message}</div> : null
}