import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { MessageCircle, Send, MapPin, ArrowLeft, User, Tag, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function DetailReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState({})
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchDetail = async () => {
    try {
      const res = await axios.get(`https://backend-pengaduan-production.up.railway.app/api/laporan/${id}`)
      setReport(res.data)
    } catch (err) { console.log(err) }
  }

  const fetchComments = async () => {
    try {
      const res = await axios.get(`https://backend-pengaduan-production.up.railway.app/api/comment/${id}`)
      setComments(res.data)
    } catch (err) { console.log(err) }
  }

  useEffect(() => { fetchDetail(); fetchComments() }, [id])

  const sendComment = async () => {
    if (!comment.trim()) { toast.error("Komentar wajib diisi"); return }
    const token = localStorage.getItem("token")
    if (!token) { toast.error("Silahkan login dulu"); return }
    setLoading(true)
    try {
      await axios.post("https://backend-pengaduan-production.up.railway.app/api/comment",
        { laporan_id: Number(id), comment: comment.trim(), parent_id: null },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      )
      toast.success("Komentar berhasil dikirim")
      setComment("")
      fetchComments()
    } catch (err) {
      toast.error("Gagal kirim komentar")
    } finally { setLoading(false) }
  }

  const statusColor = (s) => ({
    bg: s==="approved" ? "#D1FAE5" : s==="rejected" ? "#FEE2E2" : "#FEF3C7",
    text: s==="approved" ? "#059669" : s==="rejected" ? "#DC2626" : "#D97706"
  })

  const isUrl = (str) => {
    try { return Boolean(new URL(str)) } catch { return false }
  }

  const getMapsUrl = (location) => {
    if (!location) return "#"
    if (isUrl(location)) return location
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <button onClick={() => navigate(-1)} style={{
        display:"inline-flex", alignItems:"center", gap:8,
        color:R.muted, fontSize:14, fontWeight:600,
        padding:"8px 16px", borderRadius:10,
        border:`1.5px solid ${R.light}`, background:"white",
        cursor:"pointer", width:"fit-content", fontFamily:"'Plus Jakarta Sans',sans-serif"
      }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:24, alignItems:"start" }}>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {report.image && (
            <div style={{ borderRadius:20, overflow:"hidden", boxShadow:"0 8px 32px rgba(123,13,30,.15)" }}>
              <img src={`https://backend-pengaduan-production.up.railway.app/uploads/${report.image}`} alt=""
                style={{ width:"100%", height:320, objectFit:"cover", display:"block" }} />
            </div>
          )}

          <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, marginBottom:20 }}>
              <h1 style={{ fontSize:28, fontWeight:800, color:R.text, lineHeight:1.3 }}>{report.title}</h1>
              {report.status && (
                <span style={{
                  background: statusColor(report.status).bg,
                  color: statusColor(report.status).text,
                  padding:"6px 16px", borderRadius:100, fontSize:13, fontWeight:700,
                  whiteSpace:"nowrap", flexShrink:0
                }}>
                  {report.status}
                </span>
              )}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:R.light, borderRadius:12, padding:"12px 16px" }}>
                <User size={16} color={R.main} />
                <div>
                  <div style={{ fontSize:11, color:R.muted, fontWeight:600 }}>Pelapor</div>
                  <div style={{ fontSize:14, fontWeight:700, color:R.text }}>{report.name}</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:R.light, borderRadius:12, padding:"12px 16px" }}>
                <Tag size={16} color={R.main} />
                <div>
                  <div style={{ fontSize:11, color:R.muted, fontWeight:600 }}>Kategori</div>
                  <div style={{ fontSize:14, fontWeight:700, color:R.text }}>{report.category_name || "-"}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize:16, fontWeight:700, color:R.text, marginBottom:10 }}>Deskripsi Laporan</h3>
              <p style={{ fontSize:14, color:R.muted, lineHeight:1.8 }}>{report.description}</p>
            </div>
          </div>

          <div style={{ background:"white", borderRadius:20, padding:24, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:R.light, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <MapPin size={18} color={R.main} />
              </div>
              <h3 style={{ fontSize:16, fontWeight:700, color:R.text }}>Lokasi Kejadian</h3>
            </div>
            {report.location ? (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:8, background:"#f9fafb", borderRadius:12, padding:"12px 16px", border:"1.5px solid #e5e7eb" }}>
                  <MapPin size={15} color={R.main} style={{ marginTop:2, flexShrink:0 }} />
                  <p style={{ fontSize:13, color:R.text, lineHeight:1.6, margin:0 }}>{report.location}</p>
                </div>
                <a
                  href={getMapsUrl(report.location)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display:"inline-flex", alignItems:"center", gap:8,
                    color:R.main, fontWeight:600, fontSize:14, textDecoration:"none",
                    background:R.light, padding:"10px 16px", borderRadius:12, width:"fit-content"
                  }}
                >
                  <ExternalLink size={15} /> Buka di Google Maps
                </a>
              </div>
            ) : (
              <p style={{ color:R.muted, fontSize:14 }}>Lokasi belum tersedia</p>
            )}
          </div>

        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          <div style={{ background:"white", borderRadius:20, padding:24, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
            <h3 style={{ fontSize:16, fontWeight:700, color:R.text, marginBottom:16 }}>Info Laporan</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { label:"Status", value:report.status, isStatus:true },
                { label:"Kategori", value:report.category_name || "-" },
                { label:"Pelapor", value:report.name },
              ].map((item, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom: i<2 ? `1px solid ${R.light}` : "none" }}>
                  <span style={{ fontSize:13, color:R.muted, fontWeight:500 }}>{item.label}</span>
                  {item.isStatus ? (
                    <span style={{
                      background: statusColor(item.value).bg,
                      color: statusColor(item.value).text,
                      padding:"3px 12px", borderRadius:100, fontSize:12, fontWeight:700
                    }}>
                      {item.value}
                    </span>
                  ) : (
                    <span style={{ fontSize:13, fontWeight:700, color:R.text }}>{item.value}</span>
                  )}
                </div>
              ))}
            </div>

            {report.response && (
              <div style={{ marginTop:16, background:R.light, borderRadius:12, padding:16, borderLeft:`3px solid ${R.main}` }}>
                <p style={{ fontSize:12, fontWeight:700, color:R.main, marginBottom:6 }}>Tanggapan Admin</p>
                <p style={{ fontSize:13, color:R.muted, lineHeight:1.7 }}>{report.response}</p>
              </div>
            )}
          </div>

          <div style={{ background:"white", borderRadius:20, padding:24, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:R.light, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <MessageCircle size={18} color={R.main} />
              </div>
              <h3 style={{ fontSize:16, fontWeight:700, color:R.text }}>
                Komentar <span style={{ color:R.soft, fontWeight:500 }}>({comments.length})</span>
              </h3>
            </div>

            <div style={{ display:"flex", gap:10, marginBottom:20 }}>
              <input type="text" value={comment} onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key==="Enter" && sendComment()}
                placeholder="Tulis komentar..."
                style={{
                  flex:1, padding:"11px 14px", border:`1.5px solid ${R.light}`, borderRadius:12,
                  fontSize:14, outline:"none", color:R.text, fontFamily:"'Plus Jakarta Sans',sans-serif"
                }} />
              <button onClick={sendComment} disabled={loading} style={{
                background:`linear-gradient(135deg,${R.main},${R.mid})`,
                color:"white", border:"none", borderRadius:12, padding:"0 16px",
                cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                fontWeight:700, fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif",
                flexShrink:0
              }}>
                <Send size={15} /> Kirim
              </button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:400, overflowY:"auto" }}>
              {comments.length > 0 ? comments.map(item => (
                <div key={item.id} style={{ background:R.light, borderRadius:14, padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${R.main},${R.mid})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ color:"white", fontSize:13, fontWeight:700 }}>{item.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div>
                      <span style={{ fontSize:13, fontWeight:700, color:R.text }}>{item.name}</span>
                      {item.role && <span style={{ fontSize:11, color:R.soft, marginLeft:6, fontWeight:500 }}>{item.role}</span>}
                    </div>
                  </div>
                  <p style={{ fontSize:13, color:R.muted, lineHeight:1.6, paddingLeft:38 }}>{item.comment}</p>
                  {item.created_at && (
                    <p style={{ fontSize:11, color:R.soft, paddingLeft:38, marginTop:4 }}>
                      {new Date(item.created_at).toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
              )) : (
                <div style={{ textAlign:"center", padding:"32px 0" }}>
                  <MessageCircle size={40} color={R.soft} style={{ margin:"0 auto 10px" }} />
                  <p style={{ fontWeight:600, color:R.muted, fontSize:14 }}>Belum Ada Komentar</p>
                  <p style={{ fontSize:12, color:R.soft, marginTop:4 }}>Jadilah yang pertama berkomentar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}