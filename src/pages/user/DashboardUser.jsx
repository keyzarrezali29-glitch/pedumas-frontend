import { Clock3, CheckCircle, XCircle, FileText, PlusCircle, BellRing, ArrowRight, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import axios from "axios"

const R = { dark:"#8B1A1A", main:"#C0392B", mid:"#E8756A", soft:"#F4B8B0", light:"#FAE0DC", text:"#1a0a0a", muted:"#6b3535" }

export default function DashboardUser() {
  const token = localStorage.getItem("token")
  const user  = JSON.parse(localStorage.getItem("user") || "{}")

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      const res = await axios.get("https://backend-pengaduan-production.up.railway.app/api/laporan/my-reports", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReports(res.data)
    } catch (err) { console.log(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchReports() }, [])

  // STATS dari data lokal
  const total    = reports.length
  const pending  = reports.filter(r => r.status==="pending").length
  const approved = reports.filter(r => r.status==="approved").length
  const rejected = reports.filter(r => r.status==="rejected").length

  const recentReports = [...reports].slice(0, 5)

  const chartData = [
    { name:"Pending",  value:pending,  color:"#F59E0B" },
    { name:"Approved", value:approved, color:"#10B981" },
    { name:"Rejected", value:rejected, color:"#EF4444" },
  ]

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"70vh" }}>
      <div style={{ width:48, height:48, borderRadius:"50%", border:`4px solid ${R.light}`, borderTopColor:R.main, animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* HERO */}
      <div style={{
        position:"relative", overflow:"hidden", borderRadius:32,
        background:`linear-gradient(135deg, ${R.dark} 0%, ${R.main} 50%, ${R.mid} 100%)`,
        padding:"40px 48px", color:"white", boxShadow:`0 20px 60px rgba(139,26,26,.3)`
      }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
        <div style={{ position:"absolute", bottom:-40, left:"40%", width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.05)" }} />
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between", gap:32 }}>
          <div>
            <div style={{ background:"rgba(255,255,255,.2)", padding:"8px 16px", borderRadius:100, fontSize:12, fontWeight:700, letterSpacing:"0.08em", display:"inline-block", marginBottom:16 }}>
              PEDUMAS SYSTEM
            </div>
            <h1 style={{ fontSize:42, fontWeight:800, marginBottom:12, lineHeight:1.2 }}>
              Selamat Datang, {user?.name}
            </h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:16, lineHeight:1.7, maxWidth:480 }}>
              Pantau laporan pengaduan masyarakat secara realtime, modern, cepat, dan efisien.
            </p>
          </div>
          <div style={{ width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <BellRing size={48} color="white" />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
        {[
          { label:"Total Laporan", value:total,    color:R.main,    bg:R.light,   icon:<FileText size={28}/> },
          { label:"Pending",       value:pending,  color:"#D97706", bg:"#FEF3C7", icon:<Clock3 size={28}/> },
          { label:"Approved",      value:approved, color:"#059669", bg:"#D1FAE5", icon:<CheckCircle size={28}/> },
          { label:"Rejected",      value:rejected, color:"#DC2626", bg:"#FEE2E2", icon:<XCircle size={28}/> },
        ].map((s, i) => (
          <div key={i} style={{ background:"white", borderRadius:24, padding:"28px 24px", border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:13, fontWeight:600, color:R.muted, marginBottom:12 }}>{s.label}</p>
              <p style={{ fontSize:44, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</p>
            </div>
            <div style={{ width:52, height:52, borderRadius:14, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, flexShrink:0 }}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* CHART + RECENT */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:20 }}>

        {/* BAR CHART */}
        <div style={{ background:"white", borderRadius:28, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
            <div style={{ width:8, height:32, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
            <h2 style={{ fontSize:18, fontWeight:800, color:R.text }}>Statistik Laporan</h2>
          </div>

          {total > 0 ? (
            <>
              <div style={{ height:200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={44}>
                    <CartesianGrid strokeDasharray="3 3" stroke={R.light} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize:12, fontFamily:"Plus Jakarta Sans" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill:R.light }} />
                    <Bar dataKey="value" radius={[8,8,0,0]}>
                      {chartData.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* LEGEND */}
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:16 }}>
                {chartData.map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:item.color }} />
                      <span style={{ fontSize:13, color:R.muted, fontWeight:500 }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize:14, fontWeight:700, color:R.text }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <TrendingUp size={40} color={R.soft} style={{ margin:"0 auto 12px" }} />
              <p style={{ color:R.muted, fontSize:14, fontWeight:600 }}>Belum ada data laporan</p>
              <p style={{ color:R.soft, fontSize:12, marginTop:6 }}>Buat laporan pertamamu!</p>
            </div>
          )}
        </div>

        {/* RECENT REPORTS */}
        <div style={{ background:"white", borderRadius:28, padding:28, border:`1.5px solid ${R.light}`, boxShadow:"0 4px 20px rgba(0,0,0,.05)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:8, height:32, borderRadius:4, background:`linear-gradient(${R.main},${R.mid})` }} />
              <h2 style={{ fontSize:18, fontWeight:800, color:R.text }}>Laporan Terbaru</h2>
            </div>
            <Link to="/user/reports" style={{
              display:"flex", alignItems:"center", gap:6,
              color:R.main, fontSize:13, fontWeight:700, textDecoration:"none",
              padding:"6px 14px", borderRadius:10, border:`1.5px solid ${R.soft}`, background:R.light
            }}>
              Lihat Semua <ArrowRight size={14}/>
            </Link>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {recentReports.length > 0 ? recentReports.map((item) => (
              <Link key={item.id} to={`/user/detail-report/${item.id}`} style={{ textDecoration:"none" }}>
                <div style={{ border:`1.5px solid ${R.light}`, borderRadius:18, padding:"16px 20px", transition:"all .2s", cursor:"pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=R.soft; e.currentTarget.style.background=R.light }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=R.light; e.currentTarget.style.background="white" }}
                >
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                    <h3 style={{ fontWeight:700, fontSize:15, color:R.text }}>{item.title}</h3>
                    <span style={{
                      fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:100,
                      background: item.status==="approved"?"#D1FAE5":item.status==="rejected"?"#FEE2E2":"#FEF3C7",
                      color: item.status==="approved"?"#059669":item.status==="rejected"?"#DC2626":"#D97706"
                    }}>
                      {item.status}
                    </span>
                  </div>
                  <p style={{ fontSize:13, color:R.muted, lineHeight:1.6 }}>
                    {item.description?.length > 80 ? item.description.slice(0,80)+"..." : item.description}
                  </p>
                  {item.response && (
                    <div style={{ marginTop:8, padding:"8px 12px", background:"#D1FAE5", borderRadius:8 }}>
                      <p style={{ fontSize:12, color:"#059669", fontWeight:600 }}>Tanggapan Admin: {item.response}</p>
                    </div>
                  )}
                </div>
              </Link>
            )) : (
              <div style={{ textAlign:"center", padding:"40px 0" }}>
                <FileText size={48} color={R.soft} style={{ margin:"0 auto 12px" }} />
                <p style={{ color:R.muted, fontWeight:600 }}>Belum ada laporan</p>
                <p style={{ color:R.soft, fontSize:13, marginTop:6 }}>Mulai buat laporan sekarang!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        borderRadius:28,
        background:`linear-gradient(135deg, ${R.dark} 0%, ${R.main} 55%, ${R.mid} 100%)`,
        padding:"36px 48px", color:"white",
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:32,
        boxShadow:`0 16px 48px rgba(139,26,26,.25)`
      }}>
        <div>
          <h2 style={{ fontSize:28, fontWeight:800, marginBottom:8 }}>Buat Laporan Baru</h2>
          <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.7 }}>
            Laporkan masalah masyarakat dengan mudah, cepat, dan akurat.
          </p>
        </div>
        <Link to="/user/create-report" style={{
          display:"flex", alignItems:"center", gap:10,
          background:"white", color:R.main,
          padding:"14px 28px", borderRadius:18,
          fontWeight:700, fontSize:15, textDecoration:"none",
          whiteSpace:"nowrap", flexShrink:0,
          boxShadow:"0 8px 24px rgba(0,0,0,.15)"
        }}>
          <PlusCircle size={20} />
          Buat Pengaduan
        </Link>
      </div>
    </div>
  )
}