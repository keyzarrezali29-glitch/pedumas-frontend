import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import { Search, Eye, ShieldCheck, FileText, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function DashboardAdmin() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState("")
  const token = localStorage.getItem("token")

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/laporan", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(res.data)
    } catch (err) {
      toast.error("Gagal mengambil laporan")
    }
  }

  useEffect(() => { fetchReports() }, [])

  const total    = reports.length
  const pending  = reports.filter(r => r.status === "pending").length
  const approved = reports.filter(r => r.status === "approved").length
  const rejected = reports.filter(r => r.status === "rejected").length

  const chartData = [
    { name: "Pending",  value: pending,  color: "#F59E0B" },
    { name: "Approved", value: approved, color: "#10B981" },
    { name: "Rejected", value: rejected, color: "#EF4444" },
  ]

  const recentReports = useMemo(() =>
    [...reports].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0,5)
  , [reports])

  const filteredReports = reports.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  )

  const statusStyle = (s) => ({
    fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:100,
    background: s==="approved" ? "#D1FAE5" : s==="rejected" ? "#FEE2E2" : "#FEF3C7",
    color: s==="approved" ? "#059669" : s==="rejected" ? "#DC2626" : "#D97706"
  })

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* HERO */}
      <div style={{
        position:"relative", overflow:"hidden", borderRadius:24,
        background:`linear-gradient(135deg, ${R.dark} 0%, ${R.main} 55%, ${R.mid} 100%)`,
        padding:"36px 44px", color:"white", boxShadow:"0 16px 48px rgba(123,13,30,.3)"
      }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
        <div style={{ position:"absolute", bottom:-40, left:"35%", width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.05)" }} />
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", gap:32 }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.2)", padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:700, marginBottom:16 }}>
              <ShieldCheck size={13} /> PEDUMAS ADMIN PANEL
            </div>
            <h1 style={{ fontSize:38, fontWeight:800, marginBottom:10, lineHeight:1.2 }}>Dashboard Admin</h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.7, maxWidth:480 }}>
              Kelola seluruh laporan pengaduan masyarakat secara realtime dan modern.
            </p>
          </div>
          <div style={{ width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <ShieldCheck size={44} color="white" />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
        {[
          { label:"Total Laporan", value:total,    color:R.main,    bg:R.light,   icon:<FileText size={26}/> },
          { label:"Pending",       value:pending,  color:"#D97706", bg:"#FEF3C7", icon:<Clock size={26}/> },
          { label:"Approved",      value:approved, color:"#059669", bg:"#D1FAE5", icon:<CheckCircle size={26}/> },
          { label:"Rejected",      value:rejected, color:"#DC2626", bg:"#FEE2E2", icon:<XCircle size={26}/> },
        ].map((s,i) => (
          <div key={i} style={{
            background:"white", borderRadius:20, padding:"24px 20px",
            border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)",
            display:"flex", justifyContent:"space-between", alignItems:"flex-start"
          }}>
            <div>
              <p style={{ fontSize:13, fontWeight:600, color:R.muted, marginBottom:10 }}>{s.label}</p>
              <p style={{ fontSize:40, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</p>
            </div>
            <div style={{ width:48, height:48, borderRadius:12, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, flexShrink:0 }}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CHART + RECENT */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* BAR CHART */}
        <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
            <div style={{ width:8, height:28, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
            <h2 style={{ fontSize:17, fontWeight:800, color:R.text }}>Statistik Status</h2>
          </div>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5D5D5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize:13, fontFamily:"Plus Jakarta Sans" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill:"#FDF5F5" }} />
                <Bar dataKey="value" radius={[8,8,0,0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div style={{ display:"flex", gap:20, marginTop:16, justifyContent:"center" }}>
            {chartData.map((item,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:item.color }} />
                <span style={{ fontSize:13, color:R.muted, fontWeight:500 }}>{item.name}: <strong style={{ color:R.text }}>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT REPORTS */}
        <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
            <div style={{ width:8, height:28, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
            <h2 style={{ fontSize:17, fontWeight:800, color:R.text }}>Laporan Terbaru</h2>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {recentReports.length > 0 ? recentReports.map(item => (
              <div key={item.id} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
                padding:"12px 16px", borderRadius:14, border:`1.5px solid ${R.light}`,
                cursor:"pointer", transition:"all .2s"
              }}
                onMouseEnter={e => { e.currentTarget.style.background=R.light; e.currentTarget.style.borderColor=R.soft }}
                onMouseLeave={e => { e.currentTarget.style.background="white"; e.currentTarget.style.borderColor=R.light }}
                onClick={() => navigate(`/admin/detail-report/${item.id}`)}
              >
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, fontSize:14, color:R.text, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</p>
                  <p style={{ fontSize:12, color:R.muted }}>{item.name}</p>
                </div>
                <span style={statusStyle(item.status)}>{item.status}</span>
              </div>
            )) : (
              <div style={{ textAlign:"center", padding:"32px 0" }}>
                <FileText size={36} color={R.soft} style={{ margin:"0 auto 10px" }} />
                <p style={{ color:R.muted, fontSize:14 }}>Belum ada laporan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:8, height:28, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
            <h2 style={{ fontSize:17, fontWeight:800, color:R.text }}>Semua Laporan</h2>
          </div>
          <div style={{ position:"relative", width:280 }}>
            <Search size={16} color={R.soft} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }} />
            <input type="text" placeholder="Cari laporan..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width:"100%", padding:"10px 16px 10px 40px",
                border:`1.5px solid ${R.light}`, borderRadius:12,
                fontSize:14, outline:"none", color:R.text,
                fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:"border-box"
              }} />
          </div>
        </div>

        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:R.light }}>
                {["No","Pelapor","Judul","Kategori","Status","Aksi"].map((h,i) => (
                  <th key={i} style={{ padding:"12px 16px", textAlign:"left", fontSize:13, fontWeight:700, color:R.muted, borderRadius: i===0?"10px 0 0 10px":i===5?"0 10px 10px 0":"" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((item, i) => (
                <tr key={item.id} style={{ borderBottom:`1px solid ${R.light}`, transition:"background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#FDF5F5"}
                  onMouseLeave={e => e.currentTarget.style.background="white"}
                >
                  <td style={{ padding:"14px 16px", fontSize:14, color:R.muted }}>{i+1}</td>
                  <td style={{ padding:"14px 16px", fontSize:14, fontWeight:600, color:R.text }}>{item.name}</td>
                  <td style={{ padding:"14px 16px", fontSize:14, color:R.text, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</td>
                  <td style={{ padding:"14px 16px", fontSize:14, color:R.muted }}>{item.category_name || "-"}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={statusStyle(item.status)}>{item.status}</span>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <button onClick={() => navigate(`/admin/detail-report/${item.id}`)} style={{
                      display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
                      background:`linear-gradient(135deg,${R.main},${R.mid})`, color:"white",
                      borderRadius:10, fontWeight:600, fontSize:13, border:"none", cursor:"pointer",
                      fontFamily:"'Plus Jakarta Sans',sans-serif"
                    }}>
                      <Eye size={15} /> Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding:"48px", textAlign:"center", color:R.muted, fontSize:14 }}>
                    Tidak ada laporan ditemukan
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