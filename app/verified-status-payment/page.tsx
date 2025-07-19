import { Suspense } from 'react'
import VerifiedStatusComponent from './VerifiedStatusComponent'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Carregando...</div>}>
      <VerifiedStatusComponent />
    </Suspense>
  )
}
