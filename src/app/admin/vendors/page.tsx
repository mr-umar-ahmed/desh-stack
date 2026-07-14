import { prisma } from "@/lib/prisma"
import { Check, X, Users } from "lucide-react"
import { approveVendorRequest, rejectVendorRequest } from "./actions"
import { EmptyState } from "@/components/ui/empty-state"

export default async function AdminVendorsPage() {
  const requests = await prisma.vendorRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, payment: true }
  })

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-ink mb-2">Vendor Requests</h1>
      <p className="text-ink/60 mb-8">Review and manage vendor registration requests.</p>

      <div className="bg-card rounded-2xl border border-indigo/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-paper/50 border-b border-indigo/10 text-ink/60 text-sm">
                <th className="px-6 py-4 font-semibold">Company Name</th>
                <th className="px-6 py-4 font-semibold">User Email</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Payment Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo/10">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-indigo/5 transition-colors">
                  <td className="px-6 py-4 text-ink font-medium">
                    {req.companyName}
                    {req.website && <div className="text-xs text-ink/50"><a href={req.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{req.website}</a></div>}
                  </td>
                  <td className="px-6 py-4 text-ink/70 text-sm">{req.user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      req.status === 'APPROVED' ? 'bg-teal/10 text-teal' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                      'bg-saffron/10 text-saffron'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {req.payment ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.payment.status === 'SUCCESS' ? 'bg-teal/10 text-teal' : 'bg-red-100 text-red-600'}`}>
                        {req.payment.status}
                      </span>
                    ) : (
                      <span className="text-xs text-ink/40">Not initiated</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === "PENDING" && (
                      <div className="flex justify-end gap-2">
                        <form action={approveVendorRequest.bind(null, req.id)}>
                          <button type="submit" className="p-2 text-teal hover:bg-teal/10 rounded-lg transition-colors" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                        </form>
                        <form action={rejectVendorRequest.bind(null, req.id)}>
                          <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="p-8">
              <EmptyState 
                icon={Users} 
                title="No Vendor Requests" 
                description="There are currently no vendor requests pending your review." 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
