import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, User2, Mail, ShieldCheck, Calendar, Crown, Trash2, Activity } from "lucide-react"
import toast from "react-hot-toast"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function DetailUserAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

  const [user, setUser] = useState(null)
  const [activities, setActivities] = useState([])
  const [reports, setReports] = useState([])

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const found = res.data.find(u => String(u.id) === String(id))
      if (found) setUser(found)
    } catch { toast.error("Gagal mengambil data user") }
  }

  const fetchActivities = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/activity", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const userActivities = res.data.filter(a => String(a.user_id) === String(id))
      setActivities(userActivities)
    } catch { console.log("activity not found") }
  }

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/laporan", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const userReports = res.data.filter(r => String(r.user_id) === String(id))
      setReports(userReports)
    } catch { console.log("reports error") }
  }

  useEffect(() => {
    fetchUser()
    fetchActivities()
    fetchReports()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm(`Hapus akun ${user?.name}?`)) return
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("User berhasil dihapus")
      navigate("/admin/pelapor")
    } catch { toast.error("Gagal hapus user") }
  }

  const roleColor = (role) => ({
    bg: role==="super_admin"?"#EDE9FE":role==="admin"?R.light:"#D1FAE5",
    text: role==="super_admin"?"#7C3AED":role==="admin"?R.main:"#059669",
    label: role==="super_admin"?"SUPER ADMIN":role==="admin"?"ADMIN":"USER MASYARAKAT"
  })

  const statusStyle = (s) => ({
    fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100,
    background: s==="approved"?"#D1FAE5":s==="rejected"?"#FEE2E2":"#FEF3C7",
    color: s==="approved"?"#059669":s==="rejected"?"#DC2626":"#D97706"
  })

  if (!user) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"60vh" }}>
      <div style={{ width:40, height:40, borderRadius:"50%", border:`4px solid ${R.light}`, borderTopColor:R.main, animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const rc = roleColor(user.role)

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* BACK */}
      <button onClick={() => navigate(-1)} style={{ display:"inline-flex", alignItems:"center", gap:8, color:R.muted, fontSize:14, fontWeight:600, padding:"8px 16px", borderRadius:10, border:`1.5px solid ${R.light}`, background:"white", cursor:"pointer", width:"fit-content", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      {/* HERO */}
      <div style={{ position:"relative", overflow:"hidden", borderRadius:24, background:`linear-gradient(135deg,${R.dark},${R.main},${R.mid})`, padding:"36px 44px", color:"white", boxShadow:"0 16px 48px rgba(123,13,30,.3)" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {user.photo ? (
                <img src={`http://localhost:3000/uploads/${user.photo}`} alt="" style={{ width:80, height:80, borderRadius:"50%", objectFit:"cover" }} />
              ) : (
                <span style={{ color:"white", fontWeight:800, fontSize:32 }}>{user.name?.charAt(0)?.toUpperCase()}</span>
              )}
            </div>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontWeight:700, marginBottom:10 }}>
                <Crown size={12} /> DETAIL PENGGUNA
              </div>
              <h1 style={{ fontSize:32, fontWeight:800, marginBottom:4 }}>{user.name}</h1>
              <p style={{ color:"rgba(255,255,255,.75)", fontSize:14 }}>{user.email}</p>
            </div>
          </div>
          <span style={{ background:rc.bg, color:rc.text, padding:"8px 20px", borderRadius:100, fontSize:13, fontWeight:700 }}>
            {rc.label}
          </span>
        </div>
      </div>

      {/* GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:24, alignItems:"start" }}>

        {/* LEFT — INFO CARD */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* PROFILE INFO */}
          <div style={{ background:"white", borderRadius:20, padding:24, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:8, height:24, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
              <h2 style={{ fontSize:15, fontWeight:800, color:R.text }}>Informasi Akun</h2>
            </div>

            {/* AVATAR */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:20 }}>
              <div style={{ width:100, height:100, borderRadius:"50%", border:`4px solid ${R.light}`, overflow:"hidden", marginBottom:12, background:`linear-gradient(135deg,${R.main},${R.mid})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {user.photo ? (
                  <img src={`http://localhost:3000/uploads/${user.photo}`} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                ) : (
                  <span style={{ color:"white", fontWeight:800, fontSize:36 }}>{user.name?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <h3 style={{ fontWeight:800, fontSize:18, color:R.text, marginBottom:4 }}>{user.name}</h3>
              <p style={{ fontSize:13, color:R.muted }}>{user.email}</p>
            </div>

            {/* DETAIL */}
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {[
                { icon:<User2 size={15}/>, label:"Nama", value:user.name },
                { icon:<Mail size={15}/>, label:"Email", value:user.email },
                { icon:<ShieldCheck size={15}/>, label:"Role", value:user.role?.replace(/_/g," ") },
                { icon:<Calendar size={15}/>, label:"Bergabung", value:new Date(user.created_at).toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" }) },
              ].map((item,i,arr) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${R.light}`:"none" }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:R.light, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:R.main }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:R.muted, fontWeight:600 }}>{item.label}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:R.text }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ background:"white", borderRadius:16, padding:"18px 16px", border:`1.5px solid ${R.light}`, textAlign:"center" }}>
              <p style={{ fontSize:32, fontWeight:800, color:R.main }}>{reports.length}</p>
              <p style={{ fontSize:12, color:R.muted, marginTop:4 }}>Laporan</p>
            </div>
            <div style={{ background:"white", borderRadius:16, padding:"18px 16px", border:`1.5px solid ${R.light}`, textAlign:"center" }}>
              <p style={{ fontSize:32, fontWeight:800, color:"#059669" }}>{activities.length}</p>
              <p style={{ fontSize:12, color:R.muted, marginTop:4 }}>Aktivitas</p>
            </div>
          </div>

          {/* DELETE BUTTON */}
          {user.role !== "super_admin" && (
            <button onClick={handleDelete} style={{
              width:"100%", padding:"13px", background:"#FEE2E2",
              color:"#DC2626", fontWeight:700, fontSize:14, border:"1.5px solid #FECACA",
              borderRadius:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all .2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.background="#DC2626"; e.currentTarget.style.color="white" }}
              onMouseLeave={e => { e.currentTarget.style.background="#FEE2E2"; e.currentTarget.style.color="#DC2626" }}
            >
              <Trash2 size={16} /> Hapus Akun Ini
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* LAPORAN USER */}
          {user.role === "user" && (
            <div style={{ background:"white", borderRadius:20, padding:24, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div style={{ width:8, height:24, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
                <h2 style={{ fontSize:15, fontWeight:800, color:R.text }}>Laporan Pengaduan ({reports.length})</h2>
              </div>

              {reports.length > 0 ? (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {reports.map(report => (
                    <div key={report.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:R.light, borderRadius:14, gap:12 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontWeight:700, fontSize:14, color:R.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{report.title}</p>
                        <p style={{ fontSize:12, color:R.muted, marginTop:2 }}>
                          {new Date(report.created_at).toLocaleDateString("id-ID")}
                          {report.category_name ? ` • ${report.category_name}` : ""}
                        </p>
                      </div>
                      <span style={statusStyle(report.status)}>{report.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign:"center", padding:"32px 0" }}>
                  <p style={{ color:R.muted, fontSize:14 }}>Belum ada laporan</p>
                </div>
              )}
            </div>
          )}

          {/* ACTIVITY LOG */}
          <div style={{ background:"white", borderRadius:20, padding:24, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:8, height:24, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
              <h2 style={{ fontSize:15, fontWeight:800, color:R.text }}>Riwayat Aktivitas ({activities.length})</h2>
            </div>

            {activities.length > 0 ? (
              <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:400, overflowY:"auto" }}>
                {activities.map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", background:R.light, borderRadius:12 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${R.main},${R.mid})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Activity size={16} color="white" />
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:13, fontWeight:600, color:R.text }}>{item.activity}</p>
                      <p style={{ fontSize:11, color:R.soft, marginTop:4 }}>
                        {new Date(item.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign:"center", padding:"32px 0" }}>
                <Activity size={36} color={R.soft} style={{ margin:"0 auto 10px" }} />
                <p style={{ color:R.muted, fontSize:14 }}>Belum ada aktivitas</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}