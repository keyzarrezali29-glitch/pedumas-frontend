import { ShieldCheck, Users, UserPlus, Crown, Trash2, Plus, Search, Activity, User2, Mail, Lock, X, BarChart3, TrendingUp, Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function DashboardSuperAdmin() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  const [users, setUsers]           = useState([])
  const [activities, setActivities] = useState([])
  const [showModal, setShowModal]   = useState(false)
  const [showPass, setShowPass]     = useState(false)
  const [name, setName]             = useState("")
  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [search, setSearch]         = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [activeTab, setActiveTab]   = useState("users")

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://backend-pengaduan-production.up.railway.app/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(res.data)
    } catch (err) { console.log(err) }
  }

  const fetchActivities = async () => {
    try {
      const res = await axios.get("https://backend-pengaduan-production.up.railway.app/api/activity")
      setActivities(res.data)
    } catch (err) { console.log(err) }
  }

  useEffect(() => {
    fetchUsers()
    fetchActivities()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                        user.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" ? true : user.role === roleFilter
    return matchSearch && matchRole
  })

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    try {
      await axios.post("https://backend-pengaduan-production.up.railway.app/api/users/admin", { name, email, password }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Admin berhasil ditambahkan")
      setShowModal(false); setName(""); setEmail(""); setPassword("")
      fetchUsers(); fetchActivities()
    } catch { toast.error("Gagal tambah admin") }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus user ini?")) return
    try {
      await axios.delete(`https://backend-pengaduan-production.up.railway.app/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("User berhasil dihapus")
      fetchUsers(); fetchActivities()
    } catch { toast.error("Gagal hapus user") }
  }

  // STATS
  const totalUsers  = users.length
  const totalAdmin  = users.filter(u => u.role === "admin").length
  const totalUser   = users.filter(u => u.role === "user").length
  const totalSuper  = users.filter(u => u.role === "super_admin").length

  const chartData = [
    { name:"User", value:totalUser, color:"#059669" },
    { name:"Admin", value:totalAdmin, color:R.main },
    { name:"Super Admin", value:totalSuper, color:"#7C3AED" },
  ]

  const roleStyle = (role) => ({
    fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100,
    background: role==="super_admin"?"#EDE9FE":role==="admin"?R.light:"#D1FAE5",
    color: role==="super_admin"?"#7C3AED":role==="admin"?R.main:"#059669"
  })

  const inputStyle = {
    width:"100%", padding:"12px 16px", border:`1.5px solid ${R.light}`, borderRadius:12,
    fontSize:14, outline:"none", color:R.text, fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:"border-box"
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sa-field:focus { border-color: #B22222 !important; box-shadow: 0 0 0 3px rgba(178,34,34,.1); }
        .tab-btn { padding:10px 20px; border-radius:10px; font-weight:700; font-size:14px; cursor:pointer; border:none; transition:all .2s; font-family:'Plus Jakarta Sans',sans-serif; }
        .tab-btn.active { background:linear-gradient(135deg,#7B0D1E,#B22222); color:white; box-shadow:0 4px 16px rgba(123,13,30,.3); }
        .tab-btn.inactive { background:white; color:#7a3535; border:1.5px solid #F5D5D5; }
      `}</style>

      {/* HERO */}
      <div style={{
        position:"relative", overflow:"hidden", borderRadius:24,
        background:`linear-gradient(135deg, ${R.dark} 0%, ${R.main} 55%, ${R.mid} 100%)`,
        padding:"36px 44px", color:"white", boxShadow:"0 16px 48px rgba(123,13,30,.3)"
      }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.2)", padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:700, marginBottom:16 }}>
              <Crown size={13} /> SUPER ADMIN PANEL
            </div>
            <h1 style={{ fontSize:38, fontWeight:800, marginBottom:8, lineHeight:1.2 }}>Dashboard Super Admin</h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.7 }}>
              Kelola seluruh pengguna, admin, dan sistem PEDUMAS secara terpusat.
            </p>
          </div>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Crown size={36} color="white" />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        {[
          { label:"Total Pengguna", value:totalUsers,  color:R.main,    bg:R.light,   icon:<Users size={24}/> },
          { label:"User Aktif",     value:totalUser,   color:"#059669", bg:"#D1FAE5", icon:<User2 size={24}/> },
          { label:"Total Admin",    value:totalAdmin,  color:R.main,    bg:R.light,   icon:<ShieldCheck size={24}/> },
          { label:"Super Admin",    value:totalSuper,  color:"#7C3AED", bg:"#EDE9FE", icon:<Crown size={24}/> },
        ].map((s,i) => (
          <div key={i} style={{ background:"white", borderRadius:18, padding:"22px 20px", border:`1.5px solid ${R.light}`, boxShadow:"0 4px 16px rgba(0,0,0,.04)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:12, color:R.muted, fontWeight:600, marginBottom:8 }}>{s.label}</p>
              <p style={{ fontSize:36, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</p>
            </div>
            <div style={{ width:44, height:44, borderRadius:12, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", color:s.color }}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CHART + ACTIVITY */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* BAR CHART */}
        <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
            <div style={{ width:8, height:28, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
            <h2 style={{ fontSize:17, fontWeight:800, color:R.text }}>Distribusi Pengguna</h2>
          </div>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5D5D5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize:12, fontFamily:"Plus Jakarta Sans" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill:"#FDF5F5" }} />
                <Bar dataKey="value" radius={[8,8,0,0]}>
                  {chartData.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:16, justifyContent:"center" }}>
            {chartData.map((item,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:item.color }} />
                <span style={{ fontSize:12, color:R.muted }}>{item.name}: <strong style={{ color:R.text }}>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:8, height:28, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
            <h2 style={{ fontSize:17, fontWeight:800, color:R.text }}>Aktivitas Terbaru</h2>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:220, overflowY:"auto" }}>
            {activities.slice(0,5).length > 0 ? activities.slice(0,5).map(item => (
              <div key={item.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 14px", background:R.light, borderRadius:12 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${R.main},${R.mid})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ color:"white", fontWeight:800, fontSize:14 }}>{item.name?.charAt(0)}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, fontSize:13, color:R.text }}>{item.name}</p>
                  <p style={{ fontSize:12, color:R.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.activity}</p>
                  <p style={{ fontSize:11, color:R.soft, marginTop:2 }}>
                    {new Date(item.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            )) : (
              <div style={{ textAlign:"center", padding:"32px 0" }}>
                <Activity size={36} color={R.soft} style={{ margin:"0 auto 10px" }} />
                <p style={{ color:R.muted, fontSize:14 }}>Belum ada aktivitas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>

        {/* TAB HEADER */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", gap:8 }}>
            <button className={`tab-btn ${activeTab==="users"?"active":"inactive"}`} onClick={() => setActiveTab("users")}>
              Data Pengguna
            </button>
            <button className={`tab-btn ${activeTab==="activity"?"active":"inactive"}`} onClick={() => setActiveTab("activity")}>
              Activity Log
            </button>
          </div>

          {activeTab === "users" && (
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button onClick={() => setShowModal(true)} style={{
                display:"flex", alignItems:"center", gap:8, padding:"10px 18px",
                background:`linear-gradient(135deg,${R.main},${R.mid})`, color:"white",
                borderRadius:12, fontWeight:700, fontSize:13, border:"none", cursor:"pointer",
                boxShadow:"0 6px 20px rgba(178,34,34,.3)", fontFamily:"'Plus Jakarta Sans',sans-serif"
              }}>
                <Plus size={16} /> Tambah Admin
              </button>
              <div style={{ position:"relative" }}>
                <Search size={15} color={R.soft} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }} />
                <input type="text" placeholder="Cari user..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ padding:"10px 14px 10px 34px", border:`1.5px solid ${R.light}`, borderRadius:12, fontSize:13, outline:"none", color:R.text, width:180, fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
              </div>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{
                padding:"10px 14px", border:`1.5px solid ${R.light}`, borderRadius:12,
                fontSize:13, outline:"none", color:R.text, fontFamily:"'Plus Jakarta Sans',sans-serif", background:"white"
              }}>
                <option value="all">Semua Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB CONTENT — USERS */}
        {activeTab === "users" && (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:R.light }}>
                  {["No","Nama","Email","Role","Aksi"].map((h,i) => (
                    <th key={i} style={{ padding:"12px 16px", textAlign:"left", fontSize:13, fontWeight:700, color:R.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((item,i) => (
                  <tr key={item.id} style={{ borderBottom:`1px solid ${R.light}` }}
                    onMouseEnter={e => e.currentTarget.style.background="#FDF5F5"}
                    onMouseLeave={e => e.currentTarget.style.background="white"}
                  >
                    <td style={{ padding:"14px 16px", fontSize:14, color:R.muted }}>{i+1}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${R.main},${R.mid})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <span style={{ color:"white", fontWeight:700, fontSize:13 }}>{item.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <span
                          onClick={() => navigate(`/superadmin/user/${item.id}`)}
                          style={{ fontWeight:700, fontSize:14, color:R.main, cursor:"pointer", textDecoration:"underline", textDecorationColor:R.soft }}
                        >{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:R.muted }}>{item.email}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={roleStyle(item.role)}>{item.role}</span>
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      {item.role !== "super_admin" ? (
                        <button onClick={() => handleDelete(item.id)} style={{
                          background:"#FEE2E2", color:"#DC2626", border:"none",
                          borderRadius:8, padding:"8px 12px", cursor:"pointer",
                          display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600,
                          fontFamily:"'Plus Jakarta Sans',sans-serif"
                        }}>
                          <Trash2 size={14} /> Hapus
                        </button>
                      ) : (
                        <span style={{ fontSize:12, color:R.soft }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding:"40px", textAlign:"center", color:R.muted }}>
                      <Users size={36} color={R.soft} style={{ margin:"0 auto 12px" }} />
                      <p style={{ fontWeight:600 }}>Tidak ada user ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB CONTENT — ACTIVITY */}
        {activeTab === "activity" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12, maxHeight:480, overflowY:"auto" }}>
            {activities.length > 0 ? activities.map(item => (
              <div key={item.id} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 16px", background:R.light, borderRadius:14 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:`linear-gradient(135deg,${R.main},${R.mid})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ color:"white", fontWeight:800, fontSize:16 }}>{item.name?.charAt(0)}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <p style={{ fontWeight:700, fontSize:15, color:R.text }}>{item.name}</p>
                    <p style={{ fontSize:12, color:R.soft }}>{new Date(item.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  <p style={{ fontSize:13, color:R.muted, marginTop:4, lineHeight:1.6 }}>{item.activity}</p>
                </div>
              </div>
            )) : (
              <div style={{ textAlign:"center", padding:"48px" }}>
                <Activity size={48} color={R.soft} style={{ margin:"0 auto 16px" }} />
                <p style={{ fontWeight:700, color:R.text, marginBottom:6 }}>Belum Ada Aktivitas</p>
                <p style={{ fontSize:14, color:R.muted }}>Semua aktivitas sistem akan tampil di sini.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL TAMBAH ADMIN */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99999, padding:20 }}>
          <div style={{ background:"white", width:"100%", maxWidth:480, borderRadius:24, overflow:"hidden", boxShadow:"0 24px 60px rgba(0,0,0,.2)" }}>
            <div style={{ background:`linear-gradient(135deg,${R.dark},${R.main},${R.mid})`, padding:"24px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <UserPlus size={22} color="white" />
                </div>
                <div>
                  <h2 style={{ color:"white", fontSize:20, fontWeight:800 }}>Tambah Admin</h2>
                  <p style={{ color:"rgba(255,255,255,.7)", fontSize:13 }}>Buat akun admin baru</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:10, padding:10, cursor:"pointer", display:"flex" }}>
                <X size={18} color="white" />
              </button>
            </div>
            <form onSubmit={handleAddAdmin} style={{ padding:28, display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ display:"flex", alignItems:"center", gap:8, fontWeight:600, fontSize:14, color:R.text, marginBottom:8 }}>
                  <User2 size={15} color={R.main} /> Nama Admin
                </label>
                <input className="sa-field" style={inputStyle} type="text" placeholder="Masukkan nama" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display:"flex", alignItems:"center", gap:8, fontWeight:600, fontSize:14, color:R.text, marginBottom:8 }}>
                  <Mail size={15} color={R.main} /> Email
                </label>
                <input className="sa-field" style={inputStyle} type="email" placeholder="Masukkan email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ display:"flex", alignItems:"center", gap:8, fontWeight:600, fontSize:14, color:R.text, marginBottom:8 }}>
                  <Lock size={15} color={R.main} /> Password
                </label>
                <div style={{ position:"relative" }}>
                  <input className="sa-field" style={inputStyle} type={showPass?"text":"password"} placeholder="Masukkan password" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:R.soft }}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex:1, padding:13, background:"#f9f9f9", border:`1.5px solid ${R.light}`,
                  borderRadius:12, fontWeight:600, fontSize:14, cursor:"pointer", color:R.muted,
                  fontFamily:"'Plus Jakarta Sans',sans-serif"
                }}>
                  Batal
                </button>
                <button type="submit" style={{
                  flex:1, padding:13, background:`linear-gradient(135deg,${R.dark},${R.main},${R.mid})`,
                  color:"white", fontWeight:700, fontSize:14, border:"none", borderRadius:12, cursor:"pointer",
                  boxShadow:"0 6px 20px rgba(123,13,30,.3)", fontFamily:"'Plus Jakarta Sans',sans-serif"
                }}>
                  Tambah Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}