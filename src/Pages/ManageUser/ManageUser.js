import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "react-data-table-component";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteListUserbyID,
  getAllUsers,
  blockUserbyID,
  changestatusbyListuser,
  changeinforwithfile,
  Createwithfile,
} from "../../services/adminServices";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import Tooltip from "../../components/Tooltip/Tooltip";
import CSVReader from "react-csv-reader";
import { read, utils, write } from "xlsx";
import Papa from "papaparse";
import moment from "moment";
import { saveAs } from "file-saver";

function ManageUser() {
  const columns = [
    {
      name: "UserName",
      cell: (row) => (
        <>
          <Tooltip text={userinfor(row)}>
            <div>{row.username}</div>
          </Tooltip>
        </>
      ),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => {
        if (row.status === "Normal") {
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
        if (row.status === "Normal") {
          return (
            <div>
              <button
                className="w-[80px] mr-[20px] border-solid  border-[1px] p-[5px] pl-[10px] pr-[10px] bg-[#FF0000]"
                /*onClick={()=>handleBlockUser(row._id,row.username,row.status)}*/ onClick={() =>
                  openModalstatuschange(
                    addUserToListUser(row._id, row.username, row.status)
                  )
                }
              >
                Block
              </button>
              <button
                className=""
                /*onClick={()=>handleDeleteUser(row._id,row.username)}*/ onClick={() =>
                  openModalDel(
                    addUserToListUser(row._id, row.username, row.status)
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
                    addUserToListUser(row._id, row.username, row.status)
                  )
                }
              >
                Unblock
              </button>
              <button
                className=""
                /*onClick={()=>handleDeleteUser(row._id,row.username)}*/ onClick={() =>
                  openModalDel(
                    addUserToListUser(row._id, row.username, row.status)
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

  const [userlist, setUserlist] = useState("");
  const [search, SetSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const [listUser, setListUser] = React.useState([]);
  const [modalDelIsOpen, setModalDelIsOpen] = useState(false);
  const [modalStatusIsOpen, setModalStatusIsOpen] = useState(false);
  const [modalUploadFileIsOpen, setModalUploadFileIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userData, setUserData] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await getAllUsers();
      const userData = response.data.users;
      if (userData) {
        setUserlist(userData);
        setFilter(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const resultUsername = Object.values(userlist).filter((item) => {
      return item.username.toLowerCase().match(search.toLocaleLowerCase());
    });
    const resultEmail = Object.values(userlist).filter((item) => {
      return item.email.toLowerCase().match(search.toLocaleLowerCase());
    });

    const result = Array.from(new Set(resultUsername.concat(resultEmail)));
    setFilter(result);
  }, [search]);

  const handleDeleteUser = async (user) => {
    const ids = user.map((item) => item.id);
    try {
      const response = await deleteListUserbyID(ids);
      if (response.status === 200) {
        toast.success("Users deleted successfully");
        fetchUserData();
        setToggleCleared(!toggleCleared);
      } else {
        toast.error("Failed to delete users");
      }
    } catch (error) {
      console.error("Error deleting users:", error);
    }
    closeModaldel();
  };

  const handleBlockUser = async (user) => {
    const ids = user.map((item) => item.id);
    try {
      const response = await changestatusbyListuser(ids);
      if (response.status === 200) {
        toast.success("Users Block successfully");
        fetchUserData();
        setToggleCleared(!toggleCleared);
      } else {
        toast.error("Failed to Block users");
      }
    } catch (error) {
      console.error("Error Block users:", error);
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
        username: s.username,
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
  }, [listUser, toggleCleared, fetchUserData]);

  const addUserToListUser = (id, username, status) => {
    return [...listUser, { id, username, status }];
  };
  const clearList = () => {
    setListUser([]);
  };
  const openModalDel = (user) => {
    setListUser(user);
    setModalDelIsOpen(true);
  };

  const closeModaldel = () => {
    setModalDelIsOpen(false);
    clearList();
  };

  const openModalstatuschange = (user) => {
    setListUser(user);
    setModalStatusIsOpen(true);
  };

  const closeModalstatuschange = () => {
    setModalStatusIsOpen(false);
    clearList();
  };
  const openModalUploadfile = () => {
    setModalUploadFileIsOpen(true);
  };

  const closeModaluploadfile = () => {
    setModalUploadFileIsOpen(false);
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

  const handleFile = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const processData = (data) => {
    // Lấy chỉ các trường cần thiết từ dữ liệu
    const users = data.map((item) => ({
      userID: item.userID,
      username: item.username,
      email: item.email,
      fullname: item.fullname,
      birthdate: moment(item.birthdate, "DD/MM/YYYY").format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      ),
      phone: item.phone,
      gender: item.gender,
      street: item.street,
      city: item.city,
    }));

    // Set state với dữ liệu đã xử lý
    return users;
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);

        // Kiểm tra loại file để xác định cách xử lý
        if (file.name.endsWith(".csv")) {
          // Xử lý dữ liệu từ file CSV
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (result) => {
              const listdata = processData(result.data);
              console.log(listdata);
              resolve(listdata);
            },
            error: (error) => {
              console.error("Error parsing CSV:", error);
              reject(error);
            },
          });
        } else if (file.name.endsWith(".xlsx")) {
          // Xử lý dữ liệu từ file Excel
          const workbook = read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const excelData = utils.sheet_to_json(workbook.Sheets[sheetName], {
            raw: false,
            dateNF: "mm/dd/yyyy",
          });
          const listdata = processData(excelData);
          resolve(listdata);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const exportToExcel = (data, fileName, sheetName, columnConfigs) => {
    const wsData = [
      columnConfigs.map((config) => config.header),
      ...data.map((item) => columnConfigs.map((config) => item[config.key])),
    ];
    const ws = utils.aoa_to_sheet(wsData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, sheetName);

    const excelBuffer = write(wb, {
      bookType: "xlsx",
      bookSST: false,
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    link.click();
  };
  const handleFileUploadUser = async () => {
    if (selectedFile) {
      const listdata = await processFile(selectedFile);
      const true_user = listdata.filter(
        (itemA) =>
          userlist.some(
            (itemB) =>
              parseInt(itemA.userID) === itemB.userID &&
              itemA.username === itemB.username
          ) //user sửa thông tin
      );
      const userfail1 = listdata.filter((itemA) =>
        userlist.some(
          (itemB) =>
            parseInt(itemA.userID) === itemB.userID &&
            itemA.username !== itemB.username
        )
      );
      const userfail2 = listdata.filter((itemA) =>
        userlist.some(
          (itemB) =>
            parseInt(itemA.userID) !== itemB.userID &&
            itemA.username === itemB.username
        )
      );
      const userfail = [...new Set([...userfail1, ...userfail2])];
      const listcreate = listdata.filter((itemA) =>
        userlist.every(
          (itemB) =>
            parseInt(itemA.userID) !== itemB.userID &&
            itemA.username !== itemB.username
        )
      );

      if (true_user) {
        try {
          await Promise.all(
            true_user.map(async (item) => {
              const response = await changeinforwithfile(item);

              if (response.status === 200) {
                //toast.success("Users update file successfully");
                fetchUserData();
                setToggleCleared(!toggleCleared);
              } else {
                toast.error("Failed to update file users");
              }
            })
          );
        } catch (error) {
          console.error("Error Block users:", error);
        }
      }
      if (listcreate) {
        try {
          await Promise.all(
            listcreate.map(async (item) => {
              const response = await Createwithfile(item);
              if (response.status === 200) {
                fetchUserData();
                setToggleCleared(!toggleCleared);
              } else {
                toast.error("Failed to create file users");
              }
            })
          );
        } catch (error) {
          toast.error(error.response.data.message);
          return;
        }
      }

      if (userfail.length !== 0) {
        const updatedDataUsers = userfail.map((user) => ({
          ...user,
          error: "Initialization error due to duplicate userID or username",
        }));

        const columnConfigs = [
          { header: "userID", key: "userID" },
          { header: "username", key: "username" },
          { header: "email", key: "email" },
          { header: "fullname", key: "fullname" },
          { header: "birthdate", key: "birthdate" },
          { header: "phone", key: "phone" },
          { header: "gender", key: "gender" },
          { header: "street", key: "street" },
          { header: "city", key: "city" },
          { header: "error", key: "error" },
        ];
        exportToExcel(updatedDataUsers, "error", "Sheet 1", columnConfigs);
      }
      toast.success(
        "Change infor " +
          true_user.length +
          ", created " +
          listcreate.length +
          ", error " +
          userfail.length
      );
      true_user.splice(0, true_user.length);
      userfail.splice(0, userfail.length);
      listcreate.splice(0, listcreate.length);
      console.log(true_user);
      console.log(userfail);
      console.log(listcreate);
      closeModaluploadfile();
    }
  };
  return (
    <>
      <div className="relative  ">
        <div className="flex w-[100%] justify-between  pb-2">
          <h1 className="text-xl">User</h1>
          <div className="flex">
            <div className="flex items-center relative  pr-[10px]">
              <button
                className="border-black border-[1px]  p-1 bg-[#33CC66] "
                onClick={() => openModalUploadfile()}
              >
                Upload file
              </button>
            </div>
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
        isOpen={modalDelIsOpen}
        onRequestClose={closeModaldel}
        contentLabel="Create Class Modal"
        // className="h-36 w-[400px] hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center  md:inset-0  "
        className="h-36 w-[400px] absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
        // overlayClassName="overlay"
      >
        <div className="bg-white p-8 rounded-md border-solid border-2 border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Are you sure Delete?</h2>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-600">
              User:
            </label>
            <ul className="text-sm pl-3">
              {listUser.map((item) => (
                <li>{item.username}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={() => handleDeleteUser(listUser)}
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
      <Modal
        isOpen={modalStatusIsOpen}
        onRequestClose={closeModalstatuschange}
        contentLabel="Create Class Modal"
        // className="h-36 w-[400px] hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center  md:inset-0  "
        className="h-36 w-[400px] absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
        // overlayClassName="overlay"
      >
        <div className="bg-white p-8 rounded-md border-solid border-2 border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">
            Are you sure Change status?
          </h2>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-600">
              User:
            </label>
            <ul className="text-sm pl-3">
              {listUser.map((item) => (
                <li className="flex justify-between">
                  <div>{item.username}</div>
                  <div className="font-semibold">{item.status}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={() => handleBlockUser(listUser)}
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
        isOpen={modalUploadFileIsOpen}
        onRequestClose={closeModaluploadfile}
        contentLabel="Create Class Modal"
        // className="h-36 w-[400px] hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center  md:inset-0  "
        className="h-36 w-[400px] absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
        // overlayClassName="overlay"
      >
        <div className="bg-white p-8 rounded-md border-solid border-2 border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Upload File</h2>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-600">
              File:
            </label>
            <ul className="text-sm pl-3">
              <input type="file" accept=".csv, .xlsx" onChange={handleFile} />
            </ul>
            <label className="block text-base font-normal text-red-600">
              Note:
            </label>
            <ul className="text-base pl-3 text-red-600">
              <li>- Only accept excel or csv files</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={() => handleFileUploadUser()}
            >
              Upload
            </button>
            <button
              onClick={closeModaluploadfile}
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
