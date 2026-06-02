import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import { ShieldCheck, Mail, Lock, User, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      await axios.post("http://localhost:3000/api/auth/register", { name, email, password })
      navigate("/login")
    } catch { setError("Registrasi gagal. Email mungkin sudah terdaftar.") }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .input-field {
          width: 100%; padding: 14px 16px 14px 48px;
          border: 1.5px solid #F5D5D5; border-radius: 14px;
          font-size: 15px; outline: none; background: white;
          color: #1a0505; transition: all .2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-sizing: border-box;
        }
        .input-field:focus { border-color: #B22222; box-shadow: 0 0 0 4px rgba(178,34,34,.1); }
        .input-field::placeholder { color: #bca0a0; }

        .btn-back {
          display: inline-flex; align-items: center; gap: 8px;
          color: #7a3535; font-size: 14px; font-weight: 600;
          padding: 8px 16px; border-radius: 10px;
          border: 1.5px solid #e5d5d5; background: white;
          cursor: pointer; transition: all .2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .btn-back:hover { border-color: #E8A0A0; color: #B22222; background: #F5D5D5; }

        .btn-submit {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #7B0D1E, #B22222, #CD5C5C);
          color: white; font-weight: 700; font-size: 16px;
          border: none; border-radius: 14px; cursor: pointer;
          transition: all .2s;
          box-shadow: 0 8px 24px rgba(123,13,30,.35);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .btn-submit:hover:not(:disabled) { box-shadow: 0 12px 32px rgba(123,13,30,.5); transform: translateY(-1px); }
        .btn-submit:disabled { opacity: .6; cursor: not-allowed; }
      `}</style>

      {/* LEFT PANEL */}
      <div style={{
        width: "45%", position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #7B0D1E 0%, #B22222 55%, #CD5C5C 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 56px"
      }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,.07)" }} />
        <div style={{ position:"absolute", bottom:-60, left:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,.05)" }} />
        <div style={{ position:"absolute", top:"50%", right:-30, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,.04)" }} />

        <div style={{ position:"relative", zIndex:10 }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:64 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <ShieldCheck size={22} color="white" />
            </div>
            <span style={{ color:"white", fontWeight:800, fontSize:20 }}>PEDUMAS</span>
          </div>

          <h1 style={{ color:"white", fontSize:44, fontWeight:800, lineHeight:1.15, marginBottom:20 }}>
            Bergabung<br />Bersama<br />Kami
          </h1>

          <p style={{ color:"rgba(255,255,255,.75)", fontSize:16, lineHeight:1.75, maxWidth:300 }}>
            Daftarkan diri dan mulai laporkan masalah di sekitarmu untuk perubahan yang nyata.
          </p>

          {/* Benefits */}
          <div style={{ marginTop:48, display:"flex", flexDirection:"column", gap:16 }}>
            {[
              "Laporan diterima dalam hitungan detik",
              "Pantau status laporan secara realtime",
              "Diskusi langsung dengan komunitas",
              "Notifikasi otomatis setiap ada update",
            ].map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{
                  width:28, height:28, borderRadius:"50%",
                  background:"rgba(255,255,255,.2)",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                }}>
                  <CheckCircle size={14} color="white" />
                </div>
                <span style={{ color:"rgba(255,255,255,.85)", fontSize:14, fontWeight:500 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Decorative card */}
          <div style={{
            marginTop:40, background:"rgba(255,255,255,.12)",
            borderRadius:20, padding:"18px 22px",
            backdropFilter:"blur(10px)",
            border:"1px solid rgba(255,255,255,.15)"
          }}>
            <p style={{ color:"rgba(255,255,255,.65)", fontSize:12, lineHeight:1.6 }}>
              Bergabunglah bersama <strong style={{ color:"white" }}>15,000+</strong> warga yang telah mempercayakan pengaduannya kepada PEDUMAS.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex:1, display:"flex", flexDirection:"column",
        justifyContent:"center", padding:"60px 72px",
        background:"#FAFAFA"
      }}>

        <div style={{ marginBottom:44 }}>
          <button className="btn-back" onClick={() => navigate("/")}>
            <ArrowLeft size={16} /> Kembali ke Beranda
          </button>
        </div>

        <div style={{ maxWidth:400, width:"100%" }}>

          <div style={{ marginBottom:36 }}>
            <h2 style={{ fontSize:32, fontWeight:800, color:"#1a0505", marginBottom:8 }}>Buat Akun Baru</h2>
            <p style={{ color:"#7a3535", fontSize:15 }}>Daftar gratis dan mulai buat laporan hari ini</p>
          </div>

          {error && (
            <div style={{
              background:"#FEF2F2", border:"1px solid #FECACA",
              borderRadius:12, padding:"12px 16px",
              color:"#DC2626", fontSize:14, marginBottom:24, fontWeight:500
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* NAMA */}
            <div>
              <label style={{ display:"block", fontWeight:600, fontSize:14, color:"#1a0505", marginBottom:8 }}>Nama Lengkap</label>
              <div style={{ position:"relative" }}>
                <User size={18} color="#E8A0A0" style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)" }} />
                <input className="input-field" type="text" placeholder="Masukkan nama lengkap"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label style={{ display:"block", fontWeight:600, fontSize:14, color:"#1a0505", marginBottom:8 }}>Email</label>
              <div style={{ position:"relative" }}>
                <Mail size={18} color="#E8A0A0" style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)" }} />
                <input className="input-field" type="email" placeholder="contoh@email.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label style={{ display:"block", fontWeight:600, fontSize:14, color:"#1a0505", marginBottom:8 }}>Password</label>
              <div style={{ position:"relative" }}>
                <Lock size={18} color="#E8A0A0" style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)" }} />
                <input className="input-field" type={showPass ? "text" : "password"} placeholder="Minimal 6 karakter"
                  value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#bca0a0" }}>
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              <p style={{ fontSize:12, color:"#bca0a0", marginTop:6 }}>Gunakan minimal 6 karakter</p>
            </div>

            <button className="btn-submit" type="submit" disabled={loading} style={{ marginTop:4 }}>
              {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
            </button>

          </form>

          <p style={{ textAlign:"center", marginTop:24, color:"#7a3535", fontSize:14 }}>
            Sudah punya akun?{" "}
            <Link to="/login" style={{ color:"#B22222", fontWeight:700, textDecoration:"none" }}>
              Masuk di sini
            </Link>
          </p>

          {/* Info box */}
          <div style={{
            marginTop:32, background:"white",
            border:"1.5px solid #F5D5D5", borderRadius:16, padding:"18px 20px"
          }}>
            <p style={{ fontWeight:700, color:"#B22222", fontSize:13, marginBottom:8 }}>Tentang PEDUMAS</p>
            <p style={{ fontSize:13, color:"#7a3535", lineHeight:1.7 }}>
              Platform pengaduan masyarakat modern yang transparan dan akuntabel. Laporan kamu akan ditangani oleh admin terverifikasi.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}