import React, { useState, useEffect } from 'react';
import './App.css';

// Używamy tego hooka, żeby przenieść całą "ciężką" logikę poza komponent
// i celowo opóźnić jego renderowanie oraz zablokować wątek główny
const useHeavyLoader = () => {
  // Zmieniamy początkową wartość 'data' na pustą tablicę
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Symulacja długiego opóźnienia sieci, które spowolni TTI i TBT
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Celowe dodanie dużego, blokującego zadania
      let heavyLoopResult = 0;
      for (let i = 0; i < 50000000; i++) {
        heavyLoopResult += Math.sqrt(i);
      }
      console.log("Ciężka pętla zakończona. Wynik:", heavyLoopResult);

      try {
        // Prawidłowe pobieranie danych z Unsplash
        const response = await fetch(`https://api.unsplash.com/photos?per_page=30&client_id=TsbszjCfuMceKpo90pkigdDRdfLBiWypn0ZjkhBigwU`);
        const fetchedData = await response.json();

        // Upewniamy się, że dane są tablicą przed ustawieniem stanu
        if (Array.isArray(fetchedData)) {
          setData(fetchedData);
        } else {
          console.error("API did not return an array:", fetchedData);
          setData([]); // Ustawiamy pustą tablicę w przypadku błędu
        }

      } catch (error) {
        console.error('Błąd podczas ładowania danych:', error);
        setData([]); // Ustawiamy pustą tablicę w przypadku błędu
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading };
};

const Header = () => (
    <header className="jumbotron jumbotron-fluid text-center">
      <div className="container">
        <h1 className="display-4">Witaj na Słabej Stronie (React)</h1>
        <p className="lead">Obejrzyj nasz film, który ładuje się bardzo wolno.</p>
        <div className="embed-responsive embed-responsive-16by9">
          <iframe
              className="embed-responsive-item"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              allowFullScreen
              loading="eager" // Celowo włączone "eager" by spowolnić
          />
        </div>
      </div>
    </header>
);

const Gallery = () => {
  const { data, loading } = useHeavyLoader();

  return (
      <main className="container py-5">
        <h2 className="text-center mb-5">Galeria Danych (ładowanie celowo spowolnione)</h2>
        <div className="row">
          {loading ? (
              <div className="col-12 text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Ładowanie...</span>
                </div>
              </div>
          ) : (
              // Dodajemy warunkowe renderowanie, aby upewnić się, że 'data' jest tablicą przed mapowaniem
              Array.isArray(data) && data.map((item) => (
                  <div key={item.id} className="col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100">
                      <img
                          src={item.urls.small}
                          className="card-img-top"
                          alt={item.alt_description}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{item.user.name}</h5>
                        <p className="card-text">Autor: {item.user.username}</p>
                      </div>
                    </div>
                  </div>
              ))
          )}
        </div>
      </main>
  );
};

const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#">Słabość.pl</a>
        {/* Tutaj nie ma Bootstrap JS, więc musimy ręcznie obsłużyć "toggle" */}
        <button className="navbar-toggler" type="button" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Start <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">O nas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Usługi</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Kontakt</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" aria-haspopup="true" aria-expanded="false">
                Więcej
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Blog</a>
                <a className="dropdown-item" href="#">Galeria</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">Cennik</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
);

const App = () => (
    <div className="App">
      <Navbar />
      <Header />
      <Gallery />
    </div>
);

export default App;