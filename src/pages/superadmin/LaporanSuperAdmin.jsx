import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Search, Eye, FileText, Clock, CheckCircle, XCircle, Filter } from "lucide-react"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function LaporanSuperAdmin() {
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/laporan", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(res.data)
    } catch (err) { console.log(err) }
  }

  useEffect(() => { fetchReports() }, [])

  const filteredReports = reports.filter(item => {
    const matchSearch = item.title?.toLowerCase().includes(search.toLowerCase()) ||
                        item.name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" ? true : item.status === filter
    return matchSearch && matchFilter
  })

  const total    = reports.length
  const pending  = reports.filter(r => r.status==="pending").length
  const approved = reports.filter(r => r.status==="approved").length
  const rejected = reports.filter(r => r.status==="rejected").length

  const statusStyle = (s) => ({
    fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:100,
    background: s==="approved"?"#D1FAE5":s==="rejected"?"#FEE2E2":"#FEF3C7",
    color: s==="approved"?"#059669":s==="rejected"?"#DC2626":"#D97706"
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
              <FileText size={13} /> MONITORING LAPORAN
            </div>
            <h1 style={{ fontSize:36, fontWeight:800, marginBottom:8 }}>Kelola Laporan</h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.7 }}>Monitor seluruh laporan pengaduan masyarakat dari semua admin.</p>
          </div>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <FileText size={36} color="white" />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        {[
          { label:"Total",    value:total,    color:R.main,    bg:R.light,   icon:<FileText size={22}/> },
          { label:"Pending",  value:pending,  color:"#D97706", bg:"#FEF3C7", icon:<Clock size={22}/> },
          { label:"Approved", value:approved, color:"#059669", bg:"#D1FAE5", icon:<CheckCircle size={22}/> },
          { label:"Rejected", value:rejected, color:"#DC2626", bg:"#FEE2E2", icon:<XCircle size={22}/> },
        ].map((s,i) => (
          <div key={i} style={{ background:"white", borderRadius:18, padding:"20px 18px", border:`1.5px solid ${R.light}`, boxShadow:"0 4px 16px rgba(0,0,0,.04)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:12, color:R.muted, fontWeight:600, marginBottom:8 }}>{s.label}</p>
              <p style={{ fontSize:36, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</p>
            </div>
            <div style={{ width:40, height:40, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", color:s.color }}>
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
            <h2 style={{ fontSize:17, fontWeight:800, color:R.text }}>Semua Laporan</h2>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ position:"relative" }}>
              <Search size={15} color={R.soft} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }} />
              <input type="text" placeholder="Cari laporan/pelapor..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding:"10px 14px 10px 34px", border:`1.5px solid ${R.light}`, borderRadius:12, fontSize:13, outline:"none", color:R.text, width:220, fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{
              padding:"10px 14px", border:`1.5px solid ${R.light}`, borderRadius:12,
              fontSize:13, outline:"none", color:R.text, fontFamily:"'Plus Jakarta Sans',sans-serif", background:"white"
            }}>
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:R.light }}>
                {["No","Pelapor","Judul","Kategori","Status","Tanggal","Aksi"].map((h,i) => (
                  <th key={i} style={{ padding:"12px 16px", textAlign:"left", fontSize:13, fontWeight:700, color:R.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((item,i) => (
                <tr key={item.id} style={{ borderBottom:`1px solid ${R.light}` }}
                  onMouseEnter={e => e.currentTarget.style.background="#FDF5F5"}
                  onMouseLeave={e => e.currentTarget.style.background="white"}
                >
                  <td style={{ padding:"14px 16px", fontSize:13, color:R.muted }}>{i+1}</td>
                  <td style={{ padding:"14px 16px", fontSize:14, fontWeight:600, color:R.text }}>{item.name}</td>
                  <td style={{ padding:"14px 16px", fontSize:14, color:R.text, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, color:R.muted }}>{item.category_name||"-"}</td>
                  <td style={{ padding:"14px 16px" }}><span style={statusStyle(item.status)}>{item.status}</span></td>
                  <td style={{ padding:"14px 16px", fontSize:12, color:R.muted }}>{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <button onClick={() => navigate(`/superadmin/detail-report/${item.id}`)} style={{
                      display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
                      background:`linear-gradient(135deg,${R.main},${R.mid})`, color:"white",
                      borderRadius:10, fontWeight:600, fontSize:12, border:"none", cursor:"pointer",
                      fontFamily:"'Plus Jakarta Sans',sans-serif"
                    }}>
                      <Eye size={14} /> Lihat
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding:"48px", textAlign:"center", color:R.muted }}>
                    <FileText size={40} color={R.soft} style={{ margin:"0 auto 12px" }} />
                    <p style={{ fontWeight:600 }}>Tidak ada laporan</p>
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