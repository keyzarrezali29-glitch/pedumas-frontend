import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { ImagePlus, Send, FileText, ShieldCheck, MapPin, X, Check } from "lucide-react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

function MapPicker({ onSelect }) {
  const [pos, setPos] = useState([-6.2, 106.816])
  const [address, setAddress] = useState("")

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      const data = await res.json()
      setAddress(data.display_name || `${lat}, ${lng}`)
    } catch {
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    }
  }

  function ClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setPos([lat, lng])
        reverseGeocode(lat, lng)
      }
    })
    return null
  }

  useEffect(() => {
    reverseGeocode(pos[0], pos[1])
  }, [])

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{
        background:"#EFF6FF", borderRadius:12, padding:"10px 14px",
        fontSize:13, color:"#1d4ed8", fontWeight:500
      }}>
        📍 Tap atau klik di peta untuk memilih lokasi. Kamu juga bisa drag pin merah.
      </div>

      <div style={{ borderRadius:16, overflow:"hidden", border:"1.5px solid #e5e7eb", height:360 }}>
        <MapContainer center={pos} zoom={15} style={{ height:"100%", width:"100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
          <ClickHandler />
          <Marker position={pos} draggable
            eventHandlers={{
              dragend(e) {
                const { lat, lng } = e.target.getLatLng()
                setPos([lat, lng])
                reverseGeocode(lat, lng)
              }
            }}
          />
        </MapContainer>
      </div>

      {address && (
        <div style={{ display:"flex", alignItems:"flex-start", gap:10, background:"#f9fafb", borderRadius:12, padding:"12px 16px", border:"1.5px solid #e5e7eb" }}>
          <MapPin size={16} color={R.main} style={{ marginTop:2, flexShrink:0 }} />
          <span style={{ fontSize:13, color:R.text, lineHeight:1.6 }}>{address}</span>
        </div>
      )}

      <button onClick={() => onSelect(address, pos)} style={{
        width:"100%", padding:"14px",
        background:`linear-gradient(135deg, #2563eb, #1d4ed8)`,
        color:"white", fontWeight:700, fontSize:15, border:"none", borderRadius:14,
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        fontFamily:"'Plus Jakarta Sans',sans-serif"
      }}>
        <Check size={18} /> Konfirmasi Lokasi
      </button>
    </div>
  )
}

