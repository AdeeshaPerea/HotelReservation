import { useEffect, useState } from "react";
import axios from "axios";
import "./Rooms.css";
import { useNavigate } from "react-router-dom";


function Rooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    axios.get("http://localhost:8002/room/all")
      .then(res => {
        console.log(res.data);   // Show data in console
        setRooms(res.data);      // Store data in state
      })
      .catch(err => {
        console.error("Error fetching rooms:", err);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Available Rooms</h1>

      <div className="row">
        {rooms.map((room) => (
          <div key={room.id} className="col-md-4 mb-4">
            <div className="card room-card">

              {/* Room Image */}
              <img
                src={
                  JSON.parse(room.images || "[]")[0] ||
                  "https://via.placeholder.com/400"
                }
                className="card-img-top"
                alt={room.type}
                />
                
              <div className="card-body">
                <h5 className="card-title">{room.type}</h5>
                <p className="card-text">{room.description}</p>
                <p className="price">${room.price} / night</p>

                <button
                className="btn btn-primary w-100"
                onClick={() => navigate(`/reservation?roomId=${room.id}`)}
                >
                Book Now
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Rooms;
