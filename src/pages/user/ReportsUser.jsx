import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Search, Eye, Pencil, Trash2, FileText, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function ReportsUser() {
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const reportsPerPage = 6

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:3000/api/laporan/my-reports", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(res.data)
    } catch (err) { console.log(err) }
  }

  useEffect(() => { fetchReports() }, [])

  const deleteReport = async (id) => {
    if (!window.confirm("Yakin hapus laporan?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/api/laporan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Laporan berhasil dihapus")
      fetchReports()
    } catch { toast.error("Gagal hapus laporan") }
  }

  const filteredReports = useMemo(() => reports.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" ? true : item.status === statusFilter
    return matchSearch && matchStatus
  }), [reports, search, statusFilter])

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)
  const currentReports = filteredReports.slice((currentPage-1)*reportsPerPage, currentPage*reportsPerPage)

  const statusStyle = (status) => ({
    fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:100, whiteSpace:"nowrap",
    background: status==="approved" ? "#D1FAE5" : status==="rejected" ? "#FEE2E2" : "#FEF3C7",
    color: status==="approved" ? "#059669" : status==="rejected" ? "#DC2626" : "#D97706"
  })

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* HERO */}
      <div style={{
        position:"relative", overflow:"hidden", borderRadius:28,
        background:`linear-gradient(135deg, ${R.dark} 0%, ${R.main} 55%, ${R.mid} 100%)`,
        padding:"36px 44px", color:"white", boxShadow:"0 16px 48px rgba(123,13,30,.3)"
      }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", gap:32 }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.2)", padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:700, marginBottom:16 }}>
              <FileText size={14} /> PEDUMAS REPORT SYSTEM
            </div>
            <h1 style={{ fontSize:40, fontWeight:800, marginBottom:10, lineHeight:1.2 }}>Daftar Pengaduan</h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.7, maxWidth:480 }}>
              Kelola semua laporan pengaduan masyarakat dengan tampilan modern dan realtime.
            </p>
          </div>
          <div style={{ width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <FileText size={44} color="white" />
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div style={{ background:"white", borderRadius:20, padding:"20px 24px", border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, maxWidth:360 }}>
          <Search size={18} color={R.soft} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }} />
          <input type="text" placeholder="Cari laporan..." value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
            style={{ width:"100%", padding:"12px 16px 12px 44px", border:`1.5px solid ${R.light}`, borderRadius:12, fontSize:14, outline:"none", background:"white", color:R.text, boxSizing:"border-box", fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Filter size={16} color={R.muted} />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            style={{ padding:"12px 16px", border:`1.5px solid ${R.light}`, borderRadius:12, fontSize:14, outline:"none", background:"white", color:R.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* REPORTS */}
      {currentReports.length > 0 ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
          {currentReports.map(report => (
            <div key={report.id} style={{
              background:"white", borderRadius:20, overflow:"hidden",
              border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)",
              transition:"all .2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(123,13,30,.12)" }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.05)" }}
            >
              {report.image && (
                <img src={`http://localhost:3000/uploads/${report.image}`} alt=""
                  style={{ width:"100%", height:200, objectFit:"cover" }} />
              )}
              <div style={{ padding:24 }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:12 }}>
                  <h3 style={{ fontWeight:800, fontSize:18, color:R.text, lineHeight:1.3 }}>{report.title}</h3>
                  <span style={statusStyle(report.status)}>{report.status}</span>
                </div>
                <p style={{ fontSize:13, color:R.muted, lineHeight:1.7, marginBottom:16 }}>
                  {report.response || "Belum ada tanggapan admin."}
                </p>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <Link to={`/user/detail-report/${report.id}`} style={{
                    display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
                    background:`linear-gradient(135deg,${R.main},${R.mid})`, color:"white",
                    borderRadius:10, fontWeight:600, fontSize:13, textDecoration:"none"
                  }}>
                    <Eye size={15} /> Detail
                  </Link>
                  <Link to={`/user/edit-report/${report.id}`} style={{
                    display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
                    background:"#FEF3C7", color:"#D97706",
                    borderRadius:10, fontWeight:600, fontSize:13, textDecoration:"none"
                  }}>
                    <Pencil size={15} /> Edit
                  </Link>
                  <button onClick={() => deleteReport(report.id)} style={{
                    display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
                    background:"#FEE2E2", color:"#DC2626",
                    borderRadius:10, fontWeight:600, fontSize:13, border:"none", cursor:"pointer",
                    fontFamily:"'Plus Jakarta Sans',sans-serif"
                  }}>
                    <Trash2 size={15} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background:"white", borderRadius:20, padding:"60px 24px", textAlign:"center", border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:R.light, margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FileText size={36} color={R.main} />
          </div>
          <h3 style={{ fontWeight:800, fontSize:20, color:R.text, marginBottom:8 }}>Tidak Ada Laporan</h3>
          <p style={{ color:R.muted, fontSize:14 }}>Belum ada laporan yang tersedia saat ini.</p>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
          <button disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)} style={{
            background:"white", border:`1.5px solid ${R.light}`, borderRadius:10, padding:"10px 14px",
            cursor:currentPage===1?"not-allowed":"pointer", opacity:currentPage===1?.4:1,
            display:"flex", alignItems:"center"
          }}>
            <ChevronLeft size={18} color={R.main} />
          </button>
          {[...Array(totalPages)].map((_,i) => (
            <button key={i} onClick={() => setCurrentPage(i+1)} style={{
              padding:"10px 16px", borderRadius:10, fontWeight:700, fontSize:14, border:"none", cursor:"pointer",
              background: currentPage===i+1 ? `linear-gradient(135deg,${R.main},${R.mid})` : "white",
              color: currentPage===i+1 ? "white" : R.muted,
              border: currentPage===i+1 ? "none" : `1.5px solid ${R.light}`,
              fontFamily:"'Plus Jakarta Sans',sans-serif"
            }}>
              {i+1}
            </button>
          ))}
          <button disabled={currentPage===totalPages} onClick={() => setCurrentPage(p=>p+1)} style={{
            background:"white", border:`1.5px solid ${R.light}`, borderRadius:10, padding:"10px 14px",
            cursor:currentPage===totalPages?"not-allowed":"pointer", opacity:currentPage===totalPages?.4:1,
            display:"flex", alignItems:"center"
          }}>
            <ChevronRight size={18} color={R.main} />
          </button>
        </div>
      )}
    </div>
  )
}