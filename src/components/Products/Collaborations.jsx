import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCollaborations } from "../../services/collabService";

const Collaborations = () => {
  const [collabs, setCollabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCollaborations()
      .then((data) => {
        if (active) setCollabs(data);
      })
      .catch((err) => console.error("Error fetching collaborations:", err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Section stays empty/hidden until the admin creates collaborations
  if (loading || collabs.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Collaborations</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Exclusive partnerships and limited drops — TallBoy Clothing teams up
          with the culture.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collabs.map((collab) => (
          <Link
            key={collab.docId}
            to={`/collab/${collab.docId}`}
            className="group bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:border-gray-400 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
              {collab.imageUrl ? (
                <img
                  src={collab.imageUrl}
                  alt={collab.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col items-center text-center flex-1">
              {collab.tag && (
                <span className="text-xs font-medium uppercase tracking-widest text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
                  {collab.tag}
                </span>
              )}
              <h3 className="text-2xl font-bold uppercase tracking-tight text-gray-800 mb-2 group-hover:text-gray-600 transition-colors">
                {collab.title}
              </h3>
              {collab.description && (
                <p className="text-sm text-gray-500 mb-4">{collab.description}</p>
              )}
              <span className="mt-auto text-sm font-medium text-gray-800 border-b border-gray-800 pb-0.5 group-hover:text-gray-600 group-hover:border-gray-600 transition-colors">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Collaborations;
