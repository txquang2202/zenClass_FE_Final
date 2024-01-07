import React, { useState } from "react";
import { Grid, Paper, Avatar, TextField, Button } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LockResetIcon from "@mui/icons-material/LockReset";
import { updatePassword } from "../../services/userServices";
import { jwtDecode } from "jwt-decode";

function ResetPassword(props) {
  // LAYOUT
  const [userDetails, setUserDetails] = useState({
    password: "",
    confirmPassword: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const paperStyle = {
    padding: "40px 50px 50px 50px",
    height: "360px",
    width: "640px",
    margin: "0 auto",
  };

  const bg = {
    backgroundImage:
      "url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  // EVENT
  const avatarStyle = { backgroundColor: "#10375C" };
  const btnstyle = { margin: "10px 0", backgroundColor: "#10375C" };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (userDetails.password !== userDetails.confirmPassword) {
      toast.error("Confirm password does not match!!");
      return;
    }
    try {
      const response = await updatePassword(id, userDetails);
      if (response.status === 200) {
        toast.success("Update successful");
        setTimeout(() => {
          navigate(`/home`);
        }, 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error updating password:", error);
      navigate("/500");
    }
  };

  return (
    <Grid
      className="font-sans pt-12 h-screen bg-gradient-to-br from-[#10375C] via-blue-700 to-blue-800"
      style={bg}
    >
      <Paper style={paperStyle}>
        <Grid align="center" className="mb-6">
          <Avatar style={avatarStyle}>
            <LockResetIcon />
          </Avatar>
          <h2 className="text-2xl mt-1">Update Password</h2>
        </Grid>

        <form>
          <TextField
            fullWidth
            label="New Password"
            placeholder="Enter your new password"
            type="password"
            name="password"
            value={userDetails.password}
            variant="standard"
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            name="confirmPassword"
            variant="standard"
            value={userDetails.confirmPassword}
            onChange={handleInputChange}
            onKeyPress={(e) =>
              e.charCode === 13 && e.code === "Enter" && handleUpdate(e)
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={btnstyle}
            fullWidth
            onClick={handleUpdate}
          >
            CHANGE PASSWORD
          </Button>
        </form>
      </Paper>
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
    </Grid>
  );
}

export default ResetPassword;
