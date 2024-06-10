import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [weather, setWeather] = useState({
    name: "",
    country: "",
    temp: "",
    condition: "",
    icon: "",
    conditionText: "",
  });
  const [error, setError] = useState({
    error: false,
    msg: "",
  });
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [show, setShow] = useState(false);

  //url api
  const url = `
  http://api.weatherapi.com/v1/current.json?key=${
    import.meta.env.VITE_API_KEY
  }&lang=es&q=${city}`;

  //axios
  const getCity = async () => {
    const { data } = await axios.get("http://localhost:3000/city");
    return data;
  };
  const saveCity = async (city) => {
    const { data } = await axios.post("http://localhost:3000/city", city);
    return data;
  };
  let e = cities.filter((c) => c.name.includes(city));

  const match = cities.filter((c) => {
    if (city && c.name.includes(city)) return c.name;
  });

  console.log(match);

  useEffect(() => {
    getCity().then((res) => {
      setCities(res);
    });
  }, [city]);

  //formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    setCity("");
    const response = await fetch(url);
    const data = await response.json();

    try {
      if (!city.trim()) throw { msg: "El campo ciudad es obligatorio" };

      if (data.error) throw { msg: "Ciudad no encontrada" };
      setError({
        error: false,
        msg: "",
      });
      saveCity({ name: city });
      setWeather({
        name: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      });
    } catch (error) {
      setError({
        error: true,
        msg: error.msg,
      });
    }
  };
  //input
  const handleChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-cyan-500 to-blue-500">
      <section className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-5  place-content-center p-10">
        <aside className=" bg-slate-200 w-full h-[350px] p-10 shadow-gray-700 shadow-lg rounded-lg md:w-[80%] ">
          <h1 className="text-center mb-10 font-semibold text-2xl ">
            INGRESE UNA CIUDAD PARA SABER SU CLIMA
          </h1>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                value={city}
                onChange={handleChange}
                type="text"
                placeholder="Ingrece una ciudad"
                className="w-full p-3 rounded-lg placeholder:text-black"
              />

              <ul className="absolute shadow-lg hover:shadow-amber-200 w-full rounded-lg">
                {match.map((ci) => {
                  return (
                    <li
                      key={ci._id}
                      onClick={() => {
                        setCity(ci.name);
                        setShow(false);
                      }}
                      className="px-4 py-3 hover:bg-orange-300 cursor-pointer z-10"
                    >
                      {match.map((i) => i.name)[0]}
                    </li>
                  );
                })}
              </ul>
            </div>
            <p
              className={`${
                !error.error
                  ? "hidden bg-transparent"
                  : "block bg-red-400 text-white p-3 rounded-lg"
              } `}
            >
              {error.msg}
            </p>
            <button className=" bg-amber-500 text-white font-semibold text-xl uppercase border px-2 py-3 rounded-lg">
              Buscar
            </button>
          </form>
        </aside>
        <main className="h-full md:h-[50%] ">
          {weather.country ? (
            <div className="flex flex-col justify-center items-center ">
              <h1 className="text-center mb-10 font-semibold text-2xl ">
                {weather.name}, {weather.country}
              </h1>
              <img
                src={weather.icon}
                alt={weather.conditionText}
                className=" w-[100px] h-[100px] rounded-lg"
              />
              <p className="text-center mb-10 font-semibold text-2xl ">
                {weather.temp}°C
              </p>
              <p className="text-center mb-10 font-semibold text-2xl ">
                {weather.conditionText}
              </p>
            </div>
          ) : null}
        </main>
      </section>
    </div>
  );
}

export default App;
