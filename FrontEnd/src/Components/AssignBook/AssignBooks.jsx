import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

const AssignBooks = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [assignments, setAssignments] = useState([{ bookId: "", quantity: 1 }]);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data));
    axios.get("http://localhost:5000/books").then((res) => setBooks(res.data));
  }, []);

  const handleAssignmentChange = (index, field, value) => {
    const updated = [...assignments];
    updated[index][field] = field === "quantity" ? parseInt(value) : value;
    setAssignments(updated);
  };

  const handleAddBook = () => {
    setAssignments([...assignments, { bookId: "", quantity: 1 }]);
  };

  const handleRemoveBook = (index) => {
    const updated = [...assignments];
    updated.splice(index, 1);
    setAssignments(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !dueDate) {
      return alert("Please select a user and due date.");
    }

    for (const item of assignments) {
      const book = books.find((b) => b._id === item.bookId);
      if (!book || item.quantity > book.quantity) {
        return alert(
          `Invalid quantity for "${book?.name}". Only ${book?.quantity} available.`
        );
      }
    }

    try {
      const response = await axios.post("http://localhost:5000/assign", {
        userId: selectedUser,
        books: assignments,
        dueDate,
      });

      if (response.status === 200) {
        alert("Books assigned successfully!");
        setAssignments([{ bookId: "", quantity: 1 }]);
        setSelectedUser("");
        setDueDate("");
      } else {
        alert("Error assigning books");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to assign books.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl p-8 text-gray-800">
          <h2 className="text-3xl font-semibold text-center mb-8">
            📚 Assign Books
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Selection */}
            <div>
              <label className="block mb-1 font-medium">Select User</label>
              <select
                className="w-full border rounded-md p-3 text-gray-700"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
              >
                <option value="">-- Choose User --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Book Assignments */}
            {assignments.map((assignment, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-4 items-end border p-4 rounded-lg bg-gray-50"
              >
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Select Book</label>
                  <select
                    className="w-full border rounded-md p-3 text-gray-700"
                    value={assignment.bookId}
                    onChange={(e) =>
                      handleAssignmentChange(index, "bookId", e.target.value)
                    }
                    required
                  >
                    <option value="">-- Choose Book --</option>
                    {books.map((book) => (
                      <option key={book._id} value={book._id}>
                        {book.name} (Available: {book.quantity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-32">
                  <label className="block mb-1 font-medium">Quantity</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-3 text-gray-700"
                    min="1"
                    value={assignment.quantity}
                    onChange={(e) =>
                      handleAssignmentChange(index, "quantity", e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveBook(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Add Book Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleAddBook}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                + Add Another Book
              </button>
            </div>

            {/* Due Date */}
            <div>
              <label className="block mb-1 font-medium">Due Date</label>
              <input
                type="date"
                className="w-full border rounded-md p-3 text-gray-700"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700"
              >
                Assign Books
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignBooks;
