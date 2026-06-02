import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Search, Users, User2, ShieldCheck, Mail, CalendarDays, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function DataPelapor() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 8
  const navigate = useNavigate()

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(res.data)
    } catch { toast.error("Gagal mengambil data user") }
  }

  useEffect(() => { fetchUsers() }, [])

  const filteredUsers = useMemo(() =>
    users.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
    )
  , [users, search])

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const currentUsers = filteredUsers.slice((currentPage-1)*usersPerPage, currentPage*usersPerPage)

  const totalUsers = users.length
  const totalAdmin = users.filter(u => u.role === "admin").length
  const totalUser  = users.filter(u => u.role === "user").length

  const roleStyle = (role) => ({
    fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100,
    background: role==="super_admin" ? "#EDE9FE" : role==="admin" ? R.light : "#F0FDF4",
    color: role==="super_admin" ? "#7C3AED" : role==="admin" ? R.main : "#15803D"
  })

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* HERO */}
      <div style={{ position:"relative", overflow:"hidden", borderRadius:24, background:`linear-gradient(135deg,${R.dark},${R.main},${R.mid})`, padding:"36px 44px", color:"white", boxShadow:"0 16px 48px rgba(123,13,30,.3)" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.2)", padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:700, marginBottom:16 }}>
              <Users size={13} /> PEDUMAS USER MANAGEMENT
            </div>
            <h1 style={{ fontSize:36, fontWeight:800, marginBottom:8 }}>Data Pelapor</h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.7 }}>Monitoring seluruh user dan pelapor masyarakat secara realtime.</p>
          </div>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Users size={36} color="white" />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[
          { label:"Total User", value:totalUsers, color:R.main, bg:R.light, icon:<Users size={24}/> },
          { label:"User Masyarakat", value:totalUser, color:"#059669", bg:"#D1FAE5", icon:<User2 size={24}/> },
          { label:"Total Admin", value:totalAdmin, color:"#7C3AED", bg:"#EDE9FE", icon:<ShieldCheck size={24}/> },
        ].map((s,i) => (
          <div key={i} style={{ background:"white", borderRadius:18, padding:"22px 20px", border:`1.5px solid ${R.light}`, boxShadow:"0 4px 16px rgba(0,0,0,.04)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:13, color:R.muted, fontWeight:600, marginBottom:8 }}>{s.label}</p>
              <p style={{ fontSize:36, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</p>
            </div>
            <div style={{ width:44, height:44, borderRadius:12, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", color:s.color }}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:8, height:28, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
            <h2 style={{ fontSize:17, fontWeight:800, color:R.text }}>Kelola Pelapor</h2>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ position:"relative" }}>
              <Search size={16} color={R.soft} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }} />
              <input type="text" placeholder="Cari user..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                style={{ padding:"10px 16px 10px 36px", border:`1.5px solid ${R.light}`, borderRadius:12, fontSize:14, outline:"none", background:"white", color:R.text, width:220, fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
            </div>
            <button onClick={fetchUsers} style={{
              display:"flex", alignItems:"center", gap:6, padding:"10px 16px",
              background:R.light, color:R.main, borderRadius:12, fontWeight:600, fontSize:13,
              border:`1.5px solid ${R.soft}`, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif"
            }}>
              <RefreshCcw size={15} /> Refresh
            </button>
          </div>
        </div>

        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:R.light }}>
                {["No","Nama","Email","Role","Bergabung"].map((h,i) => (
                  <th key={i} style={{ padding:"12px 16px", textAlign:"left", fontSize:13, fontWeight:700, color:R.muted }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((item, i) => (
                <tr key={item.id} style={{ borderBottom:`1px solid ${R.light}` }}
                  onMouseEnter={e => e.currentTarget.style.background="#FDF5F5"}
                  onMouseLeave={e => e.currentTarget.style.background="white"}
                >
                  <td style={{ padding:"14px 16px", fontSize:14, color:R.muted }}>{(currentPage-1)*usersPerPage+i+1}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${R.main},${R.mid})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <span style={{ color:"white", fontWeight:700, fontSize:14 }}>{item.name?.charAt(0)?.toUpperCase()}</span>
                      </div>
                      <span
                          onClick={() => navigate(`/admin/user/${item.id}`)}
                          style={{ fontWeight:700, fontSize:14, color:R.main, cursor:"pointer", textDecoration:"underline", textDecorationColor:R.soft }}
                        >{item.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:"14px 16px", fontSize:13, color:R.muted }}>{item.email}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={roleStyle(item.role)}>{item.role}</span>
                  </td>
                  <td style={{ padding:"14px 16px", fontSize:13, color:R.muted }}>
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding:"48px", textAlign:"center", color:R.muted }}>
                    <Users size={36} color={R.soft} style={{ margin:"0 auto 12px" }} />
                    <p style={{ fontWeight:600 }}>Tidak ada data pelapor</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginTop:24 }}>
            <button disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)} style={{
              background:"white", border:`1.5px solid ${R.light}`, borderRadius:10, padding:"8px 12px",
              cursor:currentPage===1?"not-allowed":"pointer", opacity:currentPage===1?.4:1, display:"flex"
            }}>
              <ChevronLeft size={18} color={R.main} />
            </button>
            {[...Array(totalPages)].map((_,i) => (
              <button key={i} onClick={() => setCurrentPage(i+1)} style={{
                padding:"8px 14px", borderRadius:10, fontWeight:700, fontSize:14, border:"none", cursor:"pointer",
                background: currentPage===i+1 ? `linear-gradient(135deg,${R.main},${R.mid})` : "white",
                color: currentPage===i+1 ? "white" : R.muted,
                border: currentPage===i+1 ? "none" : `1.5px solid ${R.light}`,
                fontFamily:"'Plus Jakarta Sans',sans-serif"
              }}>{i+1}</button>
            ))}
            <button disabled={currentPage===totalPages} onClick={() => setCurrentPage(p=>p+1)} style={{
              background:"white", border:`1.5px solid ${R.light}`, borderRadius:10, padding:"8px 12px",
              cursor:currentPage===totalPages?"not-allowed":"pointer", opacity:currentPage===totalPages?.4:1, display:"flex"
            }}>
              <ChevronRight size={18} color={R.main} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}