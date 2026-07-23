import {
  useEffect,
  useState
} from "react"



import toast from "react-hot-toast"

import {
  Trash2,
  Send,
  MessageCircle
} from "lucide-react"

export default function AdminComments({
  laporanId
}) {

  const [comments, setComments] =
    useState([])

  const [comment, setComment] =
    useState("")

  const token =
    localStorage.getItem("token")

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    )

  // ======================
  // FETCH COMMENTS
  // ======================

  const fetchComments =
    async () => {

      try {

        const res =
          await api.get(
            `/api/comment/${laporanId}`
          )

        setComments(res.data)

      } catch (err) {

        console.log(err)

        toast.error(
          "Gagal mengambil komentar"
        )

      }

    }

  useEffect(() => {

    if (laporanId) fetchComments()

  }, [laporanId])

  // ======================
  // SEND COMMENT
  // ======================

  const sendComment =
    async () => {

      if (!comment.trim()) return

      try {

        await api.post(
          "/api/comment",

          {
            laporan_id: Number(laporanId),
            comment: comment.trim(),
            parent_id: null
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "application/json"
            }
          }
        )

        toast.success(
          "Komentar berhasil dikirim"
        )

        setComment("")

        fetchComments()

      } catch (err) {

        console.log(err)

        toast.error(
          "Gagal kirim komentar"
        )

      }

    }

  // ======================
  // DELETE COMMENT
  // ======================

  const deleteComment =
    async (id) => {

      try {

        await api.delete(
          `https://backend-pengaduan-production.up.railway.app/api/comment/${id}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

        toast.success(
          "Komentar berhasil dihapus"
        )

        fetchComments()

      } catch (err) {

        console.log(err)

        toast.error(
          "Gagal hapus komentar"
        )

      }

    }

  return (

    <div>

      {/* INPUT */}

      <div className="
        flex
        gap-3
        mb-8
      ">

        <input
          type="text"
          placeholder="Tulis komentar admin..."
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          onKeyDown={(e) =>
            e.key === "Enter" && sendComment()
          }
          className="
            flex-1
            bg-pink-50
            border
            border-pink-100
            rounded-2xl
            px-5
            py-4
            outline-none
          "
        />

        <button
          onClick={sendComment}
          className="
            bg-gradient-to-r
            from-pink-500
            to-rose-400
            hover:opacity-90
            text-white
            px-6
            rounded-2xl
            flex
            items-center
            justify-center
          "
        >

          <Send size={20} />

        </button>

      </div>

      {/* COMMENTS */}

      <div className="
        space-y-4
        max-h-[400px]
        overflow-auto
      ">

        {
          comments.length > 0

          ? (

            comments.map((item) => (

              <div
                key={item.id}
                className="
                  bg-pink-50
                  rounded-3xl
                  p-5
                  flex
                  justify-between
                  gap-5
                "
              >

                <div>

                  <h1 className="
                    font-black
                    text-lg
                  ">
                    {item.name}
                  </h1>

                  <p className="
                    text-sm
                    text-pink-500
                    mb-2
                    capitalize
                  ">
                    {item.role}
                  </p>

                  <p className="
                    text-gray-700
                  ">
                    {item.comment}
                  </p>

                  <p className="
                    text-xs
                    text-gray-400
                    mt-2
                  ">
                    {
                      new Date(
                        item.created_at
                      ).toLocaleString("id-ID")
                    }
                  </p>

                </div>

                {
                  Number(item.user_id)
                  ===
                  Number(user?.id)

                  && (

                    <button
                      onClick={() =>
                        deleteComment(
                          item.id
                        )
                      }
                      className="
                        text-red-400
                        hover:text-red-600
                        shrink-0
                      "
                    >

                      <Trash2 size={18} />

                    </button>

                  )
                }

              </div>

            ))

          ) : (

            <div className="
              bg-pink-50
              rounded-3xl
              p-10
              text-center
            ">

              <MessageCircle
                size={45}
                className="
                  mx-auto
                  text-pink-400
                  mb-4
                "
              />

              <h1 className="
                text-2xl
                font-black
                mb-2
              ">
                Belum Ada Komentar
              </h1>

              <p className="
                text-gray-500
              ">
                Diskusi laporan akan muncul disini
              </p>

            </div>

          )
        }

      </div>

    </div>

  )

}