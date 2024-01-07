import React, { createContext, useEffect, useState } from "react";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { getAllGradeStructs } from "../services/gradeStructureServices";
import { useNavigate } from "react-router-dom";
import { getAllGradeClass } from "../services/gradeServices";

export const GradeContext = createContext();

export const GradeProvider = ({ children }) => {
  var urlString = window.location.href;
  var id1 = extractFinalId(urlString);
  const [grades, setGrades] = useState([]);
  const token = localStorage.getItem("token");
  const [board, setBoard] = useState([]);
  // console.log(board);
  const [tempValues, setTempValues] = useState({});
  const navigate = useNavigate();

  const updateTempValues = (studentId, topic, value) => {
    setTempValues((prevTempValues) => ({
      ...prevTempValues,
      [studentId]: {
        ...prevTempValues[studentId],
        [topic]: value,
      },
    }));
  };

  // IMPORT
  const handleImportCSV = (file) => {
    // Modify the handleImportCSV function to use context state and functions
    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            let importedData = rawCSV.map((item) => {
              return {
                id: item.ID,
                name: item.Name,
                ...grades.reduce((acc, grade) => {
                  acc[grade.topic] =
                    item[`${grade.topic} ${grade.ratio}%`] || 0;
                  return acc;
                }, {}),
                total: item.Total || 0,
              };
            });
            setBoard(importedData);
            // Update the tempValues state based on the new board data
            let updatedTempValues = {};
            importedData.forEach((student) => {
              updatedTempValues[student.id] = { ...student };
            });
            setTempValues(updatedTempValues);

            toast.success("Import successful!");
          } else {
            toast.error("No data found in CSV file!");
          }
        },
      });
    } else {
      toast.error("Only accept CSV files");
    }
  };

  function extractFinalId(input) {
    if (input.includes("/homework")) {
      // Trích xuất ID nếu có phần "/homework" trong input
      var match = input.match(/\/([^\/]+)\/homework/);
      return match ? match[1] : null;
    } else {
      // Trích xuất ID từ cuối đường dẫn nếu không có phần "/homework"
      const parts = input.split("/");
      return parts[parts.length - 1];
    }
  }

  //API get gradestructure
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getAllGradeStructs(id1, token);
        const data = response.data.gradestructs.map((grade) => ({
          id: grade._id || "",
          topic: grade.topic || "",
          ratio: grade.ratio || "",
        }));
        setGrades(data || []);
      } catch (error) {
        console.error("Error fetching grade structure:", error);
        toast.error(error.response.data.message);
        navigate("/500");
      }
    };
    fetchUserData();
  }, [id1, token, navigate]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await getAllGradeClass(id1, token);
        const students = response.data.grades;

        if (students) {
          const mappedStudents = students.map((data) => ({
            id: data.studentId || "",
            name: data.fullName || "",
          }));
          // setTempValues(updatedBoard);
          setBoard(mappedStudents);
        }
      } catch (error) {
        toast.error(error.response.data.message);
        navigate("/500");
      }
    };
    fetchStudentData();
  }, [id1, token, navigate]);
  return (
    <GradeContext.Provider
      value={{
        grades,
        setGrades,
        board,
        setBoard,
        tempValues,
        updateTempValues,
        setTempValues,
        handleImportCSV,
      }}
    >
      {children}
    </GradeContext.Provider>
  );
};
