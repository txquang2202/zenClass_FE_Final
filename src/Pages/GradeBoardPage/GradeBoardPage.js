import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAllGradeClass,
  editClassGrade,
  addGradeToClass,
  deleteAllGrade,
  editStatusGrade,
} from "../../services/gradeServices";

import { useClassDetailContext } from "../../context/ClassDetailContext";
import { addGradeReviewByID } from "../../services/gradeReviewServices";
import { toast } from "react-toastify";
import UploadModal from "../../components/Modal/UploadModal";
import Modal from "../../components/Modal/ClassDetailModal";
import Papa from "papaparse";
import { getClassByID } from "../../services/classServices";
import {
  addNotification,
  addNotificationTeacher,
} from "../../services/notificationServices";
import SearchIcon from "@mui/icons-material/Search";
// import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";

const YourComponent = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [grades, setGrades] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [allRatios, setAllRatios] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const { isClassOwner, isClassOwner2, detailClass } = useClassDetailContext();
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  let data;
  if (token) data = jwtDecode(token);

  const dataUser = localStorage.getItem("user");
  const user = JSON.parse(dataUser);
  const avtPath = `${user.img}`;

  const [reviewData, setReviewData] = useState({
    avt: "",
    fullname: "",
    userID: "",
    date: "",
    typeGrade: "",
    currentGrade: "",
    expectationGrade: "",
    explaination: "",
  });

  const [status, setStatus] = useState({
    statusGrade: false,
  });
  // const [error, setError] = useState(null);
  const [importedData, setImportedData] = useState([]);

  const [loading, setLoading] = React.useState(false);
  const [loading1, setLoading1] = React.useState(false);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before making the API request

    try {
      await editStatusGrade(id, token, {
        statusGrade: true,
      });
    } catch (error) {
      console.error("Error fetching review:", error);
    }

    try {
      const title = detailClass.title;
      const content = `The teacher has just finished finalizing your grade in your ${title} class!`;
      const link = "/home/classes/detail/grade-board/" + id;
      const currentDate = new Date();
      await addNotification(
        id,
        token,
        content,
        avtPath,
        currentDate,
        link,
        data.userID
      );
      toast.success("Submit successfully!");
    } catch (error) {
      console.error("Error adding  submit:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false); // Set loading to false after the API request is completed
    }
  };

  // feedback
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading1(true);
    try {
      const currentDate = new Date();
      const title = detailClass.title;
      const content = `The student with id: ${data.userID} requested a review in your ${title} class!`;
      const link = "/home/classes/detail/grade-review/" + id;
      await addNotificationTeacher(
        id,
        token,
        content,
        avtPath,
        currentDate,
        link,
        data.userID
      );
      // Gọi hàm API
      await addGradeReviewByID(
        id,
        token,
        avtPath,
        data.fullname,
        data.userID,
        currentDate,
        reviewData.typeGrade,
        reviewData.currentGrade,
        reviewData.expectationGrade,
        reviewData.explaination
      );
      // await addNotificationByID();
      closeModal();
      toast.success("Review added successfully!");
      closeModal1();
    } catch (error) {
      console.error("Error adding grade review:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading1(false); // Set loading to false after the API request is completed
    }
  };

  // Updated handleReviewDataChange function
  const handleReviewDataChange = (e, field) => {
    const { value } = e.target;
    setReviewData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvData = [["Student ID", "Full Name", ...allTopics, "Total"]];
    grades.forEach((student) => {
      // Check if any value is empty or undefined in the row
      if (
        student.studentId &&
        student.fullName &&
        allTopics.every(
          (topic) =>
            getScoreByTopic(student.grades, topic) !== undefined &&
            getScoreByTopic(student.grades, topic) !== ""
        )
      ) {
        const row = [
          student.studentId,
          student.fullName,
          ...allTopics.map((topic) =>
            getScoreByTopic(student.grades, topic).toString()
          ),
          calculateWeightedTotal(student.grades).toString(),
        ];
        csvData.push(row);
      }
    });

    const csv = Papa.unparse(csvData);

    const blob = new Blob([String.fromCharCode(0xfeff), csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "grades.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Import CSV
  const handleFileChange = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      if (file.type !== "text/csv") {
        // Display an error toast for unsupported file types
        toast.error("Unsupported file type. Please select a CSV file.");
        resetFileInput(fileInput);
        return;
      }

      Papa.parse(file, {
        complete: (result) => {
          // Assuming your CSV has a specific format
          // Update your state or perform other actions based on the parsed data
          const importedData = result.data;

          // Remove the last row if it's empty
          if (
            importedData.length > 0 &&
            Object.values(importedData[importedData.length - 1]).every(
              (value) => value === ""
            )
          ) {
            importedData.pop();
          }

          if (!isValidCSVStructure(importedData)) {
            // Display an error toast for invalid CSV structure
            toast.error(
              "Invalid CSV file structure. Please check the file format."
            );
          } else {
            // Check if all scores are within the range of 0 to 10
            const invalidScores = importedData.some((row) => {
              const scores = allTopics.map(
                (topic) => parseFloat(row[topic]) || 0
              );
              return scores.some((score) => score < 0 || score > 10);
            });

            if (invalidScores) {
              // Display an error toast for invalid scores
              toast.error(
                "Invalid scores. Please enter values between 0 and 10."
              );
              resetFileInput(fileInput);
              return;
            }

            // Check for duplicate Student IDs in the imported data
            const duplicateStudentIds = findDuplicateStudentIds(importedData);

            if (duplicateStudentIds.length > 0) {
              // Display an error toast for duplicate Student IDs
              toast.error(
                `Duplicate Student IDs found in the imported data: ${duplicateStudentIds.join(
                  ", "
                )}`
              );
              resetFileInput(fileInput);
              return;
            }

            updateStateWithImportedData(importedData);
          }

          resetFileInput(fileInput);
        },
        header: true,
      });
    }
  };

  const findDuplicateStudentIds = (importedData) => {
    const studentIdSet = new Set();
    const duplicateStudentIds = [];

    for (const row of importedData) {
      const studentId = row["Student ID"];

      if (studentIdSet.has(studentId)) {
        duplicateStudentIds.push(studentId);
      } else {
        studentIdSet.add(studentId);
      }
    }

    return duplicateStudentIds;
  };

  const resetFileInput = (fileInput) => {
    fileInput.value = "";
  };

  const isValidCSVStructure = (importedData) => {
    const requiredColumns = ["Student ID", "Full Name", ...allTopics, "Total"];

    return (
      Array.isArray(importedData) &&
      importedData.length > 0 &&
      requiredColumns.every((column) => importedData[0].hasOwnProperty(column))
    );
  };

  const updateStateWithImportedData = async (importedData) => {
    const updatedGrades = await Promise.all(
      importedData.map(async (row) => {
        const studentId = row["Student ID"];
        const fullName = row["Full Name"];
        const scores = allTopics.map((topic) => parseFloat(row[topic]) || 0);

        return {
          studentId,
          fullName,
          grades: allTopics.map((topic, index) => ({
            topic,
            score: scores[index],
          })),
        };
      })
    );
    setImportedData(importedData);
  };

  const handleCheck = async () => {
    const updatedGrades = await Promise.all(
      importedData.map(async (row) => {
        const studentId = row["Student ID"];
        const fullName = row["Full Name"];
        const scores = allTopics.map((topic) => parseFloat(row[topic]) || 0);

        return {
          studentId,
          fullName,
          grades: allTopics.map((topic, index) => ({
            topic,
            score: scores[index],
          })),
        };
      })
    );
    try {
      await addGradeToClass(id, updatedGrades, token);
      setGrades(updatedGrades);
      toast.success("CSV file imported successfully");
    } catch (error) {
      // setError(error.response.data.message);
      toast.error(error.response.data.message);
    }
    closeModal2();
  };

  // Modal
  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  // Modal
  const openModal1 = () => {
    setIsModalOpen1(true);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const openModal2 = () => {
    setIsModalOpen2(true);
  };

  const closeModal2 = () => {
    setImportedData([]);
    setIsModalOpen2(false);
  };

  // API getGrade
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllGradeClass(id, token);
        const data = response.data.grades;
        setGrades(data);

        const response1 = await getClassByID(id, token);
        const classInfo = response1.data.classInfo;

        setStatus({
          statusGrade: classInfo.statusGrade || "",
        });

        // Check if gradestructs is defined before extracting data
        if (classInfo.gradestructs && classInfo.gradestructs.length > 0) {
          // Lấy danh sách chủ đề từ dữ liệu đầu vào
          const topics = classInfo.gradestructs.map((grade) => grade.topic);

          // Lấy danh sách ratio từ dữ liệu đầu vào
          const ratios = classInfo.gradestructs.map((grade) => grade.ratio);

          setAllTopics(topics);
          setAllRatios(ratios);
        } else {
          console.error("gradestructs is undefined or empty");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, token]);

  // API Edit Grade
  const handleSave = async () => {
    try {
      const updatedGrade = {
        studentID: selectedStudent.studentId,
        newScore: allTopics.map((topic) => {
          const inputValue = document.getElementById(`current-${topic}`).value;
          return parseFloat(inputValue) || 0;
        }),
      };

      // Call the editClassGrade API
      await editClassGrade(id, token, updatedGrade);

      toast.success("Grade edited successfully:");

      // Update the grades array in state
      setGrades((prevGrades) => {
        const updatedGrades = prevGrades.map((student) => {
          if (student.studentId === selectedStudent.studentId) {
            // Update the grades for the selected student
            const updatedGrades = student.grades.map((grade) => {
              const topic = grade.topic;
              const inputValue = document.getElementById(
                `current-${topic}`
              ).value;
              const updatedScore = parseFloat(inputValue) || 0;
              return {
                ...grade,
                score: isNaN(updatedScore) ? 0 : updatedScore,
              };
            });
            return {
              ...student,
              grades: updatedGrades,
            };
          }
          return student;
        });
        return updatedGrades;
      });

      closeModal();
    } catch (error) {
      toast.error("Error editing grade:", error);
      console.error("Error while saving:", error);
    }
  };

  const handleInputChange = (topic, value) => {
    setInputValues({
      ...inputValues,
      [topic]: value,
    });
  };

  // TOTAL
  const calculateWeightedTotal = (grades) => {
    const unroundedTotal = grades.reduce((total, grade) => {
      const ratio = allRatios[allTopics.indexOf(grade.topic)] || 0;
      return total + (grade.score * ratio) / 100;
    }, 0);

    // Sử dụng toFixed(2) để làm tròn đến 2 chữ số thập phân
    const roundedTotal = parseFloat(unroundedTotal.toFixed(2));

    return roundedTotal;
  };

  // SORT
  const sortData = (data, key, direction) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (key === "total") {
        const totalA = calculateWeightedTotal(a.grades);
        const totalB = calculateWeightedTotal(b.grades);

        if (totalA < totalB) {
          return direction === "ascending" ? -1 : 1;
        }
        if (totalA > totalB) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      } else {
        // For other columns, use the existing logic
        if (a[key] < b[key]) {
          return direction === "ascending" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "ascending" ? 1 : -1;
        }
        return 0;
      }
    });
    return sortedData;
  };

  const handleSort = (key) => {
    if (key === "total") {
      const direction =
        sortConfig.key === key && sortConfig.direction === "ascending"
          ? "descending"
          : "ascending";

      setSortConfig({ key, direction });
    } else {
      // For other columns, use the existing logic
      const direction =
        sortConfig.key === key && sortConfig.direction === "ascending"
          ? "descending"
          : "ascending";

      setSortConfig({ key, direction });
    }
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ▲" : " ▼";
    }
    return null;
  };

  useEffect(() => {
    // Set default value for typeGrade if it's falsy
    if (!reviewData.typeGrade && allTopics.length > 0) {
      setReviewData((prevData) => ({
        ...prevData,
        typeGrade: allTopics[0],
      }));
    }
  }, [allTopics]);

  //  API Delete grade
  const handleDeleteGrade = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this grade?"
    );
    if (isConfirmed) {
      try {
        await deleteAllGrade(id, token);
        // setComments((prevComments) =>
        //   prevComments.filter((comment) => comment.id !== id)
        // );
        setGrades("");
        toast.success("Grade deleted successfully");
      } catch (error) {
        console.error("Error deleting grade:", error);
        toast.error("Error deleting grade");
      }
    }
  };

  return (
    <div className="mt-10">
      <h2 className="mt-10 text-2xl text-[#10375c] font-bold mb-4">
        Grade Board
      </h2>
      {/* SEARCH */}
      <div className="relative mt-2 flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by Full Name or Student ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 pl-10 border border-gray-300 rounded-md w-1/3 text-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
          <SearchIcon />
        </div>
      </div>
      {/* IMPORT / EXPORT */}
      {(isClassOwner || isClassOwner2) && (
        <div className="flex justify-between items-center">
          <div>
            <button className="text-red-500" onClick={handleDeleteGrade}>
              Delete Grade
            </button>
          </div>
          <div className="flex">
            <label
              htmlFor="test"
              className={`flex justify-end text-[#2E80CE] text-xs bg-white border border-[#2E80CE] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full px-3  mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer`}
            >
              <button
                type="button"
                onClick={openModal2}
                className="w-full h-full flex  items-center justify-center"
              >
                <svg
                  class="w-3 h-3 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                Import
              </button>
            </label>

            <button
              type="button"
              onClick={handleExportCSV}
              className=" ml-1 flex justify-end text-[#2E80CE] text-xs bg-white border border-[#2E80CE] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full  px-3 py-1.5 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              <svg
                class="w-3 h-3 me-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
              </svg>
              Export
            </button>
          </div>
        </div>
      )}
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 mb-6">
          {/* HEADER */}
          <thead>
            <tr>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => handleSort("studentId")}
              >
                Student ID
                {renderSortArrow("studentId")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => handleSort("fullName")}
              >
                Full Name
                {renderSortArrow("fullName")}
              </th>
              {allTopics.map((topic, index) => (
                <th key={topic} className="py-2 px-4 border-b cursor-pointer">
                  {`${topic}  ${allRatios[index]}%`}
                </th>
              ))}
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => handleSort("total")}
              >
                Total
                {renderSortArrow("total")}
              </th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>

          {/* CONTENT */}
          <tbody>
            {sortData(grades, sortConfig.key, sortConfig.direction)
              .filter(
                (student) =>
                  (student.fullName &&
                    student.fullName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())) ||
                  (student.studentId &&
                    student.studentId
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()))
              )
              .map(
                (student) =>
                  // Conditionally render the entire row
                  (isClassOwner ||
                    isClassOwner2 ||
                    (status.statusGrade === true &&
                      data.userID === student.studentId)) && (
                    <tr key={student._id} className="text-center">
                      <td className="py-2 px-4 border-b">
                        {student.studentId}
                      </td>
                      <td className="py-2 px-4 border-b">{student.fullName}</td>
                      {allTopics.map((topic) => (
                        <td key={topic} className="py-2 px-4 border-b">
                          {getScoreByTopic(student.grades, topic)}
                        </td>
                      ))}
                      <td className="py-2 px-4 border-b">
                        {calculateWeightedTotal(student.grades)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {isClassOwner || isClassOwner2 ? (
                          <button
                            className="bg-blue-500 text-white py-1 px-2 font-semibold font-sans rounded"
                            onClick={() => openModal(student)}
                          >
                            Edit
                          </button>
                        ) : (
                          <>
                            {data.userID === student.studentId && (
                              <button
                                className="bg-blue-500 text-white py-1 px-2 font-semibold font-sans rounded"
                                onClick={openModal1}
                              >
                                Feedback
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  )
              )}
          </tbody>
        </table>

        {/* Submit */}
        {(isClassOwner || isClassOwner2) && (
          <div className="text-center">
            {loading ? (
              <button
                disabled
                type="button"
                className="bg-blue-500 text-white mt-3  border-blue-400  hover:bg-blue-400  font-semibold font-sans rounded-full text-sm px-5 py-2.5  mb-2 "
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  class="inline w-4 h-4 me-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-500 text-white mt-3  border-blue-400  hover:bg-blue-400  font-semibold font-sans rounded-full text-sm px-5 py-2.5  mb-2 "
              >
                Submit
              </button>
            )}
          </div>
        )}

        {/* Modal Edit */}
        <Modal show={isModalOpen} handleClose={closeModal}>
          <h2 className="text-2xl font-semibold mb-4">Grades</h2>
          <form>
            {selectedStudent &&
              allTopics.map((topic) => (
                <div key={topic} className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">
                    {topic}
                  </label>
                  <input
                    id={`current-${topic}`}
                    type="number"
                    value={
                      inputValues[topic] ||
                      getScoreByTopic(selectedStudent.grades, topic)
                    }
                    onChange={(e) => handleInputChange(topic, e.target.value)}
                    min="0"
                    max="10"
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
              ))}
          </form>

          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={() => handleSave(inputValues)}
            >
              Save
            </button>
            <button
              className="border border-gray-300 px-4 py-2 rounded-md"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </Modal>

        {/* Modal FeedBack */}
        <Modal show={isModalOpen1} handleClose={closeModal1}>
          <h2 className="text-2xl font-semibold mb-4">Feed Back</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Type grade:
              </label>
              <input type="hidden" name="hidden" />
              <select
                name="typeGrade"
                id="grade"
                value={reviewData.typeGrade}
                onChange={(e) => handleReviewDataChange(e, "typeGrade")}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full"
              >
                {allTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Current grade:
              </label>
              <input
                id="current-currentGrade"
                type="number"
                value={reviewData.currentGrade}
                onChange={(e) => handleReviewDataChange(e, "currentGrade")}
                min="0"
                max="10"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Expectation grade:
              </label>
              <input
                id="expectationGrade"
                type="number"
                value={reviewData.expectationGrade}
                onChange={(e) => handleReviewDataChange(e, "expectationGrade")}
                min="0"
                max="10"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600">
                Explanation:
              </label>
              <textarea
                id="explaination"
                type="text"
                placeholder="Write your explanation here..."
                value={reviewData.explaination}
                onChange={(e) => handleReviewDataChange(e, "explaination")}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none"
              />
            </div>
          </form>

          <div className="flex justify-end">
            {loading1 ? (
              <button
                disabled
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  class="inline w-4 h-4 me-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </button>
            ) : (
              <button
                onClick={handleReviewSubmit}
                // onClick={handleEditClass}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Send
              </button>
            )}

            <button
              onClick={closeModal1}
              className="border border-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </Modal>

        {/* Modal Import */}
        <UploadModal show={isModalOpen2} handleClose={closeModal2}>
          <h2 className="text-2xl font-semibold mb-2">Preview</h2>

          <div className="flex  items-center justify-center mb-2">
            <label
              htmlFor="test"
              className={`flex justify-end text-[#2E80CE] px-6 py-2 text-lg bg-white border border-[#2E80CE] focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full   mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer`}
            >
              <div className="w-full h-full flex  items-center justify-center">
                <svg
                  class="w-4 h-4 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                <input
                  id="test"
                  type="file"
                  hidden
                  onChange={(event) => handleFileChange(event)}
                />
                Import
              </div>
            </label>
          </div>

          <table className="min-w-full bg-white border border-gray-300 mb-6">
            {/* Header */}
            <thead>
              <tr>
                {importedData.length > 0 &&
                  Object.keys(importedData[0]).map(
                    (columnName, index) =>
                      index < Object.keys(importedData[0]).length - 1 && (
                        <th key={columnName} className="py-2 px-4 border-b">
                          {columnName}
                        </th>
                      )
                  )}
              </tr>
            </thead>
            {/* Content */}
            <tbody>
              {importedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="text-center">
                  {Object.values(row).map(
                    (value, columnIndex) =>
                      columnIndex < Object.keys(importedData[0]).length - 1 && (
                        <td key={columnIndex} className="py-2 px-4 border-b">
                          {value}
                        </td>
                      )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            <button
              onClick={() => handleCheck()}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Check
            </button>
            <button
              onClick={closeModal2}
              className="border border-gray-300 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </UploadModal>
      </div>
    </div>
  );
};

const getScoreByTopic = (grades, topic) => {
  const grade = grades.find((g) => g.topic === topic);
  return grade ? grade.score : 0;
};

export default YourComponent;
