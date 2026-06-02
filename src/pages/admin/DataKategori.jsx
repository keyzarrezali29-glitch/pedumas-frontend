import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Search, Plus, Pencil, Trash2, Layers3, X } from "lucide-react"

const R = { dark:"#7B0D1E", main:"#B22222", mid:"#CD5C5C", soft:"#E8A0A0", light:"#F5D5D5", text:"#1a0505", muted:"#7a3535" }

export default function DataKategori() {
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState("")
  const [name, setName] = useState("")
  const [editId, setEditId] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/categories")
      setCategories(res.data)
    } catch { toast.error("Gagal mengambil kategori") }
  }

  useEffect(() => { fetchCategories() }, [])

  const filteredCategories = useMemo(() =>
    categories.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
  , [categories, search])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) { toast.error("Nama kategori wajib diisi"); return }
    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/categories/${editId}`, { name })
        toast.success("Kategori berhasil diupdate")
      } else {
        await axios.post("http://localhost:3000/api/categories", { name })
        toast.success("Kategori berhasil ditambahkan")
      }
      setName(""); setEditId(null); setOpenModal(false); fetchCategories()
    } catch { toast.error("Terjadi kesalahan") }
  }

  const deleteCategory = async (id) => {
    if (!window.confirm("Yakin hapus kategori?")) return
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`)
      toast.success("Kategori berhasil dihapus"); fetchCategories()
    } catch { toast.error("Gagal menghapus kategori") }
  }

  const editCategory = (item) => { setName(item.name); setEditId(item.id); setOpenModal(true) }
  const openAddModal = () => { setName(""); setEditId(null); setOpenModal(true) }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* HERO */}
      <div style={{ position:"relative", overflow:"hidden", borderRadius:24, background:`linear-gradient(135deg,${R.dark},${R.main},${R.mid})`, padding:"36px 44px", color:"white", boxShadow:"0 16px 48px rgba(123,13,30,.3)" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,.08)" }} />
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.2)", padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:700, marginBottom:16 }}>
              <Layers3 size={13} /> PEDUMAS CATEGORY SYSTEM
            </div>
            <h1 style={{ fontSize:36, fontWeight:800, marginBottom:8 }}>Data Kategori</h1>
            <p style={{ color:"rgba(255,255,255,.75)", fontSize:15, lineHeight:1.7 }}>Kelola kategori laporan pengaduan masyarakat secara realtime.</p>
          </div>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Layers3 size={36} color="white" />
          </div>
        </div>
      </div>

      {/* STATS + SEARCH + ADD */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ background:"white", borderRadius:16, padding:"16px 24px", border:`1.5px solid ${R.light}`, boxShadow:"0 4px 16px rgba(0,0,0,.04)" }}>
            <p style={{ fontSize:12, color:R.muted, fontWeight:600, marginBottom:4 }}>Total Kategori</p>
            <p style={{ fontSize:32, fontWeight:800, color:R.main }}>{categories.length}</p>
          </div>
          <div style={{ background:"white", borderRadius:16, padding:"16px 24px", border:`1.5px solid ${R.light}`, boxShadow:"0 4px 16px rgba(0,0,0,.04)" }}>
            <p style={{ fontSize:12, color:R.muted, fontWeight:600, marginBottom:4 }}>Hasil Filter</p>
            <p style={{ fontSize:32, fontWeight:800, color:R.muted }}>{filteredCategories.length}</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ position:"relative" }}>
            <Search size={16} color={R.soft} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }} />
            <input type="text" placeholder="Cari kategori..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding:"11px 16px 11px 40px", border:`1.5px solid ${R.light}`, borderRadius:12, fontSize:14, outline:"none", background:"white", color:R.text, width:240, fontFamily:"'Plus Jakarta Sans',sans-serif" }} />
          </div>
          <button onClick={openAddModal} style={{
            display:"flex", alignItems:"center", gap:8, padding:"11px 20px",
            background:`linear-gradient(135deg,${R.main},${R.mid})`, color:"white",
            borderRadius:12, fontWeight:700, fontSize:14, border:"none", cursor:"pointer",
            boxShadow:"0 6px 20px rgba(178,34,34,.3)", fontFamily:"'Plus Jakarta Sans',sans-serif"
          }}>
            <Plus size={18} /> Tambah Kategori
          </button>
        </div>
      </div>

      {/* GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {filteredCategories.length > 0 ? filteredCategories.map((item, i) => (
          <div key={item.id} style={{
            background:"white", borderRadius:20, padding:24,
            border:`1.5px solid ${R.light}`, boxShadow:"0 4px 16px rgba(0,0,0,.04)",
            transition:"all .2s", cursor:"default"
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px rgba(123,13,30,.12)` }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.04)" }}
          >
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${R.main},${R.mid})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Layers3 size={22} color="white" />
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => editCategory(item)} style={{ width:36, height:36, borderRadius:10, background:"#FEF3C7", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Pencil size={16} color="#D97706" />
                </button>
                <button onClick={() => deleteCategory(item.id)} style={{ width:36, height:36, borderRadius:10, background:"#FEE2E2", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Trash2 size={16} color="#DC2626" />
                </button>
              </div>
            </div>
            <div style={{ fontSize:11, color:R.soft, fontWeight:600, marginBottom:4 }}>#{i+1}</div>
            <h3 style={{ fontSize:18, fontWeight:800, color:R.text }}>{item.name}</h3>
          </div>
        )) : (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 24px", background:"white", borderRadius:20, border:`1.5px solid ${R.light}` }}>
            <Layers3 size={48} color={R.soft} style={{ margin:"0 auto 16px" }} />
            <p style={{ fontWeight:700, fontSize:18, color:R.text, marginBottom:8 }}>Tidak Ada Kategori</p>
            <p style={{ color:R.muted, fontSize:14 }}>Belum ada kategori tersedia.</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99999, padding:20 }}>
          <div style={{ background:"white", width:"100%", maxWidth:480, borderRadius:24, overflow:"hidden", boxShadow:"0 24px 60px rgba(0,0,0,.2)" }}>
            <div style={{ background:`linear-gradient(135deg,${R.dark},${R.main},${R.mid})`, padding:"24px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <h2 style={{ color:"white", fontSize:22, fontWeight:800 }}>{editId ? "Edit Kategori" : "Tambah Kategori"}</h2>
                <p style={{ color:"rgba(255,255,255,.7)", fontSize:13, marginTop:4 }}>Kelola kategori PEDUMAS</p>
              </div>
              <button onClick={() => setOpenModal(false)} style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:10, padding:10, cursor:"pointer", display:"flex" }}>
                <X size={18} color="white" />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding:28, display:"flex", flexDirection:"column", gap:20 }}>
              <div>
                <label style={{ display:"block", fontWeight:600, fontSize:14, color:R.text, marginBottom:8 }}>Nama Kategori</label>
                <input type="text" placeholder="Masukkan nama kategori..." value={name} onChange={e => setName(e.target.value)}
                  style={{ width:"100%", padding:"13px 16px", border:`1.5px solid ${R.light}`, borderRadius:12, fontSize:15, outline:"none", color:R.text, fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:"border-box" }} />
              </div>
              <button type="submit" style={{
                width:"100%", padding:14, background:`linear-gradient(135deg,${R.dark},${R.main},${R.mid})`,
                color:"white", fontWeight:700, fontSize:15, border:"none", borderRadius:12, cursor:"pointer",
                boxShadow:"0 8px 24px rgba(123,13,30,.3)", fontFamily:"'Plus Jakarta Sans',sans-serif"
              }}>
                {editId ? "Update Kategori" : "Tambah Kategori"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}