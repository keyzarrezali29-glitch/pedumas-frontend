import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, FolderKanban, MessageSquareWarning, LogOut, Bell, ShieldCheck, UserCircle } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"

export default function AdminLayout() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const token     = localStorage.getItem("token")
  const user      = JSON.parse(localStorage.getItem("user") || "{}")

  const [notifications, setNotifications] = useState([])
  const [showNotif, setShowNotif]         = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(res.data)
    } catch (err) { console.log(err) }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 5000)
    return () => clearInterval(interval)
  }, [])

  const readNotification = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/notifications/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchNotifications()
    } catch (err) { console.log(err) }
  }

  const logout = () => { localStorage.clear(); navigate("/") }

  const unreadCount = notifications.filter(n => !n.is_read).length

  const menus = [
    { title:"Dashboard",        icon:<LayoutDashboard size={20}/>,      path:"/admin/dashboard" },
    { title:"Data Pelapor",     icon:<Users size={20}/>,                path:"/admin/pelapor" },
    { title:"Data Kategori",    icon:<FolderKanban size={20}/>,         path:"/admin/categories" },
    { title:"Kelola Pengaduan", icon:<MessageSquareWarning size={20}/>, path:"/admin/pengaduan" },
    { title:"Profile",          icon:<UserCircle size={20}/>,           path:"/admin/profile" },
  ]

  return (
    <div style={{ minHeight:"100vh", background:"#FDF5F5", display:"flex", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .adm-link { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:14px; font-weight:600; font-size:14px; text-decoration:none; transition:all .2s; color:rgba(255,255,255,.8); }
        .adm-link:hover { background:rgba(255,255,255,.15); color:white; }
        .adm-link.active { background:white; color:#B22222; box-shadow:0 4px 16px rgba(0,0,0,.1); }
        .notif-item { padding:14px 20px; border-bottom:1px solid #F5D5D5; cursor:pointer; transition:background .2s; }
        .notif-item:hover { background:#FDF5F5; }
        .notif-item.unread { background:#FFF0F0; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{
        position:"fixed", top:0, left:0, height:"100vh", width:260,
        background:"linear-gradient(180deg, #7B0D1E 0%, #B22222 60%, #CD5C5C 100%)",
        zIndex:50, display:"flex", flexDirection:"column",
        boxShadow:"4px 0 24px rgba(123,13,30,.25)"
      }}>

        {/* LOGO */}
        <div style={{ padding:"32px 24px 24px", borderBottom:"1px solid rgba(255,255,255,.15)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ShieldCheck size={18} color="white" />
            </div>
            <div style={{ color:"white", fontSize:22, fontWeight:800 }}>PEDUMAS</div>
          </div>
          <div style={{ color:"rgba(255,255,255,.6)", fontSize:12, marginLeft:46 }}>Administrator Panel</div>
        </div>

        {/* MENU */}
        <div style={{ padding:"20px 16px", flex:1, display:"flex", flexDirection:"column", gap:4 }}>
          {menus.map((item, i) => (
            <Link key={i} to={item.path}
              className={`adm-link ${location.pathname === item.path ? "active" : ""}`}>
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>

        {/* LOGOUT */}
        <div style={{ padding:"16px 16px 28px" }}>
          <button onClick={logout} style={{
            width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            background:"rgba(255,255,255,.15)", border:"1.5px solid rgba(255,255,255,.25)",
            color:"white", padding:"12px", borderRadius:14,
            fontWeight:700, fontSize:14, cursor:"pointer", transition:"all .2s",
            fontFamily:"'Plus Jakarta Sans',sans-serif"
          }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.25)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.15)"}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex:1, marginLeft:260 }}>

        {/* TOPBAR */}
        <div style={{
          position:"sticky", top:0, zIndex:30,
          background:"rgba(255,255,255,.92)", backdropFilter:"blur(20px)",
          borderBottom:"1px solid #F5D5D5",
          padding:"16px 32px",
          display:"flex", alignItems:"center", justifyContent:"space-between"
        }}>

          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"#1a0505" }}>PEDUMAS</div>
            <div style={{ fontSize:12, color:"#7a3535" }}>Administrator Panel</div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:16, position:"relative" }}>

            {/* BELL */}
            <button onClick={() => setShowNotif(!showNotif)} style={{
              position:"relative", background:"white", border:"1.5px solid #F5D5D5",
              borderRadius:14, padding:"10px 12px", cursor:"pointer",
              boxShadow:"0 2px 12px rgba(0,0,0,.06)", transition:"all .2s"
            }}>
              <Bell size={20} color="#B22222" />
              {unreadCount > 0 && (
                <div style={{
                  position:"absolute", top:-6, right:-6,
                  width:20, height:20, borderRadius:"50%",
                  background:"#B22222", color:"white",
                  fontSize:11, fontWeight:700,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  border:"2px solid white"
                }}>
                  {unreadCount}
                </div>
              )}
            </button>

            {/* NOTIF DROPDOWN */}
            {showNotif && (
              <div style={{
                position:"absolute", top:56, right:0,
                width:360, background:"white",
                borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,.12)",
                border:"1.5px solid #F5D5D5", overflow:"hidden", zIndex:9999
              }}>
                <div style={{ padding:"18px 20px", borderBottom:"1px solid #F5D5D5", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ fontSize:16, fontWeight:800, color:"#1a0505" }}>Notifikasi</div>
                  {unreadCount > 0 && (
                    <span style={{ background:"#F5D5D5", color:"#B22222", fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:100 }}>
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                <div style={{ maxHeight:400, overflowY:"auto" }}>
                  {notifications.length > 0 ? notifications.map(item => (
                    <div key={item.id}
                      className={`notif-item ${!item.is_read ? "unread" : ""}`}
                      onClick={() => {
                        readNotification(item.id)
                        navigate("/admin/pengaduan")
                        setShowNotif(false)
                      }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                        <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:"linear-gradient(135deg,#7B0D1E,#B22222)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Bell size={16} color="white" />
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                            <span style={{ fontWeight:700, fontSize:14, color:"#1a0505" }}>{item.title}</span>
                            {!item.is_read && <div style={{ width:8, height:8, borderRadius:"50%", background:"#B22222" }} />}
                          </div>
                          <p style={{ fontSize:13, color:"#7a3535", marginTop:4, lineHeight:1.6 }}>{item.message}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding:"40px 24px", textAlign:"center" }}>
                      <Bell size={32} color="#E8A0A0" style={{ margin:"0 auto 12px" }} />
                      <p style={{ fontWeight:600, color:"#1a0505", marginBottom:4 }}>Tidak Ada Notifikasi</p>
                      <p style={{ fontSize:13, color:"#7a3535" }}>Semua notifikasi akan muncul disini.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* USER — klik ke profile */}
            <div
              onClick={() => navigate("/admin/profile")}
              style={{
                background:"white", borderRadius:14, padding:"8px 16px 8px 8px",
                border:"1.5px solid #F5D5D5", display:"flex", alignItems:"center", gap:12,
                boxShadow:"0 2px 12px rgba(0,0,0,.06)", cursor:"pointer", transition:"all .2s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#E8A0A0"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#F5D5D5"}
            >
              <img
                src={user?.photo ? `http://localhost:3000/uploads/${user.photo}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||"A")}&background=B22222&color=fff`}
                alt="" style={{ width:38, height:38, borderRadius:10, objectFit:"cover", border:"2px solid #F5D5D5" }}
              />
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:"#B22222" }}>{user?.name}</div>
                <div style={{ fontSize:11, color:"#7a3535" }}>{user?.role === "super_admin" ? "Super Admin" : "Admin"}</div>
              </div>
            </div>

          </div>
        </div>

        {/* PAGE */}
        <div style={{ padding:"32px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}