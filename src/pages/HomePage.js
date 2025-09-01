import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    axios.get("/movies?limit=5").then(res => setFeatured(res.data));
    axios.get("/movies?limit=10&rating=4").then(res => setTrending(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Featured Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {featured.map(m => <MovieCard key={m._id} movie={m} />)}
      </div>

      <h1 className="text-2xl font-bold mt-6">Trending Now</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {trending.map(m => <MovieCard key={m._id} movie={m} />)}
      </div>
    </div>
  );
}
