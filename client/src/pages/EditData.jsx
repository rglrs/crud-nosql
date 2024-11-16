import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";

export function EditData() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDoctor, setEditDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:3000/doctor");
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleEditClick = (doctor) => {
    setEditDoctor(doctor);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDoctor({ ...editDoctor, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/doctor/${editDoctor._id}`, editDoctor);
      setDoctors((prevDoctors) =>
        prevDoctors.map((doc) => (doc._id === editDoctor._id ? editDoctor : doc))
      );
      setEditDoctor(null);
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, index) => {
              const isLast = index === doctors.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={doctor._id}>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {doctor.firstName} {doctor.lastName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {doctor.email}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {doctor.phone}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {doctor.yearsOfExperience} years
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {doctor.address.city}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Tooltip content="Edit Doctor">
                      <IconButton variant="text" onClick={() => handleEditClick(doctor)}>
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>

      {editDoctor && (
        <form onSubmit={handleFormSubmit}>
          <Input
            type="text"
            name="firstName"
            value={editDoctor.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
          />
          <Input
            type="text"
            name="lastName"
            value={editDoctor.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
          />
          <Input
            type="email"
            name="email"
            value={editDoctor.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <Input
            type="text"
            name="phone"
            value={editDoctor.phone}
            onChange={handleInputChange}
            placeholder="Phone"
          />
          <Input
            type="number"
            name="yearsOfExperience"
            value={editDoctor.yearsOfExperience}
            onChange={handleInputChange}
            placeholder="Years of Experience"
          />
          <Input
            type="text"
            name="address.city"
            value={editDoctor.address.city}
            onChange={handleInputChange}
            placeholder="City"
          />
          <Button type="submit">Save Changes</Button>
        </form>
      )}
    </div>
  );
}