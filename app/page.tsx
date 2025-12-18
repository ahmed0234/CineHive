import { Navbar } from '@/components/navbar'

const page = () => {
  return (
    <div className="flex flex-col gap-12">
      <Navbar />
      <h1 className="text-6xl text-center font-bartel text-yellow-500">Main Page</h1>
    </div>
  )
}

export default page
