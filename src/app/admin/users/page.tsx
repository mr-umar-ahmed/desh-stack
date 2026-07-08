/* eslint-disable */
import { prisma } from "@/lib/prisma"
import { changeUserRole, suspendUser, activateUser } from "./actions"
import { Users, Shield, Building2, User, ShieldAlert } from "lucide-react"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { reviews: true, products: true } },
    },
  })

  const roleIcons: Record<string, typeof User> = {
    ADMIN: Shield,
    MODERATOR: ShieldAlert,
    PUBLISHER: Building2,
    USER: User,
  }

  const roleColors: Record<string, string> = {
    ADMIN: "bg-red-50 text-red-700 border-red-200",
    MODERATOR: "bg-purple-50 text-purple-700 border-purple-200",
    PUBLISHER: "bg-saffron/10 text-saffron border-saffron/20",
    USER: "bg-indigo/5 text-indigo border-indigo/10",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink mb-1">User Management</h1>
          <p className="text-ink/50">{users.length} total users</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-indigo/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-indigo/10 bg-paper/50">
                <th className="text-left text-xs font-semibold text-ink/50 uppercase tracking-wider px-5 py-3">User</th>
                <th className="text-left text-xs font-semibold text-ink/50 uppercase tracking-wider px-5 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-ink/50 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-ink/50 uppercase tracking-wider px-5 py-3">Activity</th>
                <th className="text-left text-xs font-semibold text-ink/50 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo/5">
              {users.map((user) => {
                const RoleIcon = roleIcons[user.role] || User
                return (
                  <tr key={user.id} className="hover:bg-paper/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo/5 flex items-center justify-center text-indigo font-bold text-sm shrink-0">
                          {user.image ? (
                            <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            (user.name?.[0] || user.email[0]).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">{user.name || "—"}</p>
                          <p className="text-xs text-ink/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${roleColors[user.role]}`}>
                        <RoleIcon className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        user.status === "ACTIVE" ? "bg-teal/10 text-teal" : "bg-red-100 text-red-700"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 text-xs text-ink/50">
                        <span>{user._count.reviews} reviews</span>
                        <span>{user._count.products} products</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* Role change buttons */}
                        {user.role !== "PUBLISHER" && (
                          <form action={changeUserRole.bind(null, user.id, "PUBLISHER")}>
                            <button type="submit" className="text-xs font-medium text-saffron hover:text-saffron/80 hover:bg-saffron/5 px-2 py-1 rounded-md transition-colors">
                              → Publisher
                            </button>
                          </form>
                        )}
                        {user.role !== "USER" && user.role !== "ADMIN" && (
                          <form action={changeUserRole.bind(null, user.id, "USER")}>
                            <button type="submit" className="text-xs font-medium text-indigo hover:text-indigo/80 hover:bg-indigo/5 px-2 py-1 rounded-md transition-colors">
                              → User
                            </button>
                          </form>
                        )}
                        {/* Suspend/Activate */}
                        {user.status === "ACTIVE" ? (
                          <form action={suspendUser.bind(null, user.id)}>
                            <button type="submit" className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors">
                              Suspend
                            </button>
                          </form>
                        ) : (
                          <form action={activateUser.bind(null, user.id)}>
                            <button type="submit" className="text-xs font-medium text-teal hover:text-teal/80 hover:bg-teal/5 px-2 py-1 rounded-md transition-colors">
                              Activate
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
