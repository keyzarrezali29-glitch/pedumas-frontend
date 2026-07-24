import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, PlusCircle, FileText, User, LogOut, Bell, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import useIsMobile from "../hooks/useIsMobile"

export default function UserLayout() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const user      = JSON.parse(localStorage.getItem("user") || "{}")
  const token     = localStorage.getItem("token")
  const isMobile  = useIsMobile()

  const [notifications, setNotifications] = useState([])
  const [showNotif, setShowNotif]         = useState(false)
  const [sidebarOpen, setSidebarOpen]     = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("https://backend-pengaduan-production.up.railway.app/api/notifications", {
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
      await axios.put(`https://backend-pengaduan-production.up.railway.app/api/notifications/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchNotifications()
    } catch (err) { console.log(err) }
  }

  const logout = () => { localStorage.clear(); navigate("/") }

  const unreadCount = notifications.filter(n => !n.is_read).length

  const menus = [
    { title:"Dashboard",      icon:<LayoutDashboard size={20}/>, path:"/user/dashboard" },
    { title:"Form Pengaduan", icon:<PlusCircle size={20}/>,      path:"/user/create-report" },
    { title:"Daftar Pengaduan",icon:<FileText size={20}/>,       path:"/user/reports" },
    { title:"Profile",        icon:<User size={20}/>,            path:"/user/profile" },
  ]

  return (
    <div style={{ minHeight:"100vh", background:"#FDF5F5", display:"flex", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sidebar-link { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:14px; font-weight:600; font-size:14px; text-decoration:none; transition:all .2s; color:rgba(255,255,255,.8); }
        .sidebar-link:hover { background:rgba(255,255,255,.15); color:white; }
        .sidebar-link.active { background:white; color:#B22222; box-shadow:0 4px 16px rgba(0,0,0,.1); }
        .notif-item { padding:16px 20px; border-bottom:1px solid #F5D5D5; cursor:pointer; transition:background .2s; }
        .notif-item:hover { background:#FDF5F5; }
        .notif-item.unread { background:#FFF0F0; }
      `}</style>

      {/* MOBILE OVERLAY */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:40 }} />
      )}

      {/* SIDEBAR */}
      <div style={{
        position:"fixed", top:0, left:0, height:"100vh", width:260,
        background:"linear-gradient(180deg, #7B0D1E 0%, #B22222 60%, #CD5C5C 100%)",
        zIndex:50, display:"flex", flexDirection:"column",
        boxShadow:"4px 0 24px rgba(123,13,30,.25)",
        transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
        transition:"transform .3s"
      }}>

        {/* LOGO */}
        <div style={{ padding:"32px 24px 24px", borderBottom:"1px solid rgba(255,255,255,.15)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ color:"white", fontSize:28, fontWeight:800, letterSpacing:"-.02em" }}>PEDUMAS</div>
              <div style={{ color:"rgba(255,255,255,.65)", fontSize:12, marginTop:4 }}>Pengaduan Masyarakat</div>
            </div>
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)}
                style={{ background:"none", border:"none", color:"white", cursor:"pointer" }}>
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* MENU */}
        <div style={{ padding:"20px 16px", flex:1, display:"flex", flexDirection:"column", gap:4 }}>
          {menus.map((item, i) => (
            <Link key={i} to={item.path}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}>
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
      <div style={{ flex:1, marginLeft: isMobile ? 0 : 260 }}>

        {/* TOPBAR */}
        <div style={{
          position:"sticky", top:0, zIndex:30,
          background:"rgba(255,255,255,.92)", backdropFilter:"blur(20px)",
          borderBottom:"1px solid #F5D5D5",
          padding: isMobile ? "16px 16px" : "16px 32px",
          display:"flex", alignItems:"center", justifyContent:"space-between"
        }}>

          {/* LEFT */}
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <button onClick={() => setSidebarOpen(true)}
              style={{ background:"#F5D5D5", border:"none", borderRadius:12, padding:10, cursor:"pointer", color:"#B22222" }}>
              <Menu size={20} />
            </button>
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:"#1a0505" }}>PEDUMAS</div>
              <div style={{ fontSize:12, color:"#7a3535" }}>Premium Dashboard</div>
            </div>
          </div>

          {/* RIGHT */}
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
                position: isMobile ? "fixed" : "absolute",
                top: isMobile ? 70 : 56,
                right: isMobile ? 12 : 0,
                left: isMobile ? 12 : "auto",
                width: isMobile ? "auto" : 380,
                background:"white",
                borderRadius:24, boxShadow:"0 20px 60px rgba(0,0,0,.12)",
                border:"1.5px solid #F5D5D5", overflow:"hidden", zIndex:9999
              }}>
                <div style={{ padding:"20px 24px", borderBottom:"1px solid #F5D5D5", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:18, fontWeight:800, color:"#1a0505" }}>Notifikasi</div>
                    <div style={{ fontSize:12, color:"#7a3535", marginTop:2 }}>Update laporan realtime</div>
                  </div>
                  {unreadCount > 0 && (
                    <span style={{ background:"#F5D5D5", color:"#B22222", fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:100 }}>
                      {unreadCount} baru
                    </span>
                  )}
                </div>

                <div style={{ maxHeight:420, overflowY:"auto" }}>
                  {notifications.length > 0 ? notifications.map((item) => (
                    <div key={item.id}
                      className={`notif-item ${!item.is_read ? "unread" : ""}`}
                      onClick={() => {
                        readNotification(item.id)
                        navigate(`/user/detail-report/${item.laporan_id}`)
                        setShowNotif(false)
                      }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                        <div style={{
                          width:40, height:40, borderRadius:12, flexShrink:0,
                          background:"linear-gradient(135deg,#7B0D1E,#B22222)",
                          display:"flex", alignItems:"center", justifyContent:"center"
                        }}>
                          <Bell size={18} color="white" />
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                            <span style={{ fontWeight:700, fontSize:14, color:"#1a0505" }}>{item.title}</span>
                            {!item.is_read && (
                              <div style={{ width:8, height:8, borderRadius:"50%", background:"#B22222" }} />
                            )}
                          </div>
                          <p style={{ fontSize:13, color:"#7a3535", marginTop:4, lineHeight:1.6 }}>{item.message}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding:"48px 24px", textAlign:"center" }}>
                      <div style={{ width:56, height:56, borderRadius:"50%", background:"#F5D5D5", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Bell size={24} color="#B22222" />
                      </div>
                      <p style={{ fontWeight:700, color:"#1a0505", marginBottom:6 }}>Tidak Ada Notifikasi</p>
                      <p style={{ fontSize:13, color:"#7a3535" }}>Semua update laporan akan muncul disini.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* USER */}
            <div style={{
              background:"white", borderRadius:14,
              padding: isMobile ? "6px 10px 6px 6px" : "8px 16px 8px 8px",
              border:"1.5px solid #F5D5D5", display:"flex", alignItems:"center", gap:12,
              boxShadow:"0 2px 12px rgba(0,0,0,.06)"
            }}>
              <img
                src={user?.photo ? `https://backend-pengaduan-production.up.railway.app/uploads/${user.photo}` : "https://i.pravatar.cc/100"}
                alt=""
                style={{ width:40, height:40, borderRadius:10, objectFit:"cover", border:"2px solid #F5D5D5" }}
              />
              {!isMobile && (
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:"#B22222" }}>{user?.name}</div>
                  <div style={{ fontSize:11, color:"#7a3535" }}>User Masyarakat</div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ padding: isMobile ? "16px" : "32px" }}>
          <Outlet />
        </div>

      </div>
    </div>
  )
}