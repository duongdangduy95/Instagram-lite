import Navigation from '@/app/components/Navigation'
import CreateBlogForm from './CreateBlogForm'

export default function CreateBlogPage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <CreateBlogForm />
      </div>
    </div>
  )
}
