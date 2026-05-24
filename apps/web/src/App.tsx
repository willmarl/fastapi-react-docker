import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [foos, setFoos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchFoos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/foos");
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setFoos([]);
      } else {
        setFoos(data.foos);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const createFile = async () => {
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/create-file", { method: "POST" });
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        await fetchFoos();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  const deleteFile = async () => {
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/delete-file", { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        await fetchFoos();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <button
          type="button"
          className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>

        <button
          type="button"
          className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={fetchFoos}
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Foos"}
        </button>

        <button
          type="button"
          className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={createFile}
        >
          Create foo.txt
        </button>

        <button
          type="button"
          className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={deleteFile}
        >
          Delete foo.txt
        </button>

        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}
        {foos.length > 0 && (
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-bold">Foos ({foos.length})</h3>
            <ul className="list-disc list-inside mt-2">
              {foos.map((foo) => (
                <li key={foo}>{foo}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
