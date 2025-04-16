import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { Navigate, useNavigate } from "react-router-dom";

const BorrowedBooks = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returnQuantities, setReturnQuantities] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // ✅ now it's valid
    }
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    setBorrowedBooks([]);
    setReturnQuantities({});
    setLoading(true);

    axios
      .get(`http://localhost:5000/borrowed-books/${selectedUser}`)
      .then((res) => {
        setBorrowedBooks(res.data);
        const initialQuantities = {};
        res.data.forEach((book) => {
          initialQuantities[book.assignmentId] = book.quantity;
        });
        setReturnQuantities(initialQuantities);
      })
      .catch((err) => {
        console.error("Failed to fetch borrowed books", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedUser]);

  const handleQuantityChange = (assignmentId, value) => {
    const quantity = parseInt(value) || 0;
    setReturnQuantities((prev) => ({ ...prev, [assignmentId]: quantity }));
  };

  const returnBooks = async (assignmentId, bookId) => {
    const quantity = returnQuantities[assignmentId];
    if (quantity <= 0) {
      alert("Please enter a valid quantity to return.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/return-books", {
        userId: selectedUser,
        assignmentId,
        books: [{ bookId, quantity }],
      });

      alert("Books returned successfully!");
      setBorrowedBooks((prev) =>
        prev.map((book) => {
          if (book.assignmentId === assignmentId) {
            const newQty = book.quantity - quantity;
            return {
              ...book,
              quantity: newQty > 0 ? newQty : 0,
            };
          }
          return book;
        })
      );
    } catch (err) {
      alert("Failed to return books.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-12">
        <h2 className="text-4xl font-bold mb-8 text-center text-white drop-shadow-lg">
          📚 Borrowed Books Management
        </h2>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-10 shadow-xl">
          <label className="block text-lg font-semibold mb-2 text-white">
            Select User
          </label>
          <select
            className="w-full bg-white/20 border border-white/30 backdrop-blur-md text-white p-3 rounded-xl focus:outline-none"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Choose User --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id} className="text-black">
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="text-center text-gray-300 animate-pulse">
            Loading borrowed books...
          </p>
        )}

        {!loading && borrowedBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowedBooks.map((book) => (
              <div
                key={book.assignmentId}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-md transition hover:scale-[1.02] hover:shadow-xl"
              >
                <h3 className="text-xl font-bold mb-1 text-white">
                  {book.name}
                </h3>
                <p className="text-sm text-gray-200 mb-3">
                  Quantity: {book.quantity} | Due:{" "}
                  {new Date(book.dueDate).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    className="w-20 p-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none"
                    min="1"
                    max={book.quantity}
                    value={returnQuantities[book.assignmentId] || ""}
                    onChange={(e) =>
                      handleQuantityChange(book.assignmentId, e.target.value)
                    }
                  />
                  <button
                    onClick={() => returnBooks(book.assignmentId, book._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
                  >
                    Return
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && borrowedBooks.length === 0 && selectedUser && (
          <p className="text-center text-gray-300 mt-8">
            No borrowed books found for this user.
          </p>
        )}
      </main>
    </div>
  );
};

export default BorrowedBooks;
