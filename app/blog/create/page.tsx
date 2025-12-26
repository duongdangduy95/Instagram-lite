import Navigation from '@/app/components/Navigation'
import CreateBlogForm from './CreateBlogForm'

export default function CreateBlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <CreateBlogForm />
      </div>
    </div>
  )
}
