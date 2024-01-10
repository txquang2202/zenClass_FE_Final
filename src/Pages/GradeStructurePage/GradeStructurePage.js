import React, { useContext, useState } from "react";
import { GradeContext } from "../../context/GradeContext";
import { useClassDetailContext } from "../../context/ClassDetailContext";
import {
  addGradeStruct,
  editGradeStruct,
  deleteGradeStruct,
} from "../../services/gradeStructureServices";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import { useDrag, useDrop } from "react-dnd";

const TYPE = "GRADE"; // Unique type for the drag-and-drop

const DraggableRow = ({
  grade,
  index,
  moveRow,
  handleEdit,
  handleCancel,
  handleSave,
  handleTextFieldChange,
  newGrades,
  edit,
  loading1,
  loading3,
}) => {
  const [, ref] = useDrag({
    type: TYPE,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const token = localStorage.getItem("token");
  const { grades, setGrades } = useContext(GradeContext);
  const { isClassOwner, isClassOwner2 } = useClassDetailContext();
  const [loading2, setLoading2] = React.useState(false);

  // API delete grade
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this grade struct?"
    );
    if (isConfirmed) {
      setLoading2(true); // Set loading to true before making the API request

      try {
        await deleteGradeStruct(id, token);
        setGrades((prevGrades) =>
          prevGrades.filter((grade) => grade.id !== id)
        );
        toast.success("Grade deleted successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading2(false); // Set loading to false after the API request is completed
      }
    }
  };

  return (
    <tr ref={(node) => ref(drop(node))}>
      <td className="py-2 px-4 border-b">
        {edit === grade.id ? (
          <TextField
            id="outlined-text"
            type="text"
            placeholder="New topic"
            value={newGrades.topic}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            className="w-32"
            onChange={(e) => handleTextFieldChange(e, "topic")}
          />
        ) : (
          grade.topic
        )}
      </td>
      <td className="py-2 px-4 border-b">
        {edit === grade.id ? (
          <TextField
            id="outlined-number"
            type="number"
            value={newGrades.ratio}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            className="w-20"
            onChange={(e) => handleTextFieldChange(e, "ratio")}
          />
        ) : (
          `${grade.ratio}%`
        )}
      </td>
      {(isClassOwner || isClassOwner2) && (
        <td className="py-2 px-4 border-b">
          {edit === grade.id ? (
            <>
              {loading3 ? (
                <button
                  disabled
                  type="button"
                  className="bg-blue-500 text-white py-1 px-2 mr-2"
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
                  Loading
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white py-1 px-2 mr-2"
                  onClick={() => handleSave(grade.id)}
                >
                  Save
                </button>
              )}

              {loading1 ? (
                <button
                  disabled
                  type="button"
                  className="bg-red-500 text-white py-1 px-2 text-base"
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
                  Loading
                </button>
              ) : (
                <button
                  className="bg-red-500 text-white py-1 px-2"
                  onClick={() => handleCancel(grade.id)}
                >
                  Cancel
                </button>
              )}
            </>
          ) : (
            <>
              <button
                className="bg-blue-500 text-white py-1 px-2 mr-2 font-semibold font-sans rounded "
                onClick={() => handleEdit(grade.id)}
              >
                Edit
              </button>
              {loading2 ? (
                <button
                  disabled
                  type="button"
                  className="bg-red-500 text-white py-1 px-2 font-semibold font-sans rounded "
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
                  Loading
                </button>
              ) : (
                <button
                  className="bg-red-500 text-white py-1 px-2 font-semibold font-sans rounded "
                  onClick={() => handleDelete(grade.id)}
                >
                  Delete
                </button>
              )}
            </>
          )}
        </td>
      )}
    </tr>
  );
};

const GradeStructure = () => {
  const [sortOrder, setSortOrder] = useState("");
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const { grades, setGrades } = useContext(GradeContext);
  const { isClassOwner, isClassOwner2 } = useClassDetailContext();
  const [newGrades, setNewGrades] = useState({
    topic: "",
    ratio: 0,
  });
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = React.useState(false);
  const [loading1, setLoading1] = React.useState(false);
  const [loading3, setLoading3] = React.useState(false);

  // Common logic for handling edit state
  const handleEdit = (id) => {
    setEdit(id);
    const editingGrade = grades.find((grade) => grade.id === id);
    setNewGrades({
      topic: editingGrade.topic,
      ratio: editingGrade.ratio,
    });
  };

  const handleCancel = async (id) => {
    setLoading1(true);

    try {
      await deleteGradeStruct(id, token);
      setGrades((prevGrades) => prevGrades.filter((grade) => grade.id !== id));
      toast.success("Grade cancel successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading1(false); // Set loading to false after the API request is completed
    }
    setEdit(null);
  };

  const handleSave = async (id) => {
    setLoading3(true);
    try {
      const formSub = {
        topic: newGrades.topic,
        ratio: newGrades.ratio,
      };

      await editGradeStruct(id, token, formSub);

      toast.success("Grade edited successfully");
      setEdit(null);

      setGrades((prevGrades) =>
        prevGrades.map((grade) =>
          grade.id === id ? { ...grade, ...formSub } : grade
        )
      );
      // Đặt lại state newGrades sau khi lưu thành công
      setNewGrades({
        topic: "",
        ratio: 0,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading3(false); // Set loading to false after the API request is completed
    }
  };

  const handleTextFieldChange = (e, field) => {
    let value;

    if (field === "ratio") {
      // Ensure the value is a valid integer and restrict it to the range [0, 100]
      value = Math.min(100, Math.max(0, parseInt(e.target.value, 10))) || 0;
    } else {
      value = e.target.value;
    }

    setNewGrades((prevGrades) => ({
      ...prevGrades,
      [field]: value,
    }));
  };

  // API add grade
  const handleAddGrade = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await addGradeStruct(
        id,
        token,
        newGrades.topic,
        newGrades.ratio
      );
      const newGrade = {
        id: response.data.gradeStruct._id || "",
        topic: response.data.gradeStruct.topic || "",
        ratio: response.data.gradeStruct.ratio || 0,
      };

      setGrades((prevGrades) => [
        ...prevGrades,
        {
          id: response.data.gradeStruct._id || "",
          topic: response.data.gradeStruct.topic || "",
          ratio: response.data.gradeStruct.ratio || 0,
        },
      ]);
      setEdit(newGrade.id);
      setNewGrades({
        topic: "",
        ratio: 0,
      });

      toast.success("Grade added successfully");
    } catch (error) {
      //  console.error("Error creating grade:", error);
      toast.error(error.response.data.message);
      // navigate("/500");
    } finally {
      setLoading(false); // Set loading to false after the API request is completed
    }
  };

  // SORT
  const handleSortByRatio = () => {
    const sortedGrades = [...grades].sort((a, b) => {
      return sortOrder === "asc" ? a.ratio - b.ratio : b.ratio - a.ratio;
    });

    setGrades(sortedGrades);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // TOTAL
  const calculateTotal = () => {
    return grades.reduce((acc, grade) => acc + grade.ratio, 0);
  };

  const isTotalValid = calculateTotal() === 100;

  //
  const moveRow = (dragIndex, hoverIndex) => {
    const draggedGrade = grades[dragIndex];
    const updatedGrades = [...grades];
    updatedGrades.splice(dragIndex, 1);
    updatedGrades.splice(hoverIndex, 0, draggedGrade);
    setGrades(updatedGrades);
  };

  // Rest of the code remains unchanged...

  return (
    <div className="p-4">
      <h1 className="text-2xl text-[#10375c] font-bold mb-4">
        Grade Structure
      </h1>
      {/* ... (rest of the code remains unchanged) */}
      <table className="w-full border-collapse border border-gray-300 mb-3">
        {/* HEADER  */}
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Topic</th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={handleSortByRatio}
            >
              Ratio
              {sortOrder === "asc" ? " ▲" : " ▼"}
            </th>
            {(isClassOwner || isClassOwner2) && (
              <th className="py-2 px-4 border-b">Action</th>
            )}
          </tr>
        </thead>

        {/* CONTENT */}
        <tbody className="text-center">
          {/* GRADES */}
          {grades.length > 0 ? (
            grades.map((grade, index) => (
              <DraggableRow
                key={grade.id}
                grade={grade}
                index={index}
                moveRow={moveRow}
                handleEdit={handleEdit}
                handleCancel={handleCancel}
                handleSave={handleSave}
                handleTextFieldChange={handleTextFieldChange}
                newGrades={newGrades}
                edit={edit}
                loading1={loading1}
                loading3={loading3}
              />
            ))
          ) : (
            <tr>
              <td colSpan={3} className="py-4 text-gray-500">
                No grade structures available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ADD GRADE */}
      {(isClassOwner || isClassOwner2) && (
        <div className="text-center">
          {loading ? (
            <button
              disabled
              type="button"
              className={`bg-blue-500
               text-white mt-3 border-blue-400 hover:bg-blue-400 font-semibold font-sans rounded-full text-sm px-5 py-2.5 mb-2`}
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
              onClick={handleAddGrade}
              disabled={edit !== null}
              className={`bg-${
                edit !== null ? "gray-500" : "blue-500"
              } text-white mt-3 border-blue-400 hover:bg-blue-400 font-semibold font-sans rounded-full text-sm px-5 py-2.5 mb-2`}
            >
              Add Grade
            </button>
          )}
        </div>
      )}

      {/* TOTAL */}
      {isTotalValid ? (
        <h2 className="text-xl font-semibold text-[#10375c]">
          Total: {calculateTotal() + "%"}
        </h2>
      ) : (
        <>
          <h2 className="inline text-xl font-semibold mr-3 text-[#10375c]">
            Total: {calculateTotal() + "%"}
          </h2>
          <span className="text-red-500">
            Error: Total must be equal to 100%.
          </span>
        </>
      )}
    </div>
  );
};

export default GradeStructure;
