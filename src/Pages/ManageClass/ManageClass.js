import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "react-data-table-component";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteListUserbyID,
  changestatusbyListuser,
  getUserID,
} from "../../services/adminServices";
import {
  getClasses,
  changestatusbyListclass,
  deleteListClassbyID,
  deleteClassbyID,
} from "../../services/classServices";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import Tooltip from "../../components/Tooltip/Tooltip";

function ManageUser() {
  const columns = [
    {
      name: "Classname",
      cell: (row) => (
        <>
          <Tooltip text={userinfor(row)}>
            <div>{row.className}</div>
          </Tooltip>
        </>
      ),
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Students",
      cell: (row) => {
        return row.students.length;
      },
    },
    {
      name: "Teacher",
      cell: (row) => {
        const targetId = row.teachers[0];
        const fullName = getFullNameById(teacherList, targetId);
        return fullName ? fullName : "Not found";
      },
    },
    {
      name: "Status",
      cell: (row) => {
        if (row.status === "Active") {
          return (
            <div className="w-[80px] border-solid  border-[1px] p-[5px] pl-[10px] pr-[10px] bg-[#00FF41] text-center">
              {row.status}
            </div>
          );
        } else {
          return (
            <div className="w-[80px] border-solid  border-[1px] p-[5px] pl-[10px] pr-[10px] bg-[#FFCC00] text-center">
              {row.status}
            </div>
          );
        }
      },
    },
    {
      name: "Action",
      cell: (row) => {
        if (row.status === "Active") {
          return (
            <div>
              <button
                className="w-[80px] mr-[20px] border-solid  border-[1px] p-[5px] pl-[10px] pr-[10px] bg-[#FF0000]"
                /*onClick={()=>handleBlockUser(row._id,row.username,row.status)}*/ onClick={() =>
                  openModalstatuschange(
                    addUserToListclass(row._id, row.className, row.status)
                  )
                }
              >
                Inactive
              </button>
              <button
                className=""
                /*onClick={()=>handleDeleteUser(row._id,row.username)}*/ onClick={() =>
                  openModalDel(
                    addUserToListclass(row._id, row.className, row.status)
                  )
                }
              >
                <DeleteIcon />
              </button>
            </div>
          );
        } else {
          return (
            <div>
              <button
                className="w-[80px] mr-[20px] border-solid  border-[1px] p-[5px] pl-[10px] pr-[10px] bg-[#00FF41]"
                /*onClick={()=>handleBlockUser(row._id,row.username,row.status)}*/ onClick={() =>
                  openModalstatuschange(
                    addUserToListclass(row._id, row.className, row.status)
                  )
                }
              >
                Active
              </button>
              <button
                className=""
                /*onClick={()=>handleDeleteUser(row._id,row.username)}*/ onClick={() =>
                  openModalDel(
                    addUserToListclass(row._id, row.className, row.status)
                  )
                }
              >
                <DeleteIcon />
              </button>
            </div>
          );
        }
      },
    },
  ];

  const [classlist, setClasslist] = useState("");
  const [teacherID, setTeacherID] = useState("");
  const [teacherList, setTeacherList] = useState("");
  const [search, SetSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const [listClass, setListClass] = React.useState([]);
  const [modalDelIsOpen, setModalDelIsOpen] = useState(false);
  const [modalStatusIsOpen, setModalStatusIsOpen] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await getClasses();
      const Data = response.data.classes;
      if (Data) {
        setTeacherID(Data.map((teacher) => teacher.teachers));
        setClasslist(Data);
        setFilter(Data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchteacherData = async (teacherID) => {
    try {
      const flatArray = [...new Set(teacherID.flat())];
      const response = await getUserID(flatArray);
      const Data = response.data.users;
      const teacher = Data.map((user) => ({
        ID: user._id,
        fullname: user.fullname,
      }));
      setTeacherList(teacher);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchteacherData(teacherID);
  }, [teacherID]);

  function getFullNameById(array, targetId) {
    for (const element of array) {
      if (element.ID === targetId) {
        return element.fullname;
      }
    }
    return null;
  }

  useEffect(() => {
    const resultClassName = Object.values(classlist).filter((item) => {
      return item.className.toLowerCase().includes(search.toLowerCase());
    });

    const resultTitle = Object.values(classlist).filter((item) => {
      return item.title.toLowerCase().includes(search.toLowerCase());
    });

    const resultFullname = Object.values(classlist).filter((item) => {
      const teacherId = item.teachers[0];
      const teacherInfo = teacherList.find(
        (teacher) => teacher.ID === teacherId
      );
      return (
        teacherInfo &&
        teacherInfo.fullname.toLowerCase().includes(search.toLowerCase())
      );
    });

    // Kết hợp kết quả từ cả ba mảng và loại bỏ các phần tử trùng lặp
    const result = Array.from(
      new Set(resultClassName.concat(resultTitle, resultFullname))
    );
    setFilter(result);
  }, [search]);

  const handleDeleteClass = async (classes) => {
    const ids = classes.map((item) => item.id);
    const token = localStorage.getItem("token");

    try {
      const response = await deleteClassbyID(ids[0], token);
      if (response.status === 200) {
        toast.success("Classes deleted successfully");
        fetchUserData();
        setToggleCleared(!toggleCleared);
      } else {
        toast.error("Failed to delete Classes");
      }
    } catch (error) {
      console.error("Error deleting Classes:", error);
    }
    closeModaldel();
  };
  const handleActiveClass = async (classes) => {
    const ids = classes.map((item) => item.id);
    try {
      const response = await changestatusbyListclass(ids);
      if (response.status === 200) {
        toast.success("Class Block successfully");
        fetchUserData();
        setToggleCleared(!toggleCleared);
      } else {
        toast.error("Failed to Block class");
      }
    } catch (error) {
      console.error("Error Block class:", error);
    }
    closeModalstatuschange();
  };

  const tableHeaderstyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "14px",
        backgroundColor: "#ccc",
      },
    },
  };

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(
      state.selectedRows.map((s) => ({
        id: s._id,
        className: s.className,
        status: s.status,
      }))
    );
  }, []);
  const contextActions = React.useMemo(() => {
    return (
      <div>
        <button
          key="delete"
          onClick={() => openModalstatuschange(selectedRows)}
          className="w-[150px] mr-[20px]  pt-[5px] pb-[5px] pl-[10px] pr-[10px] bg-[#d7c573]"
          icon
        >
          Status change
        </button>
        <button
          key="delete"
          onClick={() => openModalDel(selectedRows)}
          className="pt-[5px] pb-[5px] pl-[10px] pr-[10px] bg-[#FF0000]"
          icon
        >
          Delete
        </button>
      </div>
    );
  }, [listClass, toggleCleared, fetchUserData]);

  const addUserToListclass = (id, className, status) => {
    return [...listClass, { id, className, status }];
  };
  const clearList = () => {
    setListClass([]);
  };
  const openModalDel = (classes) => {
    setListClass(classes);
    setModalDelIsOpen(true);
  };

  const closeModaldel = () => {
    setModalDelIsOpen(false);
    clearList();
  };

  const openModalstatuschange = (classes) => {
    setListClass(classes);
    setModalStatusIsOpen(true);
  };

  const closeModalstatuschange = () => {
    setModalStatusIsOpen(false);
    clearList();
  };

  const userinfor = (user) => {
    return (
      <>
        <div>Username: {user.username}</div>
        <div>Email: {user.email}</div>
        <div>Fullname: {user.fullname}</div>
      </>
    );
  };

  return (
    <>
      <div className="relative  ">
        <div className="flex w-[100%] justify-between  pb-2">
          <h1 className="text-xl">Classes</h1>
          <div className="flex">
            <div className="flex items-center relative ">
              <SearchIcon className="absolute ml-[85%] " />
              <input
                className=" border-black border-[1px]  p-1 "
                placeholder="Search User"
                value={search}
                onChange={(e) => SetSearch(e.target.value)}
              ></input>
            </div>
          </div>
        </div>

        <div className="bg-black">
          <DataTable
            title=" "
            customStyles={tableHeaderstyle}
            columns={columns}
            data={filter}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            selectableRows
            contextActions={contextActions}
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
            persistTableHead
          />
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Modal
        isOpen={modalStatusIsOpen}
        onRequestClose={closeModalstatuschange}
        contentLabel="Create Class Modal"
        // className="h-36 w-[400px] hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center  md:inset-0  "
        className="h-36 w-[400px] absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
        // overlayClassName="overlay"
      >
        <div className="bg-white p-8 rounded-md border-solid border-2 border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">
            Are you sure Change status?
          </h2>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-600">
              Class:
            </label>
            <ul className="text-sm pl-3">
              {listClass.map((item) => (
                <li className="flex justify-between">
                  <div>{item.className}</div>
                  <div className="font-semibold">{item.status}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={() => handleActiveClass(listClass)}
            >
              Change status
            </button>
            <button
              onClick={closeModalstatuschange}
              className="border border-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalDelIsOpen}
        onRequestClose={closeModaldel}
        contentLabel="Create Class Modal"
        // className="h-36 w-[400px] hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center  md:inset-0  "
        className="h-36 w-[400px] absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
        // overlayClassName="overlay"
      >
        <div className="bg-white p-8 rounded-md border-solid border-2 border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Are you sure Delete?</h2>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-600">
              Class:
            </label>
            <ul className="text-sm pl-3">
              {listClass.map((item) => (
                <li>{item.className}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={() => handleDeleteClass(listClass)}
            >
              Delete
            </button>
            <button
              onClick={closeModaldel}
              className="border border-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ManageUser;
