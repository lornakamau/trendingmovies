import axios from "axios";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const apiKey = process.env.REACT_APP_API_KEY.replace('"', '');
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://api.themoviedb.org/3/trending/movie/day?api_key=" + apiKey
      );
      setMovies(data.results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      let message = error?.response?.data?.status_message;
      setFetchError(message);
      alert(message);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            var label = "Average Votes: ";
            var votes = context.dataset.votes;
            if (context.parsed !== null) {
              return label + votes[context.parsed?.x];
            }
          },
        },
      },
    },
    scales: {
      x: {
          display: true,
          title: {
          display: true,
          text: 'Movie Title',
          font: {
              weight: 'bold',
              lineHeight: 1.2,
              size: 15
          },
          padding: {top: 15, left: 0, right: 0, bottom: 0}
          }
      },
      y: {
          display: true,
          title: {
          display: true,
          text: 'Movie Popularity',
          font: {
              weight: 'bold',
              lineHeight: 1.2,
              size: 15
              },
              padding: {top: 'auto', left: 0, right: 0, bottom: 0}
          }
          }
      }
  };

  const chartData = {
    labels: movies.map((el) => el.title),
    datasets: [
      {
        label: "Popularity",
        data: movies.map((item) => item.popularity),
        votes: movies.map((item) => item.vote_average),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="h-100">
      <div className="bg d-flex align-content-center justify-content-center flex-column text-center">
        <h1>TrendingMovies.org</h1>
        <h3 className="mt-1">Welcome.</h3>
        <h3 className="fw-400">Millions of trending movies to discover.</h3>
      </div>
      <div className="p-6 d-flex align-content-center justify-content-center flex-column">
        <div className="row">
          <div
            className={
              "text-center " +
              (movies.length !== 0 ? "col-12 col-lg-8" : "col-12")
            }
          >
            <button
              type="button"
              className="btn btn-primary btn-lg mb-3"
              disabled={movies.length !== 0}
              onClick={() => fetchData()}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  &nbsp; Loading...
                </>
              ) : (
                " Explore now"
              )}
            </button>
            <div
              className="toast align-items-center"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div className="d-flex">
                <div className="toast-body">
                  Hello, world! This is a toast message.
                </div>
                <button
                  type="button"
                  className="btn-close me-2 m-auto"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                ></button>
              </div>
            </div>
            <Bar data={chartData} options={options} className="bar" />
          </div>

          {movies.length === 0 ? (
            <></>
          ) : (
            <div className="col-12 col-lg-4">
              <form onSubmit={onSubmitHandler}>
                <p className="text-muted fs-1">* This is a dummy form</p>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Title
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="name"
                    autoComplete="off"
                    placeholder="Enter movie title"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="popularity" className="form-label">
                    Popularity
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    id="popularity"
                    placeholder="Enter movie popularity"
                  />
                </div>
                <div>
                  <button className="btn btn-outline-primary" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
