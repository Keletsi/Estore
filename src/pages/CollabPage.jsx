import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCollaborationById, getProductsByIds } from "../services/collabService";
import ProductGrid from "../components/Products/ProductGrid";

const CollabPage = () => {
  const { id } = useParams();
  const [collab, setCollab] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCollaborationById(id)
      .then(async (data) => {
        if (!active) return;
        setCollab(data);
        if (data?.productIds?.length) {
          const collabProducts = await getProductsByIds(data.productIds);
          if (active) setProducts(collabProducts);
        }
      })
      .catch((err) => console.error("Error loading collaboration:", err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  if (!collab) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-semibold mb-4">Collaboration not found</h2>
        <Link to="/" className="bg-gray-800 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Collab banner */}
      <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden">
        {collab.imageUrl ? (
          <img
            src={collab.imageUrl}
            alt={collab.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center">
          <div className="text-center text-white p-6">
            {collab.tag && (
              <p className="text-xs font-medium uppercase tracking-widest mb-3 text-gray-200">
                {collab.tag}
              </p>
            )}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-3">
              {collab.title}
            </h1>
            {collab.description && (
              <p className="text-sm md:text-lg tracking-tight max-w-2xl mx-auto">
                {collab.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Collab products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8">Shop The Collaboration</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
};

export default CollabPage;
