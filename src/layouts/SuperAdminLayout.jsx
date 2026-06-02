import { LayoutDashboard, LogOut, Crown, ShieldCheck, FileText, UserCircle } from "lucide-react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"

export default function SuperAdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const menus = [
    { name:"Dashboard",      path:"/superadmin/dashboard", icon:<LayoutDashboard size={20}/> },
    { name:"Kelola Laporan", path:"/superadmin/laporan",   icon:<FileText size={20}/> },
    { name:"Profile",        path:"/superadmin/profile",   icon:<UserCircle size={20}/> },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"#FDF5F5", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sa-link { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:14px; font-weight:600; font-size:14px; text-decoration:none; transition:all .2s; color:rgba(255,255,255,.8); }
        .sa-link:hover { background:rgba(255,255,255,.15); color:white; }
        .sa-link.active { background:white; color:#7B0D1E; box-shadow:0 4px 16px rgba(0,0,0,.1); }
        .sa-logout:hover { background:rgba(255,255,255,.25) !important; }
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
              <Crown size={18} color="white" />
            </div>
            <div style={{ color:"white", fontSize:22, fontWeight:800 }}>PEDUMAS</div>
          </div>
          <div style={{ color:"rgba(255,255,255,.6)", fontSize:12, marginLeft:46 }}>Super Admin Panel</div>
        </div>

        {/* MENU */}
        <div style={{ padding:"20px 16px", flex:1, display:"flex", flexDirection:"column", gap:4 }}>

          {/* SECTION LABEL */}
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:11, fontWeight:700, letterSpacing:"0.08em", padding:"0 8px", marginBottom:4 }}>
            MENU UTAMA
          </p>

          {menus.map((menu, i) => (
            <Link key={i} to={menu.path}
              className={`sa-link ${location.pathname === menu.path ? "active" : ""}`}>
              {menu.icon}
              {menu.name}
            </Link>
          ))}

          {/* DIVIDER */}
          <div style={{ height:1, background:"rgba(255,255,255,.15)", margin:"12px 8px" }} />

          {/* SECTION LABEL */}
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:11, fontWeight:700, letterSpacing:"0.08em", padding:"0 8px", marginBottom:4 }}>
            AKSES CEPAT
          </p>

          {/* Quick stats */}
          <div style={{ padding:"14px 16px", background:"rgba(255,255,255,.1)", borderRadius:14, display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Total User", value: "—", id:"sa-stat-user" },
              { label:"Total Admin", value: "—", id:"sa-stat-admin" },
            ].map((item,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color:"rgba(255,255,255,.7)", fontSize:13 }}>{item.label}</span>
                <span id={item.id} style={{ color:"white", fontWeight:700, fontSize:14 }}>—</span>
              </div>
            ))}
          </div>

        </div>

        {/* USER INFO */}
        <div style={{ padding:"16px", borderTop:"1px solid rgba(255,255,255,.15)" }}>
          <Link to="/superadmin/profile" style={{
            display:"flex", alignItems:"center", gap:10, padding:"12px",
            background:"rgba(255,255,255,.1)", borderRadius:14, textDecoration:"none",
            transition:"background .2s"
          }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.2)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.1)"}
          >
            <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ color:"white", fontWeight:800, fontSize:16 }}>{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div>
              <div style={{ color:"white", fontWeight:700, fontSize:13 }}>{user?.name}</div>
              <div style={{ color:"rgba(255,255,255,.6)", fontSize:11 }}>Super Admin</div>
            </div>
          </Link>
        </div>

        {/* LOGOUT */}
        <div style={{ padding:"0 16px 24px" }}>
          <button onClick={handleLogout}
            className="sa-logout"
            style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              background:"rgba(255,255,255,.15)", border:"1.5px solid rgba(255,255,255,.25)",
              color:"white", padding:"12px", borderRadius:14,
              fontWeight:700, fontSize:14, cursor:"pointer", transition:"all .2s",
              fontFamily:"'Plus Jakarta Sans',sans-serif"
            }}>
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
          borderBottom:"1px solid #F5D5D5", padding:"16px 32px",
          display:"flex", alignItems:"center", justifyContent:"space-between"
        }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"#1a0505" }}>PEDUMAS</div>
            <div style={{ fontSize:12, color:"#7a3535" }}>Super Admin Panel</div>
          </div>
          <Link to="/superadmin/profile" style={{
            background:"#F5D5D5", borderRadius:14, padding:"8px 16px 8px 8px",
            display:"flex", alignItems:"center", gap:10, textDecoration:"none",
            border:"1.5px solid #E8A0A0", transition:"all .2s"
          }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#7B0D1E,#B22222)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"white", fontWeight:800 }}>{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:"#B22222" }}>{user?.name}</div>
              <div style={{ fontSize:11, color:"#7a3535" }}>Super Admin</div>
            </div>
          </Link>
        </div>

        {/* PAGE */}
        <div style={{ padding:"32px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}