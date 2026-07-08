import { prisma } from "@/lib/prisma"

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vendorRequest: {
        include: { user: true }
      }
    }
  })

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-ink mb-2">Payments</h1>
      <p className="text-ink/60 mb-8">View all Razorpay transactions.</p>

      <div className="bg-white rounded-2xl border border-indigo/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-paper/50 border-b border-indigo/10 text-ink/60 text-sm">
                <th className="px-6 py-4 font-semibold">Razorpay ID</th>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo/10">
              {payments.map(payment => (
                <tr key={payment.id} className="hover:bg-indigo/5 transition-colors">
                  <td className="px-6 py-4 text-ink font-mono text-sm">{payment.razorpayPaymentId}</td>
                  <td className="px-6 py-4 text-ink">
                    <div className="font-medium">{payment.vendorRequest?.companyName || 'Unknown'}</div>
                    <div className="text-xs text-ink/50">{payment.vendorRequest?.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-ink font-semibold">₹{(payment.amountInr / 100).toLocaleString()}</td>
                  <td className="px-6 py-4 text-ink/70 text-sm">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.status === 'SUCCESS' ? 'bg-teal/10 text-teal' : 'bg-red-100 text-red-600'}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-ink/50">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
