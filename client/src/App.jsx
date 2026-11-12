import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [orderingProductId, setOrderingProductId] = useState(null);
  const [orderFeedback, setOrderFeedback] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/api/products", { signal: controller.signal })
      .then((res) => setProducts(res.data))
      .catch((error) => {
        if (!axios.isCancel(error)) {
          setCatalogError("We couldn't load the catalog. Please try again.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const handleOrder = async (productId) => {
    setOrderingProductId(productId);
    setOrderFeedback(null);

    try {
      const response = await axios.post("/api/order", { productId });
      setOrderFeedback({ type: "success", text: response.data.message });
    } catch {
      setOrderFeedback({
        type: "error",
        text: "We couldn't submit the demo order. Please try again.",
      });
    } finally {
      setOrderingProductId(null);
    }
  };

  return (
    <main className="store">
      <header className="store-header">
        <p className="eyebrow">QuitSmoke Recovery</p>
        <h1>Support your next step.</h1>
        <p className="intro">
          Browse helpful products and try the demo order flow.
        </p>
      </header>

      {orderFeedback && (
        <p
          className={`feedback feedback--${orderFeedback.type}`}
          role={orderFeedback.type === "error" ? "alert" : "status"}
        >
          {orderFeedback.text}
        </p>
      )}

      <section className="catalog" aria-label="Products">
        {isLoading && <p className="catalog-message">Loading products...</p>}
        {!isLoading && catalogError && (
          <p className="catalog-message feedback--error" role="alert">
            {catalogError}
          </p>
        )}
        {!isLoading && !catalogError && products.length === 0 && (
          <p className="catalog-message">No products are available right now.</p>
        )}

        {!isLoading &&
          !catalogError &&
          products.map((product) => (
            <article className="product-card" key={product.id}>
              <div
                className="product-image"
                role="img"
                aria-label="Product image coming soon"
              >
                Product image coming soon
              </div>
              <div className="product-details">
                <h2>{product.name}</h2>
                <p className="product-price">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(product.price)}
                </p>
                <button
                  className="order-button"
                  type="button"
                  disabled={orderingProductId !== null}
                  onClick={() => handleOrder(product.id)}
                >
                  {orderingProductId === product.id
                    ? "Submitting..."
                    : "Try demo order"}
                </button>
              </div>
            </article>
          ))}
      </section>
    </main>
  );
}

export default App;
