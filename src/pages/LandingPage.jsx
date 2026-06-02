import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  ShieldCheck, MapPin, MessageCircle, Bell, BarChart3,
  ArrowRight, CheckCircle, FileText, Star,
  Zap, ChevronRight
} from "lucide-react"

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:"white", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --r-dark:  #7B0D1E;
          --r-main:  #B22222;
          --r-mid:   #CD5C5C;
          --r-soft:  #E8A0A0;
          --r-light: #F5D5D5;
          --r-bg:    #FDF0F0;
          --r-text:  #1a0505;
          --r-muted: #7a3535;
        }

        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .float-a { animation: floatA 5s ease-in-out infinite }
        .float-b { animation: floatB 3.5s ease-in-out infinite }
        .fade-up   { animation: fadeUp .7s ease both }
        .fade-up-1 { animation: fadeUp .7s .1s ease both }
        .fade-up-2 { animation: fadeUp .7s .2s ease both }
        .fade-up-3 { animation: fadeUp .7s .3s ease both }

        .btn-primary {
          background: linear-gradient(135deg, #B22222, #CD5C5C);
          color: white; font-weight: 700; border-radius: 14px;
          padding: 14px 32px; display: inline-flex; align-items: center;
          gap: 8px; border: none; cursor: pointer; transition: all .2s;
          box-shadow: 0 8px 24px rgba(178,34,34,.35);
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px;
        }
        .btn-primary:hover { box-shadow: 0 12px 32px rgba(178,34,34,.5); transform: translateY(-2px) }

        .btn-outline {
          border: 2px solid #E8A0A0; color: #B22222; font-weight: 700;
          border-radius: 14px; padding: 14px 32px; display: inline-flex;
          align-items: center; gap: 8px; background: white; cursor: pointer;
          transition: all .2s; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px;
        }
        .btn-outline:hover { background: #F5D5D5; border-color: #B22222 }

        .card-lift { transition: transform .25s, box-shadow .25s }
        .card-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(178,34,34,.12) }

        .feature-card {
          background: white;
          border: 1.5px solid #F5D5D5;
          border-radius: 24px; padding: 32px; transition: all .25s;
        }
        .feature-card:hover { border-color: #E8A0A0; box-shadow: 0 16px 40px rgba(178,34,34,.1); transform: translateY(-4px) }

        .section-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: #F5D5D5; color: #B22222;
          border: 1px solid #E8A0A0; border-radius: 100px;
          padding: 6px 16px; font-size: 13px; font-weight: 700; margin-bottom: 20px;
        }

        .step-number {
          width: 52px; height: 52px; border-radius: 50%;
          background: linear-gradient(135deg, #7B0D1E, #B22222);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 800; font-size: 17px;
          margin: 0 auto 18px;
          box-shadow: 0 8px 20px rgba(123,13,30,.3);
        }

        .divider-line {
          position: absolute; top: 26px; left: calc(50% + 26px);
          width: calc(100% - 52px); height: 2px;
          background: linear-gradient(90deg, #E8A0A0, transparent);
        }

        .hero-bg {
          background: linear-gradient(160deg, #F5D5D5 0%, white 40%, #FDF0F0 100%);
        }

        .text-grad {
          background: linear-gradient(135deg, #7B0D1E, #B22222, #CD5C5C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        background: scrolled ? "rgba(255,255,255,.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid #F5D5D5" : "none",
        transition:"all .3s", padding:"16px 48px"
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:44, height:44, borderRadius:14,
              background:"linear-gradient(135deg, #7B0D1E, #B22222)",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 6px 16px rgba(123,13,30,.3)"
            }}>
              <FileText size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize:20, fontWeight:800, color:"#B22222" }}>PEDUMAS</div>
              <div style={{ fontSize:10, color:"#CD5C5C", fontWeight:600, letterSpacing:"0.1em" }}>PENGADUAN MASYARAKAT</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button className="btn-outline" style={{ padding:"10px 24px", fontSize:14 }} onClick={() => navigate("/login")}>Masuk</button>
            <button className="btn-primary" style={{ padding:"10px 24px", fontSize:14 }} onClick={() => navigate("/register")}>
              Daftar Gratis <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-bg" style={{
        paddingTop:120, paddingBottom:100, paddingLeft:48, paddingRight:48,
        position:"relative", overflow:"hidden", minHeight:"100vh", display:"flex", alignItems:"center"
      }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(232,160,160,.45), transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, left:-60, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(178,34,34,.08), transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center", width:"100%" }}>

          {/* LEFT */}
          <div>
            <div className="section-tag fade-up">
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#B22222" }} />
              Platform Pengaduan Masyarakat
            </div>

            <h1 className="fade-up-1" style={{ fontSize:64, fontWeight:800, color:"#1a0505", lineHeight:1.1, marginBottom:24 }}>
              Suara Kamu,<br />
              <span className="text-grad">Perubahan</span><br />
              Nyata.
            </h1>

            <p className="fade-up-2" style={{ fontSize:17, color:"#7a3535", lineHeight:1.8, marginBottom:40, maxWidth:460 }}>
              Platform pengaduan masyarakat modern yang transparan. Laporkan masalah, pantau prosesnya secara realtime, dan lihat dampak nyata bersama komunitas.
            </p>

            <div className="fade-up-3" style={{ display:"flex", gap:16, marginBottom:56 }}>
              <button className="btn-primary" onClick={() => navigate("/register")}>
                Buat Laporan Sekarang <ArrowRight size={18} />
              </button>
              <button className="btn-outline" onClick={() => navigate("/login")}>
                Masuk <ChevronRight size={18} />
              </button>
            </div>

            <div style={{ display:"flex", gap:36 }}>
              {[
                { value:"2.4K+", label:"Laporan Masuk" },
                { value:"1.8K+", label:"Laporan Selesai" },
                { value:"15K+",  label:"Pengguna Aktif" },
              ].map((s,i) => (
                <div key={i}>
                  <div className="text-grad" style={{ fontSize:28, fontWeight:800 }}>{s.value}</div>
                  <div style={{ fontSize:13, color:"#7a3535", fontWeight:500, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT MOCKUP */}
          <div style={{ position:"relative", display:"flex", justifyContent:"center" }}>

            {/* Main card */}
            <div className="float-a" style={{
              background:"white", borderRadius:28, padding:28,
              boxShadow:"0 24px 60px rgba(178,34,34,.15)",
              border:"1.5px solid #F5D5D5", maxWidth:380, width:"100%"
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#7B0D1E,#B22222)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <FileText size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:"#1a0505" }}>Laporan Baru</div>
                    <div style={{ fontSize:12, color:"#9ca3af" }}>2 menit lalu</div>
                  </div>
                </div>
                <span style={{ background:"#FEF3C7", color:"#D97706", padding:"4px 12px", borderRadius:100, fontSize:12, fontWeight:700 }}>Pending</span>
              </div>
              <div style={{ fontWeight:800, fontSize:20, color:"#1a0505", marginBottom:8 }}>Jalan Rusak RT 03</div>
              <p style={{ fontSize:13, color:"#7a3535", lineHeight:1.7, marginBottom:16 }}>
                Jalan berlubang di depan gang RT 03 membahayakan pengendara motor sejak 2 minggu lalu...
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:6, color:"#B22222", fontSize:12, fontWeight:600 }}>
                <MapPin size={14} /> Jakarta Selatan
              </div>
            </div>

            {/* Floating approved */}
            <div className="float-b" style={{
              position:"absolute", top:-24, right:-24,
              background:"white", borderRadius:18, padding:"14px 18px",
              boxShadow:"0 12px 32px rgba(0,0,0,.08)", border:"1px solid #D1FAE5",
              display:"flex", alignItems:"center", gap:10
            }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"#D1FAE5", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <CheckCircle size={18} color="#059669" />
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:"#1a0505" }}>Laporan Disetujui</div>
                <div style={{ fontSize:11, color:"#9ca3af" }}>Status: Approved</div>
              </div>
            </div>

            {/* Floating rating */}
            <div className="float-a" style={{
              position:"absolute", bottom:-24, left:-32,
              borderRadius:18, padding:"14px 20px",
              background:"linear-gradient(135deg, #7B0D1E, #B22222)",
              boxShadow:"0 12px 32px rgba(123,13,30,.4)", color:"white"
            }}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:6 }}>98% Kepuasan Warga</div>
              <div style={{ display:"flex", gap:3 }}>
                {[...Array(5)].map((_,i) => <Star key={i} size={12} fill="white" color="white" />)}
              </div>
            </div>

            {/* Floating notif */}
            <div className="float-b" style={{
              position:"absolute", top:"45%", left:-48,
              background:"white", borderRadius:16, padding:"12px 16px",
              boxShadow:"0 8px 24px rgba(0,0,0,.08)", border:"1px solid #F5D5D5",
              display:"flex", alignItems:"center", gap:10
            }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"#F5D5D5", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Bell size={14} color="#B22222" />
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:12, color:"#1a0505" }}>Notifikasi Baru</div>
                <div style={{ fontSize:11, color:"#9ca3af" }}>Status laporan diperbarui</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section style={{ padding:"60px 48px", background:"white" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{
            borderRadius:28,
            background:"linear-gradient(135deg, #7B0D1E 0%, #B22222 50%, #CD5C5C 100%)",
            padding:"48px 60px", display:"grid", gridTemplateColumns:"repeat(4,1fr)",
            gap:24, textAlign:"center",
            boxShadow:"0 20px 60px rgba(123,13,30,.3)"
          }}>
            {[
              { value:"2,400+", label:"Laporan Masuk" },
              { value:"1,850+", label:"Laporan Selesai" },
              { value:"15,000+",label:"Pengguna Aktif" },
              { value:"98%",    label:"Kepuasan Warga" },
            ].map((s,i) => (
              <div key={i}>
                <div style={{ fontSize:40, fontWeight:800, color:"white", lineHeight:1.1, marginBottom:6 }}>{s.value}</div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,.7)", fontWeight:500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section style={{ padding:"80px 48px", background:"#FAFAFA" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div className="section-tag"><Zap size={13} /> Fitur Unggulan</div>
            <h2 style={{ fontSize:44, fontWeight:800, color:"#1a0505", marginBottom:16 }}>Semua yang Kamu Butuhkan</h2>
            <p style={{ fontSize:16, color:"#7a3535", maxWidth:480, margin:"0 auto", lineHeight:1.7 }}>
              Dirancang untuk memudahkan masyarakat menyampaikan aspirasi dan pengaduan secara efektif.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { icon:<FileText size={22}/>,      title:"Pelaporan Mudah",      desc:"Buat laporan lengkap dengan foto, lokasi GPS, dan kategori dalam hitungan menit.", featured:false },
              { icon:<ShieldCheck size={22}/>,   title:"Aman & Terverifikasi", desc:"Sistem autentikasi JWT memastikan setiap laporan dari pengguna terverifikasi.", featured:true },
              { icon:<Bell size={22}/>,          title:"Notifikasi Realtime",  desc:"Dapatkan notifikasi langsung saat status laporan berubah atau ada komentar baru.", featured:false },
              { icon:<MessageCircle size={22}/>, title:"Diskusi Komunitas",    desc:"Komentari laporan, berikan dukungan, dan diskusikan solusi bersama warga lain.", featured:false },
              { icon:<MapPin size={22}/>,        title:"Lokasi Akurat",        desc:"Koordinat GPS otomatis dan link Google Maps untuk mempermudah verifikasi lapangan.", featured:false },
              { icon:<BarChart3 size={22}/>,     title:"Dashboard Statistik",  desc:"Pantau laporan secara visual dengan chart interaktif dan data realtime.", featured:false },
            ].map((item,i) => (
              item.featured ? (
                <div key={i} style={{ borderRadius:24, padding:32, background:"linear-gradient(135deg, #7B0D1E, #B22222, #CD5C5C)", transition:"all .25s" }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                    <span style={{ color:"white" }}>{item.icon}</span>
                  </div>
                  <h3 style={{ fontSize:18, fontWeight:700, marginBottom:10, color:"white" }}>{item.title}</h3>
                  <p style={{ fontSize:14, lineHeight:1.7, color:"rgba(255,255,255,.8)" }}>{item.desc}</p>
                </div>
              ) : (
                <div key={i} className="feature-card card-lift">
                  <div style={{ width:52, height:52, borderRadius:14, background:"#F5D5D5", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                    <span style={{ color:"#B22222" }}>{item.icon}</span>
                  </div>
                  <h3 style={{ fontSize:18, fontWeight:700, marginBottom:10, color:"#1a0505" }}>{item.title}</h3>
                  <p style={{ fontSize:14, lineHeight:1.7, color:"#7a3535" }}>{item.desc}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section style={{ padding:"80px 48px", background:"white" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 style={{ fontSize:44, fontWeight:800, color:"#1a0505", marginBottom:12 }}>Cara Kerja PEDUMAS</h2>
            <p style={{ fontSize:16, color:"#7a3535" }}>4 langkah mudah untuk menyampaikan pengaduanmu</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32 }}>
            {[
              { step:"01", title:"Daftar Akun",     desc:"Buat akun gratis dengan email dan password dalam hitungan detik." },
              { step:"02", title:"Buat Laporan",    desc:"Isi formulir laporan dengan detail, foto, dan lokasi kejadian." },
              { step:"03", title:"Kirim & Pantau",  desc:"Kirimkan laporan dan pantau statusnya secara realtime." },
              { step:"04", title:"Masalah Teratasi",desc:"Admin meninjau dan menindaklanjuti laporan dengan cepat." },
            ].map((item,i) => (
              <div key={i} style={{ textAlign:"center", position:"relative" }}>
                {i < 3 && <div className="divider-line" />}
                <div className="step-number">{item.step}</div>
                <h3 style={{ fontSize:16, fontWeight:700, color:"#1a0505", marginBottom:8 }}>{item.title}</h3>
                <p style={{ fontSize:13, color:"#7a3535", lineHeight:1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 48px", background:"#FAFAFA" }}>
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontSize:48, fontWeight:800, color:"#1a0505", marginBottom:16, lineHeight:1.2 }}>
            Siap Membuat{" "}
            <span className="text-grad">Perubahan?</span>
          </h2>
          <p style={{ fontSize:16, color:"#7a3535", marginBottom:40, lineHeight:1.7, maxWidth:480, margin:"0 auto 40px" }}>
            Bergabunglah bersama ribuan warga yang telah mempercayakan aspirasi mereka kepada PEDUMAS.
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
            <button className="btn-primary" style={{ fontSize:16, padding:"16px 40px" }} onClick={() => navigate("/register")}>
              Daftar Sekarang — Gratis <ArrowRight size={18} />
            </button>
            <button className="btn-outline" style={{ fontSize:16, padding:"16px 40px" }} onClick={() => navigate("/login")}>
              Sudah Punya Akun?
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#0f0205", color:"white", padding:"40px 48px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#7B0D1E,#B22222)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <FileText size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:16 }}>PEDUMAS</div>
              <div style={{ fontSize:11, color:"#CD5C5C" }}>Pengaduan Masyarakat</div>
            </div>
          </div>
          <p style={{ color:"#5a2020", fontSize:13 }}>2026 PEDUMAS. Platform Pengaduan Masyarakat Indonesia.</p>
          <div style={{ display:"flex", gap:12 }}>
            <button className="btn-outline" style={{ padding:"8px 20px", fontSize:13 }} onClick={() => navigate("/login")}>Masuk</button>
            <button className="btn-primary" style={{ padding:"8px 20px", fontSize:13 }} onClick={() => navigate("/register")}>Daftar</button>
          </div>
        </div>
      </footer>

    </div>
  )
}