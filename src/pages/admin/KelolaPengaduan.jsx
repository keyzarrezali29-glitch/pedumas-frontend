import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Search, Eye, MessageSquareText, FileText, Clock, CheckCircle, XCircle, FileDown, ChevronLeft, ChevronRight } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }
const PER_PAGE = 10

export default function KelolaPengaduan() {
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/laporan")
      setReports(res.data); setFilteredReports(res.data)
    } catch { toast.error("Gagal mengambil laporan") }
  }

  useEffect(() => { fetchReports() }, [])

  useEffect(() => {
    let data = [...reports]
    if (search) data = data.filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
    if (filter !== "all") data = data.filter(item => item.status === filter)
    setFilteredReports(data)
    setCurrentPage(1)
  }, [search, filter, reports])

  const total    = reports.length
  const pending  = reports.filter(i => i.status==="pending").length
  const approved = reports.filter(i => i.status==="approved").length
  const rejected = reports.filter(i => i.status==="rejected").length

  // PAGINATION
  const totalPages = Math.ceil(filteredReports.length / PER_PAGE)
  const paginated  = filteredReports.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE)

  const exportAllPDF = () => {
    const doc = new jsPDF()
    const pageW = doc.internal.pageSize.getWidth()
    doc.setFillColor(123, 13, 30)
    doc.rect(0, 0, pageW, 35, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20); doc.setFont("helvetica", "bold")
    doc.text("PEDUMAS", 14, 15)
    doc.setFontSize(10); doc.setFont("helvetica", "normal")
    doc.text("Pengaduan Masyarakat", 14, 22)
    doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")}`, 14, 29)
    doc.setTextColor(123, 13, 30); doc.setFontSize(15); doc.setFont("helvetica", "bold")
    doc.text("Rekap Semua Laporan Pengaduan", 14, 48)
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(100)
    doc.text(`Total: ${filteredReports.length} laporan`, 14, 55)
    autoTable(doc, {
      startY: 60,
      head: [["No", "Pelapor", "Judul", "Kategori", "Status", "Tanggal"]],
      body: filteredReports.map((item, i) => [i+1, item.name, item.title, item.category_name||"-", item.status?.toUpperCase(), new Date(item.created_at).toLocaleDateString("id-ID")]),
      headStyles: { fillColor:[178,34,34], textColor:255, fontStyle:"bold" },
      alternateRowStyles: { fillColor:[245,213,213] },
      styles: { fontSize:9, cellPadding:4 },
      columnStyles: { 0:{cellWidth:10}, 4:{cellWidth:22}, 5:{cellWidth:25} }
    })
    doc.setTextColor(150); doc.setFontSize(9)
    doc.text("© PEDUMAS - Pengaduan Masyarakat", pageW/2, 285, { align:"center" })
    doc.save(`Rekap-Laporan-PEDUMAS-${new Date().toLocaleDateString("id-ID")}.pdf`)
    toast.success("PDF berhasil didownload!")
  }

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
              <MessageSquareText size={13} /> PEDUMAS MANAGEMENT
            </div>
            <h1 style={{ fontSize:36, fontWeight:800, marginBottom:8 }}>Kelola Pengaduan</h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.7 }}>Kelola seluruh laporan pengaduan masyarakat secara realtime dan modern.</p>
          </div>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <MessageSquareText size={36} color="white" />
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
            <h2 style={{ fontSize:17, fontWeight:800, color:R.text }}>Data Pengaduan</h2>
            <span style={{ background:R.light, color:R.muted, fontSize:12, fontWeight:600, padding:"3px 10px", borderRadius:100 }}>
              {filteredReports.length} laporan
            </span>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button onClick={exportAllPDF} style={{
              display:"flex", alignItems:"center", gap:7, padding:"10px 16px",
              background:`linear-gradient(135deg,${R.main},${R.mid})`, color:"white",
              borderRadius:12, fontWeight:600, fontSize:13, border:"none", cursor:"pointer",
              boxShadow:"0 4px 16px rgba(178,34,34,.3)", fontFamily:"'Plus Jakarta Sans',sans-serif"
            }}>
              <FileDown size={15} /> Export PDF
            </button>
            <div style={{ position:"relative" }}>
              <Search size={16} color={R.soft} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }} />
              <input type="text" placeholder="Cari laporan..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding:"10px 16px 10px 36px", border:`1.5px solid ${R.light}`, borderRadius:12, fontSize:14, outline:"none", color:R.text, width:200, fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{
              padding:"10px 14px", border:`1.5px solid ${R.light}`, borderRadius:12,
              fontSize:14, outline:"none", color:R.text, fontFamily:"'Plus Jakarta Sans',sans-serif", background:"white"
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
                {["No","Pelapor","Judul","Kategori","Status","Aksi"].map((h,i) => (
                  <th key={i} style={{ padding:"12px 16px", textAlign:"left", fontSize:13, fontWeight:700, color:R.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((item, i) => (
                <tr key={item.id} style={{ borderBottom:`1px solid ${R.light}` }}
                  onMouseEnter={e => e.currentTarget.style.background="#FDF5F5"}
                  onMouseLeave={e => e.currentTarget.style.background="white"}
                >
                  <td style={{ padding:"14px 16px", fontSize:14, color:R.muted }}>{(currentPage-1)*PER_PAGE+i+1}</td>
                  <td style={{ padding:"14px 16px", fontSize:14, fontWeight:600, color:R.text }}>{item.name}</td>
                  <td style={{ padding:"14px 16px", fontSize:14, color:R.text, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, color:R.muted }}>{item.category_name||"-"}</td>
                  <td style={{ padding:"14px 16px" }}><span style={statusStyle(item.status)}>{item.status}</span></td>
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
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding:"48px", textAlign:"center", color:R.muted }}>
                    <MessageSquareText size={40} color={R.soft} style={{ margin:"0 auto 12px" }} />
                    <p style={{ fontWeight:600 }}>Tidak ada laporan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:24, flexWrap:"wrap", gap:12 }}>
            <p style={{ fontSize:13, color:R.muted }}>
              Menampilkan {(currentPage-1)*PER_PAGE+1}–{Math.min(currentPage*PER_PAGE, filteredReports.length)} dari {filteredReports.length} laporan
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)} style={{
                width:36, height:36, borderRadius:10, border:`1.5px solid ${R.light}`,
                background:"white", cursor:currentPage===1?"not-allowed":"pointer",
                opacity:currentPage===1?.4:1, display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                <ChevronLeft size={16} color={R.main} />
              </button>

              {[...Array(totalPages)].map((_,i) => {
                const p = i+1
                if (totalPages <= 7 || p===1 || p===totalPages || Math.abs(p-currentPage)<=1) {
                  return (
                    <button key={p} onClick={() => setCurrentPage(p)} style={{
                      width:36, height:36, borderRadius:10, fontWeight:700, fontSize:13,
                      border:"none", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
                      background: currentPage===p ? `linear-gradient(135deg,${R.main},${R.mid})` : "white",
                      color: currentPage===p ? "white" : R.muted,
                      border: currentPage===p ? "none" : `1.5px solid ${R.light}`
                    }}>{p}</button>
                  )
                } else if (Math.abs(p-currentPage)===2) {
                  return <span key={p} style={{ color:R.soft, fontSize:14 }}>...</span>
                }
                return null
              })}

              <button disabled={currentPage===totalPages} onClick={() => setCurrentPage(p=>p+1)} style={{
                width:36, height:36, borderRadius:10, border:`1.5px solid ${R.light}`,
                background:"white", cursor:currentPage===totalPages?"not-allowed":"pointer",
                opacity:currentPage===totalPages?.4:1, display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                <ChevronRight size={16} color={R.main} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}