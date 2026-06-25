import { Camera, Save, ShieldCheck, User2, LockKeyhole, Mail } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function ProfileAdmin() {
  const user  = JSON.parse(localStorage.getItem("user") || "{}")
  const token = localStorage.getItem("token")

  const [name, setName]         = useState(user.name || "")
  const [password, setPassword] = useState("")
  const [photo, setPhoto]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    if (password) formData.append("password", password)
    if (photo) formData.append("photo", photo)
    try {
      // UPDATE PROFILE
      await axios.put("https://backend-pengaduan-production.up.railway.app/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      })

      // FETCH ULANG DATA USER TERBARU
      const profileRes = await axios.get("https://backend-pengaduan-production.up.railway.app/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })

      // SIMPAN KE LOCALSTORAGE
      localStorage.setItem("user", JSON.stringify(profileRes.data))

      toast.success("Profile berhasil diupdate")
      setPassword("")
      setPhoto(null)

      // UPDATE STATE
      window.location.reload()

    } catch (err) {
      console.log(err)
      toast.error("Gagal update profile")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width:"100%", padding:"13px 16px", border:`1.5px solid ${R.light}`, borderRadius:12,
    fontSize:15, outline:"none", background:"white", color:R.text,
    fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:"border-box", transition:"border-color .2s"
  }

  const labelStyle = {
    display:"flex", alignItems:"center", gap:8,
    fontWeight:600, fontSize:14, color:R.text, marginBottom:8
  }

  const roleLabel = user.role === "super_admin" ? "SUPER ADMIN" : "ADMIN"
  const roleColor = user.role === "super_admin" ? "#7C3AED" : R.main
  const roleBg    = user.role === "super_admin" ? "#EDE9FE" : R.light

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .pfield:focus { border-color: #B22222 !important; box-shadow: 0 0 0 3px rgba(178,34,34,.1); }
      `}</style>

      {/* HERO */}
      <div style={{
        position:"relative", overflow:"hidden", borderRadius:24,
        background:`linear-gradient(135deg, ${R.dark} 0%, ${R.main} 55%, ${R.mid} 100%)`,
        padding:"36px 44px", color:"white", boxShadow:"0 16px 48px rgba(123,13,30,.3)"
      }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", gap:32 }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.2)", padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:700, marginBottom:16 }}>
              <ShieldCheck size={14} /> PEDUMAS ADMIN PROFILE
            </div>
            <h1 style={{ fontSize:38, fontWeight:800, marginBottom:10, lineHeight:1.2 }}>Profile Admin</h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.7, maxWidth:480 }}>
              Kelola informasi akun, keamanan, dan personalisasi akun admin PEDUMAS.
            </p>
          </div>
          <div style={{ width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <ShieldCheck size={44} color="white" />
          </div>
        </div>
      </div>

      {/* GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:24 }}>

        {/* PROFILE CARD */}
        <div style={{ background:"white", borderRadius:24, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)", alignSelf:"start" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>

            <div style={{ position:"relative", marginBottom:20 }}>
              <img
                src={user.photo
                  ? `https://backend-pengaduan-production.up.railway.app/uploads/${user.photo}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||"A")}&background=B22222&color=fff&size=160`
                }
                alt=""
                style={{ width:120, height:120, borderRadius:"50%", objectFit:"cover", border:`4px solid ${R.light}` }}
              />
              <div style={{ position:"absolute", bottom:4, right:4, background:R.main, borderRadius:"50%", padding:8, display:"flex" }}>
                <Camera size={14} color="white" />
              </div>
            </div>

            <h2 style={{ fontSize:22, fontWeight:800, color:R.text, marginBottom:4 }}>{user.name}</h2>
            <p style={{ fontSize:14, color:R.muted, marginBottom:16 }}>{user.email}</p>
            <span style={{ background:roleBg, color:roleColor, padding:"6px 16px", borderRadius:100, fontSize:12, fontWeight:700 }}>
              {roleLabel}
            </span>

            <div style={{ width:"100%", marginTop:24, display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { label:"Role", value:user.role?.replace(/_/g," ")?.toUpperCase() },
                { label:"Status", value:"Active" },
              ].map((item,i) => (
                <div key={i} style={{ background:R.light, borderRadius:12, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:R.muted, fontWeight:500 }}>{item.label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:item.label==="Status"?"#059669":R.main }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ width:"100%", height:1, background:R.light, margin:"20px 0" }} />
            <p style={{ fontSize:12, color:R.muted, lineHeight:1.7, textAlign:"center" }}>
              Sebagai admin, kamu memiliki akses untuk mengelola laporan dan merespons pengaduan masyarakat.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div style={{ background:"white", borderRadius:24, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:R.text, marginBottom:6 }}>Edit Profile</h2>
          <p style={{ fontSize:14, color:R.muted, marginBottom:28 }}>Update informasi profile akun admin kamu.</p>

          <form onSubmit={handleUpdate} style={{ display:"flex", flexDirection:"column", gap:20 }}>

            <div>
              <label style={labelStyle}><User2 size={16} color={R.main} /> Nama Lengkap</label>
              <input className="pfield" style={inputStyle} type="text"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div>
              <label style={labelStyle}><Mail size={16} color={R.main} /> Email</label>
              <input style={{...inputStyle, background:"#f9f9f9", color:"#9ca3af", cursor:"not-allowed"}}
                type="email" disabled value={user.email} />
              <p style={{ fontSize:12, color:R.soft, marginTop:6 }}>Email tidak dapat diubah</p>
            </div>

            <div>
              <label style={labelStyle}><LockKeyhole size={16} color={R.main} /> Password Baru</label>
              <input className="pfield" style={inputStyle} type="password"
                placeholder="Kosongkan jika tidak ingin mengganti password"
                value={password}
                onChange={e => setPassword(e.target.value)} />
            </div>

            <div>
              <label style={labelStyle}><Camera size={16} color={R.main} /> Upload Avatar</label>
              <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])}
                style={{ width:"100%", padding:"10px", border:`1.5px solid ${R.light}`, borderRadius:12, background:"white", boxSizing:"border-box" }} />
            </div>

            <div style={{ background:R.light, borderRadius:14, padding:16, borderLeft:`3px solid ${R.main}` }}>
              <p style={{ fontSize:12, fontWeight:700, color:R.main, marginBottom:6 }}>Keamanan Akun</p>
              <p style={{ fontSize:12, color:R.muted, lineHeight:1.7 }}>
                Gunakan password yang kuat dengan minimal 8 karakter, kombinasi huruf besar, kecil, dan angka.
              </p>
            </div>

            <button type="submit" disabled={loading} style={{
              display:"flex", alignItems:"center", gap:10, padding:"14px 28px",
              background: loading ? "#ccc" : `linear-gradient(135deg,${R.dark},${R.main},${R.mid})`,
              color:"white", fontWeight:700, fontSize:15, border:"none", borderRadius:14,
              cursor: loading ? "not-allowed" : "pointer", width:"fit-content",
              boxShadow: loading ? "none" : "0 8px 24px rgba(123,13,30,.25)",
              fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all .2s"
            }}>
              <Save size={18} />
              {loading ? "Menyimpan..." : "Update Profile"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}