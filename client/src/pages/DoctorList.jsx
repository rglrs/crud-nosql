import { useState, useEffect } from "react";
import axios from "axios";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const TABS = [
  { label: "All", value: "all" },
  { label: "Monitored", value: "monitored" },
  { label: "Unmonitored", value: "unmonitored" },
];

const TABLE_HEAD = [
  "Name",
  "Email",
  "Phone",
  "Experience",
  "Address",
  "Actions",
];

export function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    yearsOfExperience: "",
    address: { city: "", street: "" },
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

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
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (doctorId) => {
    setDoctorToDelete(doctorId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/doctor/${doctorToDelete}`);
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doc) => doc._id !== doctorToDelete)
      );
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/doctor/${selectedDoctor._id}`,
        selectedDoctor
      );
      setDoctors((prevDoctors) =>
        prevDoctors.map((doc) =>
          doc._id === selectedDoctor._id ? selectedDoctor : doc
        )
      );
      handleModalClose();
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewDoctor({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      yearsOfExperience: "",
      address: { city: "", street: "" },
    });
  };

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/doctor",
        newDoctor
      );
      setDoctors((prevDoctors) => [...prevDoctors, response.data.doctor]);
      handleAddModalClose();
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

   // Pagination handlers
   const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredDoctors.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate the current page's doctors
  const indexOfLastDoctor = currentPage * itemsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card className="scla">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Data Psikiater
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm">
              view all
            </Button>
            <Button
              className="flex items-center gap-3"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {currentDoctors.map((doctor, index) => {
              const isLast = index === currentDoctors.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={doctor._id}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {doctor.firstName} {doctor.lastName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {doctor.email}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {doctor.phone}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {doctor.yearsOfExperience} years
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {doctor.address.city}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="flex gap-2">
                      <Tooltip content="Edit Doctor">
                        <IconButton
                          variant="text"
                          onClick={() => handleEditClick(doctor)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete Doctor">
                        <IconButton
                          variant="text"
                          onClick={() => handleDeleteClick(doctor._id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
        Page {currentPage} of {Math.ceil(filteredDoctors.length / itemsPerPage)}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(doctors.length / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      </CardFooter>

      <Dialog open={isModalOpen} handler={handleModalClose}>
        <DialogHeader>Edit Doctor</DialogHeader>
        <DialogBody>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <Input
                label="First Name"
                value={selectedDoctor?.firstName || ""}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    firstName: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="Last Name"
                value={selectedDoctor?.lastName || ""}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    lastName: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="Email"
                value={selectedDoctor?.email || ""}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="Phone"
                value={selectedDoctor?.phone || ""}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="Years of Experience"
                type="number"
                value={selectedDoctor?.yearsOfExperience || ""}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    yearsOfExperience: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="City"
                value={selectedDoctor?.address.city || ""}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    address: {
                      ...selectedDoctor.address,
                      city: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="Street"
                value={selectedDoctor?.address.street || ""}
                onChange={(e) =>
                  setSelectedDoctor({
                    ...selectedDoctor,
                    address: {
                      ...selectedDoctor.address,
                      street: e.target.value,
                    },
                  })
                }
              />
            </div>
            <DialogFooter>
              <Button variant="text" color="red" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="gradient" color="green" type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogBody>
      </Dialog>

      <Dialog open={isAddModalOpen} handler={handleAddModalClose}>
        <DialogHeader>Add New Doctor</DialogHeader>
        <DialogBody>
          <form onSubmit={handleAddFormSubmit}>
            <div className="mb-4">
              <Input
                label="First Name"
                value={newDoctor.firstName}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, firstName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="Last Name"
                value={newDoctor.lastName}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, lastName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="Email"
                value={newDoctor.email}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, email: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="Phone"
                value={newDoctor.phone}
                onChange={(e) =>
                  setNewDoctor({ ...newDoctor, phone: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="Years of Experience"
                type="number"
                value={newDoctor.yearsOfExperience}
                onChange={(e) =>
                  setNewDoctor({
                    ...newDoctor,
                    yearsOfExperience: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="City"
                value={newDoctor.address.city}
                onChange={(e) =>
                  setNewDoctor({
                    ...newDoctor,
                    address: { ...newDoctor.address, city: e.target.value },
                  })
                }
              />
            </div>
            <div className="mb-4">
              <Input
                label="Street"
                value={newDoctor.address.street}
                onChange={(e) =>
                  setNewDoctor({
                    ...newDoctor,
                    address: { ...newDoctor.address, street: e.target.value },
                  })
                }
              />
            </div>
            <DialogFooter>
              <Button variant="text" color="red" onClick={handleAddModalClose}>
                Cancel
              </Button>
              <Button variant="gradient" color="green" type="submit">
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogBody>
      </Dialog>

      <Dialog open={isConfirmOpen} handler={() => setIsConfirmOpen(false)}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          <Typography>Are you sure you want to delete this doctor?</Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsConfirmOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={confirmDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}
