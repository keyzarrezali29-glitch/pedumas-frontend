import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { Pencil, ImagePlus, FileText, ArrowLeft, Save } from "lucide-react"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function EditReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/laporan/${id}`)
      setTitle(res.data.title)
      setDescription(res.data.description)
      if (res.data.image) setPreview(`http://localhost:3000/uploads/${res.data.image}`)
    } catch (err) { console.log(err) }
  }

  useEffect(() => { fetchDetail() }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!title.trim()) { toast.error("Judul wajib diisi"); return }
    if (!description.trim()) { toast.error("Deskripsi wajib diisi"); return }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", title.trim())
      formData.append("description", description.trim())
      if (image) formData.append("image", image)
      await axios.put(`http://localhost:3000/api/laporan/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      toast.success("Laporan berhasil diupdate")
      navigate("/user/reports")
    } catch (err) {
      toast.error("Gagal update laporan")
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width:"100%", padding:"13px 16px", border:`1.5px solid ${R.light}`, borderRadius:12,
    fontSize:15, outline:"none", background:"white", color:R.text,
    fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:"border-box", transition:"border-color .2s"
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .efield:focus { border-color: #B22222 !important; box-shadow: 0 0 0 3px rgba(178,34,34,.1); }
        .efield::placeholder { color: #bca0a0; }
        .upload-zone { border: 2px dashed #E8A0A0; border-radius: 16px; padding: 40px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; background: #FDF5F5; cursor:pointer; transition: all .2s; }
        .upload-zone:hover { border-color: #B22222; background: #F5D5D5; }
      `}</style>

      {/* BACK */}
      <button onClick={() => navigate(-1)} style={{
        display:"inline-flex", alignItems:"center", gap:8,
        color:R.muted, fontSize:14, fontWeight:600,
        padding:"8px 16px", borderRadius:10,
        border:`1.5px solid ${R.light}`, background:"white",
        cursor:"pointer", width:"fit-content", fontFamily:"'Plus Jakarta Sans',sans-serif"
      }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      {/* HERO */}
      <div style={{
        position:"relative", overflow:"hidden", borderRadius:24,
        background:`linear-gradient(135deg, ${R.dark} 0%, ${R.main} 55%, ${R.mid} 100%)`,
        padding:"32px 40px", color:"white",
        boxShadow:"0 16px 48px rgba(123,13,30,.3)"
      }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.2)", padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:700, marginBottom:14 }}>
              <Pencil size={13} /> PEDUMAS EDIT SYSTEM
            </div>
            <h1 style={{ fontSize:36, fontWeight:800, marginBottom:8, lineHeight:1.2 }}>Edit Pengaduan</h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.6 }}>
              Update laporan pengaduan masyarakat dengan tampilan modern dan premium.
            </p>
          </div>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Pencil size={36} color="white" />
          </div>
        </div>
      </div>

      {/* GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:24, alignItems:"start" }}>

        {/* LEFT — FORM */}
        <div style={{ background:"white", borderRadius:20, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>

          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
            <div style={{ width:8, height:32, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
            <h2 style={{ fontSize:18, fontWeight:800, color:R.text }}>Form Edit</h2>
          </div>

          <form onSubmit={handleUpdate} style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* TITLE */}
            <div>
              <label style={{ display:"block", fontWeight:600, fontSize:14, color:R.text, marginBottom:8 }}>
                Judul Pengaduan
              </label>
              <input className="efield" style={inputStyle} type="text"
                placeholder="Judul laporan..." value={title}
                onChange={e => setTitle(e.target.value)} required />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label style={{ display:"block", fontWeight:600, fontSize:14, color:R.text, marginBottom:8 }}>
                Deskripsi Pengaduan
              </label>
              <textarea className="efield" style={{...inputStyle, height:200, resize:"none"}}
                placeholder="Jelaskan laporan..." value={description}
                onChange={e => setDescription(e.target.value)} required />
            </div>

            {/* UPLOAD */}
            <div>
              <label style={{ display:"block", fontWeight:600, fontSize:14, color:R.text, marginBottom:8 }}>
                Upload Gambar Baru
              </label>
              <label className="upload-zone">
                <ImagePlus size={36} color={R.soft} />
                <p style={{ fontWeight:600, fontSize:14, color:R.muted }}>Klik untuk upload gambar</p>
                <p style={{ fontSize:12, color:R.soft }}>PNG, JPG, JPEG — Max 5MB</p>
                <input type="file" hidden accept="image/*" onChange={e => {
                  setImage(e.target.files[0])
                  setPreview(URL.createObjectURL(e.target.files[0]))
                }} />
              </label>
            </div>

            {/* BUTTON */}
            <button type="submit" disabled={loading} style={{
              display:"flex", alignItems:"center", gap:10, padding:"14px 28px",
              background: loading ? "#ccc" : `linear-gradient(135deg,${R.dark},${R.main},${R.mid})`,
              color:"white", fontWeight:700, fontSize:15, border:"none", borderRadius:14,
              cursor: loading ? "not-allowed" : "pointer", width:"fit-content",
              boxShadow:"0 8px 24px rgba(123,13,30,.25)", fontFamily:"'Plus Jakarta Sans',sans-serif",
              transition:"all .2s"
            }}>
              <Save size={18} />
              {loading ? "Menyimpan..." : "Update Pengaduan"}
            </button>

          </form>
        </div>

        {/* RIGHT — PREVIEW */}
        <div style={{ background:"white", borderRadius:20, padding:24, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>

          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:8, height:28, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
            <h2 style={{ fontSize:16, fontWeight:800, color:R.text }}>Preview Gambar</h2>
          </div>

          {preview ? (
            <div>
              <img src={preview} alt="" style={{ width:"100%", height:260, objectFit:"cover", borderRadius:14, marginBottom:12 }} />
              <p style={{ fontSize:12, color:R.soft, textAlign:"center" }}>Gambar saat ini</p>
            </div>
          ) : (
            <div style={{ height:260, borderRadius:14, background:R.light, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
              <ImagePlus size={48} color={R.soft} />
              <p style={{ fontSize:13, color:R.muted, fontWeight:500 }}>Belum ada gambar</p>
            </div>
          )}

          {/* TIPS */}
          <div style={{ marginTop:20, background:R.light, borderRadius:12, padding:16 }}>
            <p style={{ fontSize:12, fontWeight:700, color:R.main, marginBottom:8 }}>Tips Edit Laporan</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                "Pastikan judul jelas dan deskriptif",
                "Deskripsi minimal 20 karakter",
                "Gambar membantu proses verifikasi",
              ].map((tip, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:R.main, flexShrink:0, marginTop:5 }} />
                  <p style={{ fontSize:12, color:R.muted, lineHeight:1.5 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}