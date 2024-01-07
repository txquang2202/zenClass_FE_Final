import React, { useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Toolbar,
  IconButton,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LockResetIcon from "@mui/icons-material/LockReset";
import { resetPassword } from "../../services/userServices";

function ForgotPassword(props) {
  // LAYOUT
  const paperStyle = {
    padding: "0 50px 50px 50px",
    height: "300px",
    width: "540px",
    margin: "0 auto",
  };

  const bg = {
    backgroundImage:
      "url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  const avatarStyle = { backgroundColor: "#10375C" };
  const btnstyle = { margin: "8px 0", backgroundColor: "#10375C" };

  // EVENT
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    const { email } = credentials;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !email.match(emailRegex)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await resetPassword({ email: email });
      // console.log(response.data);
      if (response.status === 200) {
        toast.success("Send reset code successful");
        setTimeout(() => {
          navigate("/send-mail-success");
        }, 1000);
      } else if (response.status === 400) {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error while sending email", error);
        navigate("/500");
      }
    }
  };

  return (
    <Grid
      className="font-sans pt-12 h-screen bg-gradient-to-br from-[#10375C] via-blue-700 to-blue-800"
      style={bg}
    >
      <Paper style={paperStyle} className="relative">
        <IconButton
          color="inherit"
          component={Link}
          to="/signin"
          className="absolute top-0 left-[-2px]"
        >
          <ArrowLeftIcon />
        </IconButton>

        <Grid align="center" className="mb-6 pt-8">
          <Avatar style={avatarStyle}>
            <LockResetIcon />
          </Avatar>
          <h2 className="text-2xl mt-1">Forgot Password</h2>
        </Grid>
        <form>
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            placeholder="Enter your email"
            name="email"
            value={credentials.email}
            className="text-2xl"
            onChange={handleInputChange}
            onKeyPress={(e) =>
              e.charCode === 13 && e.code === "Enter" && handleEmail(e)
            }
          />

          <Button
            type="button"
            color="primary"
            variant="contained"
            style={btnstyle}
            fullWidth
            onClick={handleEmail}
            className="text-xl"
          >
            Send Reset Code
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

export default ForgotPassword;
