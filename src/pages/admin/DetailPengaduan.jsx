import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminComments from "../../components/AdminComments"
import axios from "axios"
import toast from "react-hot-toast"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { MapPin, Send, CheckCircle, ArrowLeft, User, Tag, ExternalLink, Calendar, FileDown } from "lucide-react"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function DetailPengaduan() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [status, setStatus] = useState("")
  const [response, setResponse] = useState("")
  const token = localStorage.getItem("token")

  const fetchDetail = async () => {
    try {
      const res = await axios.get(`https://backend-pengaduan-production.up.railway.app/api/laporan/${id}`)
      setReport(res.data); setStatus(res.data.status); setResponse(res.data.response || "")
    } catch { toast.error("Gagal mengambil detail") }
  }

  useEffect(() => { fetchDetail() }, [])

  const updateReport = async () => {
    try {
      await axios.put(`https://backend-pengaduan-production.up.railway.app/api/laporan/status/${id}`, { status, response }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success("Laporan berhasil diupdate"); fetchDetail()
    } catch { toast.error("Gagal update laporan") }
  }

  const statusStyle = (s) => ({
    fontSize:13, fontWeight:700, padding:"5px 14px", borderRadius:100,
    background: s==="approved"?"#D1FAE5":s==="rejected"?"#FEE2E2":"#FEF3C7",
    color: s==="approved"?"#059669":s==="rejected"?"#DC2626":"#D97706"
  })

  const getMapsUrl = (location) => {
    if (!location) return "#"
    if (location.startsWith("http")) return location
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    const pageW = doc.internal.pageSize.getWidth()
    doc.setFillColor(123, 13, 30)
    doc.rect(0, 0, pageW, 35, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("PEDUMAS", 14, 15)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Pengaduan Masyarakat", 14, 22)
    doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")}`, 14, 29)
    doc.setTextColor(123, 13, 30)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Detail Laporan Pengaduan", 14, 48)
    autoTable(doc, {
      startY: 55,
      head: [["Field", "Keterangan"]],
      body: [
        ["ID Laporan", `#${report.id}`],
        ["Judul", report.title],
        ["Pelapor", report.name],
        ["Kategori", report.category_name || "-"],
        ["Status", report.status?.toUpperCase()],
        ["Tanggal", formatDate(report.created_at)],
        ["Jam", `${formatTime(report.created_at)} WIB`],
        ["Lokasi", report.location || "Tidak tersedia"],
      ],
      headStyles: { fillColor: [178, 34, 34], textColor: 255, fontStyle:"bold" },
      alternateRowStyles: { fillColor: [245, 213, 213] },
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: { 0: { fontStyle:"bold", cellWidth: 45 } }
    })
    const afterTable = doc.lastAutoTable.finalY + 10
    doc.setTextColor(123, 13, 30)
    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")
    doc.text("Deskripsi Laporan", 14, afterTable)
    doc.setTextColor(50, 50, 50)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const descLines = doc.splitTextToSize(report.description || "-", pageW - 28)
    doc.text(descLines, 14, afterTable + 8)
    if (report.response) {
      const afterDesc = afterTable + 8 + descLines.length * 6 + 10
      doc.setTextColor(123, 13, 30)
      doc.setFontSize(13)
      doc.setFont("helvetica", "bold")
      doc.text("Respon Admin", 14, afterDesc)
      doc.setTextColor(50, 50, 50)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const respLines = doc.splitTextToSize(report.response, pageW - 28)
      doc.text(respLines, 14, afterDesc + 8)
    }
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(9)
    doc.text("© PEDUMAS - Pengaduan Masyarakat", pageW / 2, 285, { align: "center" })
    doc.save(`Laporan-${report.id}-${report.title}.pdf`)
    toast.success("PDF berhasil didownload!")
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday:"long", year:"numeric", month:"long", day:"numeric"
    })
  }

  const formatTime = (dateStr) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour:"2-digit", minute:"2-digit"
    })
  }

  if (!report) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"50vh" }}>
      <div style={{ width:40, height:40, borderRadius:"50%", border:`4px solid ${R.light}`, borderTopColor:R.main, animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={() => navigate(-1)} style={{ display:"inline-flex", alignItems:"center", gap:8, color:R.muted, fontSize:14, fontWeight:600, padding:"8px 16px", borderRadius:10, border:`1.5px solid ${R.light}`, background:"white", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          <ArrowLeft size={16} /> Kembali
        </button>
        <button onClick={exportPDF} style={{
          display:"inline-flex", alignItems:"center", gap:8, fontSize:14, fontWeight:600,
          padding:"8px 16px", borderRadius:10, cursor:"pointer",
          background:`linear-gradient(135deg,${R.main},${R.mid})`,
          color:"white", border:"none", fontFamily:"'Plus Jakarta Sans',sans-serif",
          boxShadow:"0 4px 16px rgba(178,34,34,.3)"
        }}>
          <FileDown size={16} /> Export PDF
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:24, alignItems:"start" }}>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {report.image && (
            <div style={{ borderRadius:20, overflow:"hidden", boxShadow:"0 8px 32px rgba(123,13,30,.15)" }}>
              <img src={`https://backend-pengaduan-production.up.railway.app/uploads/${report.image}`} alt="" style={{ width:"100%", height:300, objectFit:"cover", display:"block" }} />
            </div>
          )}

          <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, marginBottom:20 }}>
              <h1 style={{ fontSize:26, fontWeight:800, color:R.text, lineHeight:1.3 }}>{report.title}</h1>
              <span style={statusStyle(report.status)}>{report.status}</span>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              {[
                { icon:<User size={15}/>, label:"Pelapor", value:report.name },
                { icon:<Tag size={15}/>, label:"Kategori", value:report.category_name||"-" },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background:R.light, borderRadius:12, padding:"12px 14px" }}>
                  <span style={{ color:R.main }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:11, color:R.muted, fontWeight:600 }}>{item.label}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:R.text }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:10, background:`linear-gradient(135deg,${R.light},#fff0f0)`, borderRadius:12, padding:"14px 16px", marginBottom:16, border:`1px solid ${R.soft}` }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${R.main},${R.mid})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Calendar size={16} color="white" />
              </div>
              <div>
                <div style={{ fontSize:11, color:R.muted, fontWeight:600, marginBottom:2 }}>Tanggal Laporan Dibuat</div>
                <div style={{ fontSize:14, fontWeight:700, color:R.text }}>{formatDate(report.created_at)}</div>
                <div style={{ fontSize:12, color:R.soft, marginTop:1 }}>Pukul {formatTime(report.created_at)} WIB</div>
              </div>
            </div>

            <div style={{ background:R.light, borderRadius:14, padding:16, marginBottom:16 }}>
              <p style={{ fontSize:13, fontWeight:700, color:R.muted, marginBottom:8 }}>Deskripsi Laporan</p>
              <p style={{ fontSize:14, color:R.text, lineHeight:1.8 }}>{report.description}</p>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:10, background:R.light, borderRadius:14, padding:"12px 16px" }}>
              <MapPin size={16} color={R.main} />
              {report.location ? (
                <a
                  href={getMapsUrl(report.location)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color:R.main, fontWeight:600, fontSize:14, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}
                >
                  Buka di Google Maps <ExternalLink size={13} />
                </a>
              ) : (
                <span style={{ fontSize:14, color:R.muted }}>Lokasi tidak tersedia</span>
              )}
            </div>
          </div>

          <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:8, height:28, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
              <h2 style={{ fontSize:17, fontWeight:800, color:R.text }}>Diskusi Komentar</h2>
            </div>
            <AdminComments laporanId={id} />
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div style={{ background:"white", borderRadius:20, padding:24, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)", position:"sticky", top:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:8, height:28, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
              <h2 style={{ fontSize:17, fontWeight:800, color:R.text }}>Kelola Status</h2>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:20 }}>
              {[
                { label:"Status Sekarang", value:report.status, isStatus:true },
                { label:"Pelapor", value:report.name },
                { label:"Kategori", value:report.category_name||"-" },
                { label:"Tanggal Laporan", value:formatDate(report.created_at), isDate:true },
                { label:"Jam", value:`${formatTime(report.created_at)} WIB`, isDate:true },
              ].map((item,i,arr) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<arr.length-1?`1px solid ${R.light}`:"none" }}>
                  <span style={{ fontSize:13, color:R.muted }}>{item.label}</span>
                  {item.isStatus
                    ? <span style={statusStyle(item.value)}>{item.value}</span>
                    : <span style={{ fontSize:13, fontWeight:700, color:item.isDate?R.main:R.text, textAlign:"right", maxWidth:130 }}>{item.value}</span>
                  }
                </div>
              ))}
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:R.text, marginBottom:8 }}>Ubah Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{
                width:"100%", padding:"11px 14px", border:`1.5px solid ${R.light}`, borderRadius:12,
                fontSize:14, outline:"none", color:R.text, fontFamily:"'Plus Jakarta Sans',sans-serif", background:"white"
              }}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:R.text, marginBottom:8 }}>Respon Admin</label>
              <textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Berikan respon admin..."
                style={{ width:"100%", height:140, padding:"12px 14px", border:`1.5px solid ${R.light}`, borderRadius:12, fontSize:14, outline:"none", color:R.text, resize:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:"border-box" }} />
            </div>

            <div style={{
              marginBottom:16, padding:"12px 16px", borderRadius:12, fontWeight:700, fontSize:14,
              display:"flex", alignItems:"center", gap:10,
              background: status==="approved"?"#D1FAE5":status==="rejected"?"#FEE2E2":"#FEF3C7",
              color: status==="approved"?"#059669":status==="rejected"?"#DC2626":"#D97706"
            }}>
              <CheckCircle size={18} />
              {status==="approved"?"Laporan Approved":status==="rejected"?"Laporan Rejected":"Laporan Pending"}
            </div>

            <button onClick={updateReport} style={{
              width:"100%", padding:"14px", background:`linear-gradient(135deg,${R.dark},${R.main},${R.mid})`,
              color:"white", fontWeight:700, fontSize:15, border:"none", borderRadius:12, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              boxShadow:"0 8px 24px rgba(123,13,30,.3)", fontFamily:"'Plus Jakarta Sans',sans-serif"
            }}>
              <Send size={18} /> Update Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}