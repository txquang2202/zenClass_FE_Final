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

const DraggableRow = ({ grade, index, moveRow }) => {
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
  const [newGrades, setNewGrades] = useState({
    topic: "",
    ratio: 0,
  });
  const [edit, setEdit] = useState(null);

  // API delete grade
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this grade struct?"
    );
    if (isConfirmed) {
      try {
        await deleteGradeStruct(id, token);
        setGrades((prevGrades) =>
          prevGrades.filter((grade) => grade.id !== id)
        );
        toast.success("Grade deleted successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  // API edit grade
  const handleSave = async (id) => {
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

  const handleEdit = (id) => {
    setEdit(id);
    const editingGrade = grades.find((grade) => grade.id === id);
    setNewGrades({
      topic: editingGrade.topic,
      ratio: editingGrade.ratio,
    });
  };

  const handleCancel = async (id) => {
    try {
      await deleteGradeStruct(id, token);
      setGrades((prevGrades) => prevGrades.filter((grade) => grade.id !== id));
      toast.success("Grade cancel successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setEdit(null);
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
              <button
                className="bg-blue-500 text-white py-1 px-2 mr-2"
                onClick={() => handleSave(grade.id)}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white py-1 px-2"
                onClick={() => handleCancel(grade.id)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-blue-500 text-white py-1 px-2 mr-2 font-semibold font-sans rounded "
                onClick={() => handleEdit(grade.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white py-1 px-2 font-semibold font-sans rounded "
                onClick={() => handleDelete(grade.id)}
              >
                Delete
              </button>
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

  // API add grade
  const handleAddGrade = async (e) => {
    e.preventDefault();

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
          {grades.map((grade, index) => (
            <DraggableRow
              key={grade.id}
              grade={grade}
              index={index}
              moveRow={moveRow}
            />
          ))}
        </tbody>
      </table>

      {/* ADD GRADE */}
      {(isClassOwner || isClassOwner2) && (
        <div className="text-center">
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
