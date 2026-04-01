import { redirect } from 'next/navigation'

export default function AdminIndex() {
    // We'll redirect to charities for now until the overview dashboard is built
    redirect('/admin/charities')
}
