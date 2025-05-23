import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for treasure notes and locations
  const mockData = [
    {
      note: "Под старым дубом у реки, где ветер шепчет тайны.",
      location: "Река Светлая",
      image: "https://placehold.co/600x400?text=Old+Oak+By+The+River ",
    },
    {
      note: "В центре города, рядом с фонтаном, где собираются голуби.",
      location: "Центральная площадь",
      image: "https://placehold.co/600x400?text=Fountain+In+The+City+Center ",
    },
    {
      note: "На вершине холма, где стоит заброшенная мельница.",
      location: "Холм Мечтаний",
      image: "https://placehold.co/600x400?text=Hill+With+Old+Mill ",
    },
  ];

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Search functionality
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const filtered = mockData.filter((item) =>
        item.note.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 500); // Simulate a delay for search results
  }, [query]);

  // Particle effect setup
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouse = { x: null, y: null };
    const particleCount = 80;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      init();
    });

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    class Particle {
      constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocity = {
          x: (Math.random() - 0.5) * 2, // Random velocity for x-axis
          y: (Math.random() - 0.5) * 2, // Random velocity for y-axis
        };
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Move particles
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Bounce off edges
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.velocity.x *= -1; // Reverse direction on x-axis
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.velocity.y *= -1; // Reverse direction on y-axis
        }

        this.draw();
      }
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.strokeStyle = theme === "light" ? "#0000ff50" : "#ffffff50";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      // Connect particles to the cursor
      if (mouse.x && mouse.y) {
        for (let i = 0; i < particles.length; i++) {
          let dx = particles[i].x - mouse.x;
          let dy = particles[i].y - mouse.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.strokeStyle = theme === "light" ? "#0000ff80" : "#ffffff80";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        let size = Math.random() * 3 + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let color = theme === "light" ? "#0000ff" : "#ffffff";
        particles.push(new Particle(x, y, size, color));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
      requestAnimationFrame(animate);
    }

    init();
    animate();

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", () => {});
    };
  }, [theme]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center ${
        theme === "light"
          ? "bg-gradient-to-b from-blue-100 to-white text-gray-900"
          : "bg-gradient-to-b from-gray-900 to-black text-white"
      } transition-colors duration-300 relative overflow-hidden`}
    >
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none"></canvas>

      {/* Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center relative z-10">
        <h1 className="text-3xl font-bold">Карта Кладов</h1>
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            theme === "light"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          {theme === "light" ? "🌙 Темная тема" : "☀️ Светлая тема"}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center w-full max-w-4xl p-8 space-y-8 relative z-10">
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите текст записки..."
            className={`w-full px-4 py-3 rounded-lg outline-none transition-all duration-300 ${
              theme === "light"
                ? "bg-white border border-gray-300 focus:border-blue-500"
                : "bg-gray-800 border border-gray-700 focus:border-blue-500"
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Results Section */}
        {isLoading && (
          <div className="w-full flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {results.map((result, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={result.image}
                  alt={result.location}
                  className="w-full h-48 object-cover"
                />
                <div
                  className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 ${
                    theme === "light" ? "hover:bg-opacity-70" : ""
                  }`}
                >
                  <p className="text-white text-lg font-semibold">
                    {result.location}
                  </p>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{result.location}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {result.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && query && results.length === 0 && (
          <p className="text-gray-600 dark:text-gray-400">
            Ничего не найдено. Попробуйте другой текст.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-600 dark:text-gray-400 relative z-10">
        &copy; 2023 Карта Кладов. Все права защищены.
      </footer>
    </div>
  );
}