export default function CreateReport() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [location, setLocation] = useState("")
  const [form, setForm] = useState({ title:"", description:"", category_id:"" })
  const [image, setImage] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    axios.get("http://localhost:3000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleImage = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleMapSelect = (address, coords) => {
    setLocation(address)
    setShowMap(false)
    toast.success("Lokasi berhasil dipilih!")
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error("Browser tidak support GPS"); return }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          const data = await res.json()
          setLocation(data.display_name || `${latitude}, ${longitude}`)
          toast.success("Lokasi berhasil diambil!")
        } catch {
          setLocation(`${latitude}, ${longitude}`)
          toast.success("Lokasi berhasil diambil!")
        }
      },
      () => toast.error("Gagal mengambil lokasi")
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error("Judul laporan wajib diisi!"); return }
    if (!form.category_id) { toast.error("Kategori wajib dipilih!"); return }
    if (!form.description.trim()) { toast.error("Deskripsi laporan wajib diisi!"); return }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", form.title.trim())
      formData.append("description", form.description.trim())
      formData.append("category_id", form.category_id)
      formData.append("location", location)
      if (image) formData.append("image", image)
      await axios.post("http://localhost:3000/api/laporan", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      })
      toast.success("Laporan berhasil dikirim")
      navigate("/user/reports")
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengirim laporan")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width:"100%", padding:"14px 18px", border:`1.5px solid ${R.light}`, borderRadius:14,
    fontSize:15, outline:"none", background:"white", color:R.text, boxSizing:"border-box",
    fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"border-color .2s"
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .field:focus { border-color: #B22222 !important; box-shadow: 0 0 0 3px rgba(178,34,34,.1); }
        .field::placeholder { color: #bca0a0; }
        .map-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px; }
        .map-modal { background:white; borderRadius:24px; padding:28px; width:100%; max-width:600px; max-height:90vh; overflow-y:auto; }
      `}</style>

      {/* HERO */}
      <div style={{
        position:"relative", overflow:"hidden", borderRadius:28,
        background:`linear-gradient(135deg, ${R.dark} 0%, ${R.main} 55%, ${R.mid} 100%)`,
        padding:"36px 44px", color:"white",
        boxShadow:"0 16px 48px rgba(123,13,30,.3)"
      }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", gap:32 }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.2)", padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:700, marginBottom:16 }}>
              <ShieldCheck size={14} /> FORM PENGADUAN
            </div>
            <h1 style={{ fontSize:40, fontWeight:800, marginBottom:10, lineHeight:1.2 }}>Buat Pengaduan</h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.7, maxWidth:480 }}>
              Laporkan masalah masyarakat dengan cepat, aman, dan modern menggunakan sistem PEDUMAS.
            </p>
          </div>
          <div style={{ width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <FileText size={44} color="white" />
          </div>
        </div>
      </div>

      {/* FORM GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:24 }}>

        {/* LEFT */}
        <div style={{ background:"white", borderRadius:24, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:R.text, marginBottom:24 }}>Form Pengaduan</h2>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>

            <input className="field" style={inputStyle} type="text"
              placeholder="Judul laporan..." value={form.title}
              onChange={e => setForm({...form, title:e.target.value})} />

            <select className="field" style={inputStyle} value={form.category_id}
              onChange={e => setForm({...form, category_id:e.target.value})}>
              <option value="">Pilih kategori</option>
              {categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>

            <textarea className="field" style={{...inputStyle, resize:"none", height:180}}
              placeholder="Jelaskan laporan..." value={form.description}
              onChange={e => setForm({...form, description:e.target.value})} />

            {/* LOCATION */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <MapPin size={16} color={R.main} />
                <span style={{ fontWeight:600, fontSize:14, color:R.text }}>Lokasi Kejadian</span>
              </div>

              {location ? (
                <div style={{ display:"flex", alignItems:"flex-start", gap:10, background:"#f0fdf4", borderRadius:12, padding:"12px 16px", border:"1.5px solid #bbf7d0", marginBottom:10 }}>
                  <MapPin size={16} color="#16a34a" style={{ marginTop:2, flexShrink:0 }} />
                  <span style={{ flex:1, fontSize:13, color:"#166534", lineHeight:1.6 }}>{location}</span>
                  <button type="button" onClick={() => setLocation("")} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
                    <X size={16} color="#16a34a" />
                  </button>
                </div>
              ) : (
                <input className="field" style={{...inputStyle, marginBottom:10}} type="text"
                  placeholder="Ketik alamat atau pilih dari peta..." value={location}
                  onChange={e => setLocation(e.target.value)} />
              )}

              <div style={{ display:"flex", gap:10 }}>
                <button type="button" onClick={() => setShowMap(true)} style={{
                  flex:1, padding:"10px 16px", background:"white",
                  border:`1.5px solid ${R.main}`, color:R.main,
                  borderRadius:12, fontWeight:700, fontSize:14, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  fontFamily:"'Plus Jakarta Sans',sans-serif"
                }}>
                  <MapPin size={16} /> Pilih dari Peta
                </button>
                <button type="button" onClick={getCurrentLocation} style={{
                  flex:1, padding:"10px 16px",
                  background:`linear-gradient(135deg,${R.main},${R.mid})`, color:"white",
                  border:"none", borderRadius:12, fontWeight:700, fontSize:14,
                  cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif"
                }}>
                  📍 Lokasi Saya
                </button>
              </div>
            </div>

            {/* FILE */}
            <div>
              <label style={{ fontWeight:600, fontSize:14, color:R.text, display:"block", marginBottom:8 }}>Upload Gambar</label>
              <input type="file" accept="image/*" onChange={handleImage}
                style={{ width:"100%", padding:"10px", border:`1.5px solid ${R.light}`, borderRadius:12, background:"white", boxSizing:"border-box" }} />
            </div>

            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"15px", marginTop:8,
              background: loading ? "#ccc" : `linear-gradient(135deg,${R.dark},${R.main},${R.mid})`,
              color:"white", fontWeight:700, fontSize:16, border:"none", borderRadius:14,
              cursor: loading ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              boxShadow:"0 8px 24px rgba(123,13,30,.3)", fontFamily:"'Plus Jakarta Sans',sans-serif"
            }}>
              <Send size={20} />
              {loading ? "Mengirim..." : "Kirim Pengaduan"}
            </button>

          </form>
        </div>

        {/* RIGHT */}
        <div style={{ background:"white", borderRadius:24, padding:24, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)", alignSelf:"start" }}>
          <h2 style={{ fontSize:18, fontWeight:800, color:R.text, marginBottom:16 }}>Preview Gambar</h2>
          {preview ? (
            <img src={preview} alt="" style={{ width:"100%", height:280, objectFit:"cover", borderRadius:16 }} />
          ) : (
            <div style={{ height:280, borderRadius:16, background:R.light, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
              <ImagePlus size={48} color={R.soft} />
              <p style={{ fontSize:13, color:R.muted, fontWeight:500 }}>Belum ada gambar dipilih</p>
            </div>
          )}
        </div>

      </div>

      {/* MAP MODAL */}
      {showMap && (
        <div className="map-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowMap(false) }}>
          <div className="map-modal" style={{ borderRadius:24 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <MapPin size={20} color={R.main} />
                <h2 style={{ fontSize:18, fontWeight:800, color:R.text }}>Pilih Lokasi</h2>
              </div>
              <button onClick={() => setShowMap(false)} style={{
                background:"#f3f4f6", border:"none", borderRadius:"50%",
                width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"
              }}>
                <X size={18} color="#6b7280" />
              </button>
            </div>
            <MapPicker onSelect={handleMapSelect} />
          </div>
        </div>
      )}

    </div>
  )
}