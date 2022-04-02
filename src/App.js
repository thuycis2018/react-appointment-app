import { useState, useEffect, useCallback } from "react";
import { BiArchive } from "react-icons/bi";
import AddAppointment from "./components/AddApointment";
import Search from "./components/Search";
//import appointmentList from "./data.json";
import AppointmentInfo from "./components/AppointmentInfo";

function App() {
  let [appointmentList, setAppointmentList] = useState([]);
  let [query, setQuery] = useState("");
  let [sortBy, setSortBy] = useState("ownerName");
  let [orderBy, setOrderBy] = useState("asc");

  const filteredAppointment = appointmentList
    .filter((item) => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => {
      let order = orderBy === "asc" ? 1 : -1;
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order
        : 1 * order;
    });

  const fetchData = useCallback(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        setAppointmentList(data);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-3xl">
        <BiArchive className="inline-block text-red-400 align-top" />
        PET CARE APPOINTMENT
      </h1>
      <AddAppointment
        onSendAppointment={(myAppointment) =>
          setAppointmentList([...appointmentList, myAppointment])
        }
        lastId={appointmentList.reduce(
          (max, item) => (Number(item.id) > max ? Number(item.id) : max),
          0
        )}
      />
      <Search
        query={query}
        onQueryChange={(myQuery) => setQuery(myQuery)}
        sortBy={sortBy}
        onSortByChange={(mySort) => setSortBy(mySort)}
        orderBy={orderBy}
        onOrderByChange={(myOrder) => setOrderBy(myOrder)}
      />
      <ul className="divide-y divide-gray-200">
        {filteredAppointment.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={(appointmentId) =>
              setAppointmentList(
                appointmentList.filter(
                  (appointment) => appointment.id !== appointmentId
                )
              )
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
