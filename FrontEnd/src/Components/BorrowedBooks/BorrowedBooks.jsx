import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

const BorrowedBooks = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returnQuantities, setReturnQuantities] = useState({});

  // Fetch users on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  // Fetch borrowed books when selectedUser changes
  useEffect(() => {
    if (!selectedUser) return; // Don't fetch if no user is selected
    
    // Clear previous borrowed books
    setBorrowedBooks([]);
    setReturnQuantities({});

    setLoading(true); // Start loading

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
        setLoading(false); // Stop loading
      });
  }, [selectedUser]); // Only run when selectedUser changes

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
    <div className="min-h-screen bg-gray-100 bg-gradient-to-br from-sky-600 to-blue-600 text-gray-900">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 pt-24">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          📚 Borrowed Books Management
        </h2>

        {/* User Selection */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="block mb-2 font-semibold text-gray-700">
            Select User
          </label>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <select
              className="flex-1 border border-gray-300 rounded p-2"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">-- Choose User --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Borrowed Books List */}
        {loading && <p className="text-gray-500">Loading borrowed books...</p>}

        {!loading && borrowedBooks.length > 0 && (
          <div className="space-y-4">
            {borrowedBooks.map((book) => (
              <div
                key={book.assignmentId}
                className="bg-white shadow-md p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {book.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {book.quantity} | Due:{" "}
                      {new Date(book.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <input
                    type="number"
                    className="border px-3 py-2 rounded-md w-24"
                    min="1"
                    max={book.quantity}
                    value={returnQuantities[book.assignmentId] || ""}
                    onChange={(e) =>
                      handleQuantityChange(book.assignmentId, e.target.value)
                    }
                  />
                  <button
                    onClick={() => returnBooks(book.assignmentId, book._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Return
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && borrowedBooks.length === 0 && selectedUser && (
          <p className="text-gray-600 text-center mt-4">
            No borrowed books found for this user.
          </p>
        )}
      </main>
    </div>
  );
};

export default BorrowedBooks;
